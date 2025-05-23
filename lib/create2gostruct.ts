import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FunctionParameters } from "@/lib/common";
import { validateCreateSQL, extractColumns } from "./create2insertsql";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromCreateSQLToGoStruct(
  createSql: string,
  conversionParameters: FunctionParameters
): string {
  if (
    conversionParameters.tag === undefined ||
    conversionParameters.tag == ""
  ) {
    throw Error("Tag cannot be empty");
  }
  if (conversionParameters.subTag === undefined) {
    throw Error("Subtag cannot be undefined");
  }
  createSql = createSql.trim();
  validateCreateSQL(createSql);
  createSql = createSql.replace(
    /(((IF)|(if))\s+((NOT)|(not))\s+((EXISTS)|(exists)))/g,
    ""
  );
  const tableExtractPattern =
    /((table)|(TABLE))\s+(`?)([a-zA-Z0-9]+)\4\s+((IF)|(if))?/;
  const tableExtractMatchArray = createSql.match(tableExtractPattern);
  if (tableExtractMatchArray === null) {
    throw Error("No table name found in the command.");
  }
  let columnDefBeginIndex = 0,
    columnDefEndIndex = createSql.length - 1;
  for (let i = 0; i < createSql.length; i++) {
    if (createSql[i] == "(" && columnDefBeginIndex == 0) {
      columnDefBeginIndex = i + 1;
      break;
    }
  }
  for (let i = createSql.length - 1; i >= 0; i--) {
    if (createSql[i] == ")" && columnDefEndIndex == createSql.length - 1) {
      columnDefEndIndex = i - 1;
      break;
    }
  }
  const columnDefString = createSql.substring(
    columnDefBeginIndex,
    columnDefEndIndex
  );

  return createGoStruct(
    extractColumns(columnDefString),
    conversionParameters.tag,
    conversionParameters.subTag
  );
}

function createGoStruct(
  columns: Map<string, string>,
  tag: string,
  subtag: string
): string {
  let output = "type Autogenerated struct {\n";
  for (const [key, originalValue] of columns.entries()) {
    const value = originalValue.toLowerCase();
    const columnName = key
      .split("_")
      .map((value: string, _index: number, _array: string[]): string => {
        return value[0].toUpperCase() + value.substring(1);
      })
      .join("");
    output += "\t" + columnName + " ";
    if (value.indexOf("tinyint") > -1) {
      if (value.indexOf("unsigned") > -1) {
        output += "uint8 ";
      } else {
        output += "int8 ";
      }
    } else if (value.indexOf("smallint") > -1) {
      if (value.indexOf("unsigned") > -1) {
        output += "uint16 ";
      } else {
        output += "int16 ";
      }
    } else if (value.indexOf("mediumint") > -1) {
      if (value.indexOf("unsigned") > -1) {
        output += "uint32 ";
      } else {
        output += "int32 ";
      }
    } else if (value.indexOf("bigint") > -1) {
      if (value.indexOf("unsigned") > -1) {
        output += "uint64 ";
      } else {
        output += "int64 ";
      }
    } else if (value.indexOf("int") > -1 || value.indexOf("integer") > -1) {
      if (value.indexOf("unsigned") > -1) {
        output += "uint ";
      } else {
        output += "int ";
      }
    } else if (value.indexOf("float") > -1) {
      output += "float32 ";
    } else if (value.indexOf("double") > -1) {
      output += "float64 ";
    } else if (value.indexOf("dec") > -1) {
      output += "float64 ";
    } else if (value.indexOf("varchar") > -1) {
      output += "string ";
    } else if (value.indexOf("bool") > -1) {
      output += "bool ";
    } else if (value.indexOf("date") > -1 || value.indexOf("time") > -1) {
      output += "time.Time ";
    } else {
      output += "interface{} ";
    }
    if (subtag != "") {
      output += "`" + tag + ':"' + subtag + "=" + key + '"`\n';
    } else {
      output += "`" + tag + ':"' + key + '"`\n';
    }
  }
  return output + "}";
}
