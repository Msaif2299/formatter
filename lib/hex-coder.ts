"use client";
import { FunctionParameters } from "./common";

/**
 * https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex
 */

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i !== bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function stringToUTF16Bytes(string: string, littleEndian: boolean): Uint8Array {
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(string);
  const utf16Bytes = new Uint8Array(utf8Bytes.length * 2);
  const view = new DataView(utf16Bytes.buffer);

  let utf16Pos = 0;
  for (const byte of utf8Bytes) {
    view.setUint16(utf16Pos, byte, littleEndian);
    utf16Pos += 2;
  }

  return utf16Bytes;
}

function stringToUTF32Bytes(string: string, littleEndian: boolean): Uint8Array {
  // Get code points directly instead of using surrogate pairs
  const codepoints = Array.from(string, function (c) {
    return c.codePointAt(0)!;
  });

  const bytes = new Uint8Array(codepoints.length * 4);
  const view = new DataView(bytes.buffer);

  for (let i = 0; i < codepoints.length; i++) {
    view.setUint32(i * 4, codepoints[i], littleEndian);
  }

  return bytes;
}

function bytesToStringUTF32(bytes: Uint8Array, littleEndian: boolean) {
  const view = new DataView(bytes.buffer);
  const codepoints = new Uint32Array(view.byteLength / 4);
  for (let i = 0; i !== codepoints.length; i++) {
    codepoints[i] = view.getUint32(i * 4, littleEndian);
  }
  return String.fromCodePoint(...codepoints);
}

export const fromHex = (input: string, params: FunctionParameters): string => {
  if (!params || !params.UTFEncoding) {
    throw Error("Missing UTF bytes information");
  }
  if (!params.LittleEndian) {
    params.LittleEndian = false;
  }
  switch (params.UTFEncoding) {
    case 8:
      return bytesToHex(new TextEncoder().encode(input));
    case 16:
      return bytesToHex(stringToUTF16Bytes(input, params.LittleEndian));
    case 32:
      return bytesToHex(stringToUTF32Bytes(input, params.LittleEndian));
  }
  throw Error("Undefined UTF bytes standard");
};

export const toHex = (input: string, params: FunctionParameters): string => {
  if (!params || !params.UTFEncoding) {
    throw Error("Missing UTF bytes information");
  }
  if (!params.LittleEndian) {
    params.LittleEndian = false;
  }
  switch (params.UTFEncoding) {
    case 8:
      return new TextDecoder().decode(hexToBytes(input));
    case 16:
      if (params.LittleEndian) {
        return new TextDecoder("UTF-16LE").decode(hexToBytes(input));
      }
      return new TextDecoder("UTF-16BE").decode(hexToBytes(input));
    case 32:
      return bytesToStringUTF32(hexToBytes(input), params.LittleEndian);
  }
  throw Error("Undefined UTF bytes standard");
};
