import { FunctionParameters } from "./common";

export const fromEscape = (
  data: string,
  params: FunctionParameters
): string => {
  if (params.URLEscape) {
    return encodeURI(data);
  }
  return encodeURIComponent(data);
};

export const toEscape = (data: string, params: FunctionParameters): string => {
  if (params.URLEscape) {
    return decodeURI(data);
  }
  return decodeURIComponent(data);
};
