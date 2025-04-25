import { FunctionParameters, MapJSTypeToGolangType } from "@/lib/common";

// handle comments, handle | null operators
export const fromJSInterfaceToGoStruct = (
  data: string,
  conversionParameters: FunctionParameters
) => {
  if (
    conversionParameters.tag === undefined ||
    conversionParameters.tag.length == 0
  ) {
    throw Error("Tag cannot be empty.");
  }
  validateJSInterface(data);
  data = data.replace(/\s+/gm, " ").trim();
  const structName = data.split(" ")[1];
  let result = `type struct ${structName} {\n`;

  data = data.substring(data.indexOf("{") + 1, data.indexOf("}")).trim();
  const fields = data.split(";");
  for (let i = 0; i < fields.length; i++) {
    fields[i] = fields[i].trim();
    if (fields[i].length == 0) {
      continue;
    }
    const [ogName, type] = fields[i].split(":").map((value) => value.trim());
    const containsOptional = ogName.indexOf("?") > -1;
    const name = ogName.replace("?", "");
    result +=
      `\t${name}\t${MapJSTypeToGolangType(type)}\t` +
      "`" +
      conversionParameters.tag +
      ':"' +
      (conversionParameters.subTag && conversionParameters.subTag.length > 0
        ? conversionParameters.subTag + "=" + name
        : name);
    if (containsOptional) {
      result += ",omitempty";
    }
    result += '"`\n';
  }
  return result + "}";
};

// TODO: Look into nested interfaces later
export const validateJSInterface = (data: string) => {
  if (data.length == 0) {
    throw Error("Interface cannot be empty.");
  }
  if (
    !/interface\s+[a-zA-Z0-9_]+\s+{(\s*[a-zA-Z0-9_]+\??\s*:\s*[a-zA-Z0-9_]+\s*;\s*)*\s*}/gm.test(
      data
    )
  ) {
    throw Error("Invalid TS Interface");
  }
};
