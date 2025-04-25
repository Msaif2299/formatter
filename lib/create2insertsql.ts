import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FunctionParameters, randomInteger } from "@/lib/common";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromCreateSQLToInsertSQL(
  createSql: string,
  conversionParameters: FunctionParameters
): string {
  if (
    conversionParameters.insertStmtRowCount === undefined ||
    conversionParameters.insertStmtRowCount == 0
  ) {
    throw Error("Number of rows cannot be 0.");
  }
  if (conversionParameters.insertStmtRowCount < 0) {
    throw Error("Number of rows cannot be negative.");
  }
  if (conversionParameters.insertStmtRowCount > 100) {
    throw Error("Number of rows cannot be greater than 100.");
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
  const tableName = tableExtractMatchArray[0]
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")[1]
    .replace(/`/g, "");
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
  const count = conversionParameters.insertStmtRowCount;
  const columnDefString = createSql.substring(
    columnDefBeginIndex,
    columnDefEndIndex
  );
  const columns: Map<string, string[]> = createRandomValues(
    extractColumns(columnDefString),
    count
  );

  return generateInsertStatement(tableName, columns, count);
}

export function validateCreateSQL(createSql: string) {
  if (createSql.length == 0) {
    throw Error("Command cannot be empty.");
  }
  const validCreateSQL =
    /^(CREATE|create)[\s\S]+(TABLE|table)[\s\S]+((`[a-zA-Z0-9_]+`)|([a-zA-Z0-9_]+))[\s\S]*((IF|if) (not|NOT) (exists|EXISTS))?[\s\S]*\(.*?\)[\s\S]*;?$/gm;
  if (!(createSql.startsWith("CREATE") || createSql.startsWith("create"))) {
    throw Error(
      "Command does not contain a create command, or create is not full caps or full lower case."
    );
  }
  if (!validCreateSQL.test(createSql)) {
    throw Error("Command does not match general create sql query format.");
  }
}

export function extractColumns(columnDefString: string): Map<string, string> {
  columnDefString = columnDefString
    .replace("\n", "")
    .trim()
    .replace(/\s+/g, " ");
  const columns: Map<string, string> = new Map<string, string>();
  let column: string = "",
    definition: string = "";
  for (let i = 0; i < columnDefString.length; i++) {
    // skip all whitespaces
    if (
      columnDefString[i] == " " ||
      columnDefString[i] == "\t" ||
      columnDefString[i] == "\r"
    ) {
      continue;
    }
    // column starts with backtick
    if (columnDefString[i] == "`") {
      let j = i + 1;
      // find column name
      for (; j < columnDefString.length; j++) {
        if (columnDefString[j] == "`") {
          column = columnDefString.substring(i + 1, j);
          break;
        }
      }
      // ignore all spaces
      for (j = j + 1; j < columnDefString.length; j++) {
        if (
          columnDefString[j] == " " ||
          columnDefString[j] == "\t" ||
          columnDefString[j] == "\r"
        ) {
          continue;
        }
        break;
      }
      // now everything until the outer comma is the column def
      const startIndex = j;
      let bracketCounter = 0;
      for (j = j + 1; j < columnDefString.length; j++) {
        if (columnDefString[j] == "(") {
          bracketCounter++;
          continue;
        }
        if (columnDefString[j] == ")" && bracketCounter > 0) {
          bracketCounter--;
          continue;
        }
        if (columnDefString[j] == "," && bracketCounter == 0) {
          break;
        }
      }
      definition = columnDefString.substring(startIndex, j);
      i = j;
      definition.replace(/\s+/g, " ");
      columns.set(column, definition);
      continue;
    }
    // column doesn't start with backtick
    let j = i;
    // find column name
    for (; j < columnDefString.length; j++) {
      if (
        columnDefString[j] == " " ||
        columnDefString[j] == "\t" ||
        columnDefString[j] == "\r"
      ) {
        column = columnDefString.substring(i, j);
        break;
      }
    }
    // ignore all spaces
    for (j = j + 1; j < columnDefString.length; j++) {
      if (
        columnDefString[j] == " " ||
        columnDefString[j] == "\t" ||
        columnDefString[j] == "\r"
      ) {
        continue;
      }
      break;
    }
    // now everything until the outer comma is the column def
    const startIndex = j;
    let bracketCounter = 0;
    for (j = j + 1; j < columnDefString.length; j++) {
      if (columnDefString[j] == "(") {
        bracketCounter++;
        continue;
      }
      if (columnDefString[j] == ")" && bracketCounter > 0) {
        bracketCounter--;
        continue;
      }
      if (columnDefString[j] == "," && bracketCounter == 0) {
        break;
      }
    }
    definition = columnDefString.substring(startIndex, j);
    i = j;
    definition.replace(/\s+/g, " ");
    columns.set(column, definition);
  }
  return columns;
}

