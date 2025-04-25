import { FunctionParameters } from "./common";

export const fromBin = (data: string, params: FunctionParameters): string => {
  return data
    .split("")
    .map((char) => char.charCodeAt(0).toString(2))
    .join(" ");
};

export const toBin = (data: string, params: FunctionParameters): string => {
  return data
    .split(" ")
    .map((bin) => String.fromCharCode(parseInt(bin, 2)))
    .join("");
};
