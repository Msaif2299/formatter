export type FunctionParameters = {
  insertStmtRowCount?: number;
  tag?: string;
  subTag?: string;
  structAVarName?: string;
  structBVarName?: string;
  length?: number;
  UTFEncoding?: number;
  LittleEndian?: boolean;
  URLEscape?: boolean;
};

export function ConvertJSTypeToGolangType(
  data: string | bigint | number | boolean | object | undefined | null
): string {
  switch (typeof data) {
    case "string":
      return "string";
    case "bigint":
      return "int64";
    case "number":
      if (data % 1 != 0) {
        return "float64";
      }
      return "int64";
    case "boolean":
      return "bool";
  }
  return "interface{}";
}

export function MapJSTypeToGolangType(type: string): string {
  switch (type) {
    case "string":
      return "string";
    case "bigint":
      return "int64";
    case "number":
      return "int64";
    case "boolean":
      return "bool";
  }
  return "interface{}";
}

export function ConvertGoTypeToSQLType(type: string): string {
  const formatOptions: string[] = [];
  if (type.indexOf("[]") > -1) {
    return "VARCHAR(255)";
  }
  let sqlType = "";
  switch (type.trim().replaceAll("*", "")) {
    case "string":
      sqlType = "VARCHAR(255)";
      break;

    case "uint":
    case "uint32":
      formatOptions.push("UNSIGNED");
    case "int":
    case "int32":
      sqlType = "INTEGER";
      break;

    case "uint8":
      formatOptions.push("UNSIGNED");
    case "int8":
      sqlType = "TINYINT";
      break;

    case "uint16":
      formatOptions.push("UNSIGNED");
    case "int16":
      sqlType = "SMALLINT";
      break;

    case "uint64":
      formatOptions.push("UNSIGNED");
    case "int64":
      sqlType = "BIGINT";
      break;

    case "float32":
      sqlType = "FLOAT";
      break;

    case "float64":
      sqlType = "DOUBLE";
      break;

    case "bool":
      sqlType = "BOOLEAN";
      break;
    case "time.Time":
      sqlType = "DATETIME";
      break;
  }
  if (sqlType.length == 0) {
    throw Error(`undefined type encountered: ${type}`);
  }
  if (type.indexOf("*") == -1) {
    formatOptions.push("NOT NULL");
  }
  if (formatOptions.length == 0) {
    return sqlType;
  }
  return sqlType + " " + formatOptions.join(" ");
}

export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
