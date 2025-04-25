"use client";
import React, { useState } from "react";
import ConverterOptions, {
  EnabledConverterOptions,
} from "@/components/ConverterOptions";
import { EnhancedTextarea } from "@/components/ui/enhanced-text-area";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { FunctionParameters } from "@/lib/common";
import ErrorMessage from "@/components/ErrorMessage";
import { fromHex, toHex } from "@/lib/hex-coder";
import { fromBin, toBin } from "@/lib/bin-coder";
import { fromEscape, toEscape } from "@/lib/escape-coder";

type Converter = {
  title: string;
  description: string;
  encoder: (input: string, params: FunctionParameters) => string;
  decoder: (input: string, params: FunctionParameters) => string;
  enabledOptions?: EnabledConverterOptions;
};

const functions = new Map<string, Converter>([
  [
    "hex",
    {
      title: "Convert text to hex-encoding or decode from hex-encoding",
      description:
        "Convert a hex representation into its unicode format or vice-versa",
      encoder: fromHex,
      decoder: toHex,
      enabledOptions: {
        UTF: true,
        littleEndian: true,
      },
    },
  ],
  [
    "escape",
    {
      title: "Escape or unescape a string",
      description:
        "Escape a string to or unescape from how it looks like in a URL",
      encoder: fromEscape,
      decoder: toEscape,
      enabledOptions: {
        urlEncode: true,
      },
    },
  ],
  [
    "binary",
    {
      title: "Encode into or decode from a binary representation of a string",
      description:
        "Convert a string into a binary representation or recover a unicode string from its binary representation",
      encoder: fromBin,
      decoder: toBin,
    },
  ],
]);

export default function Page() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [error, setError] = useState("");
  const [params, setParams] = useState<FunctionParameters>({
    UTFEncoding: 8,
    LittleEndian: false,
    URLEscape: true,
  });
  const [reload, setReload] = useState(false);
  const searchParams = useSearchParams();
  const converterName = searchParams.get("cfn");
  if (converterName == null) {
    return <div>No converter found</div>;
  }

  const chosenConverter = functions.get(converterName);
  if (chosenConverter === undefined) {
    return <div>No converter found</div>;
  }

  return (
    <div className="flex flex-col gap-2 w-full max-md:p-5 pr-5 h-3/4">
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <ConverterOptions
          title={chosenConverter.title}
          description={chosenConverter.description}
          params={params}
          setParams={setParams}
          enabledOptions={chosenConverter.enabledOptions}
        />
        <div className="flex flex-col gap-4 w-full md:w-3/4 items-center">
          <div className="flex h-1/2 w-full justify-center">
            <EnhancedTextarea
              rows={13}
              value={fromText}
              setValue={setFromText}
            />
          </div>
          <div className="flex justify-center gap-20 w-full h-full">
            <EncodeButton
              fromText={fromText}
              converter={chosenConverter.encoder}
              params={params}
              setToText={setToText}
              setError={setError}
              reload={reload}
              setReload={setReload}
            />
            <DecodeButton
              fromText={toText}
              converter={chosenConverter.decoder}
              params={params}
              setToText={setFromText}
              setError={setError}
              reload={reload}
              setReload={setReload}
            />
          </div>
          <div className="flex h-1/2 w-full justify-center">
            <EnhancedTextarea rows={13} value={toText} setValue={setToText} />
          </div>
        </div>
      </div>
      <ErrorMessage key={reload ? "1" : "0"} error={error} />
    </div>
  );
}

const EncodeButton = ({
  fromText,
  params,
  converter,
  setToText,
  setError,
  reload,
  setReload,
}: {
  fromText: string;
  params: FunctionParameters;

  converter: (input: string, params: FunctionParameters) => string;
  setToText: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const onClick = () => {
    try {
      const result = converter(fromText, params);
      setToText(result);
      setError("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    setReload(!reload);
  };
  return (
    <Button className="grow-0 max-w-24" variant="secondary" onClick={onClick}>
      Encode
    </Button>
  );
};

const DecodeButton = ({
  fromText,
  params,
  converter,
  setToText,
  setError,
  reload,
  setReload,
}: {
  fromText: string;
  params: FunctionParameters;

  converter: (input: string, params: FunctionParameters) => string;
  setToText: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const onClick = () => {
    try {
      const result = converter(fromText, params);
      setToText(result);
      setError("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
    setReload(!reload);
  };
  return (
    <Button className="grow-0 max-w-24" variant="destructive" onClick={onClick}>
      Decode
    </Button>
  );
};