function createRandomValues(
  columns: Map<string, string>,
  count: number
): Map<string, string[]> {
  const randoms = new Map<string, string[]>();
  for (const [key, originalValue] of columns.entries()) {
    const value = originalValue.toLowerCase();
    let randomValues: string[] = [];
    if (value.indexOf("tinyint") > -1) {
      if (value.indexOf("unsigned") > -1) {
        randomValues = randomIntegers(0, 255, count);
      } else {
        randomValues = randomIntegers(-128, 127, count);
      }
    } else if (value.indexOf("smallint") > -1) {
      if (value.indexOf("unsigned") > -1) {
        randomValues = randomIntegers(0, 65535, count);
      } else {
        randomValues = randomIntegers(-32768, 32767, count);
      }
    } else if (value.indexOf("mediumint") > -1) {
      if (value.indexOf("unsigned") > -1) {
        randomValues = randomIntegers(0, 16777215, count);
      } else {
        randomValues = randomIntegers(-8388608, 8388607, count);
      }
    } else if (value.indexOf("bigint") > -1) {
      if (value.indexOf("unsigned") > -1) {
        randomValues = randomIntegers(0, 18446744073709551615, count);
      } else {
        randomValues = randomIntegers(
          -9223372036854775808,
          9223372036854775807,
          count
        );
      }
    } else if (value.indexOf("int") > -1 || value.indexOf("integer") > -1) {
      if (value.indexOf("unsigned") > -1) {
        randomValues = randomIntegers(0, 4294967295, count);
      } else {
        randomValues = randomIntegers(-2147483648, 2147483647, count);
      }
    } else if (
      value.indexOf("float") > -1 ||
      value.indexOf("double") > -1 ||
      value.indexOf("dec") > -1
    ) {
      const [digits, precision] = fetchDigitsAndPrecision(value);
      randomValues = randomFloatStrings(digits, precision, count);
    } else if (value.indexOf("varchar") > -1) {
      randomValues = randomStrings(fetchVarcharCount(value), count);
    } else if (value.indexOf("bool") > -1) {
      randomValues = [];
      for (let i = 0; i < count; i++)
        randomValues.push(randomInteger(0, 1) == 1 ? "true" : "false");
    }
    if (randomValues.length > 0) {
      randoms.set(key, randomValues);
    }
  }
  return randoms;
}

function generateInsertStatement(
  tableName: string,
  randoms: Map<string, string[]>,
  count: number
): string {
  let sql = "INSERT INTO `" + tableName + "` (";
  const columnNames: string[] = [];
  for (const [columnName, _entries] of randoms.entries()) {
    columnNames.push("`" + columnName + "`");
  }
  const values: string[][] = [...Array(count)].map(() =>
    Array(columnNames.length)
  );
  let col = 0;
  for (const [_columnName, entries] of randoms.entries()) {
    for (let row = 0; row < count; row++) {
      values[row][col] = entries[row];
    }
    col++;
  }
  sql += columnNames.join(",") + ") VALUES ";
  for (let row = 0; row < values.length; row++) {
    sql += "(" + values[row].join(",") + "),";
  }
  return sql.substring(0, sql.length - 1) + ";";
}

function randomIntegers(min: number, max: number, count: number): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(randomInteger(min, max).toString());
  }
  return result;
}

function randomFloatStrings(
  digitCount: number,
  precision: number,
  count: number
): string[] {
  const results: string[] = [];
  const digits = "0123456789";
  for (let c = 0; c < count; c++) {
    let result = "";
    for (let i = 0; i < digitCount; i++) {
      let min = 0;
      if (i == 0) {
        min = 1;
      }
      result += digits[randomInteger(min, 9)];
    }
    result += ".";
    for (let i = 0; i < precision; i++) {
      let min = 0;
      if (i == precision - 1) {
        min = 1;
      }
      result += digits[randomInteger(min, 9)];
    }
    results.push(result);
  }
  return results;
}

function randomStrings(length: number, count: number): string[] {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const results: string[] = [];
  for (let c = 0; c < count; c++) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[randomInteger(0, chars.length - 1)];
    }
    results.push('"' + result + '"');
  }
  return results;
}

function fetchDigitsAndPrecision(value: string): [number, number] {
  if (value.indexOf("(") == -1) {
    return [3, 3];
  }
  const digitsAndPrecStr = value
    .substring(value.indexOf("(") + 1, value.indexOf(")"))
    .split(",");
  return [+digitsAndPrecStr[0].trim(), +digitsAndPrecStr[1].trim()];
}

function fetchVarcharCount(value: string): number {
  if (value.indexOf("(") == -1) {
    return 5;
  }
  const digitsAndPrecStr = value.substring(
    value.indexOf("(") + 1,
    value.indexOf(")")
  );
  return +digitsAndPrecStr.trim();
}
