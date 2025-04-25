"use client";
import React, { useState, Suspense } from "react";
import ConverterOptions, {
  EnabledConverterOptions,
} from "@/components/ConverterOptions";
import { EnhancedTextarea } from "@/components/ui/enhanced-text-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSearchParams } from "next/navigation";
import { fromCreateSQLToInsertSQL } from "@/lib/create2insertsql";
import { FunctionParameters } from "@/lib/common";
import { fromGoDBStructToCreateSQLStmt } from "@/lib/godb2createstmt";
import { fromJSInterfaceToGoStruct } from "@/lib/jsinterface2go";
import ErrorMessage from "@/components/ErrorMessage";
import { fromGoJSONToGoStruct } from "@/lib/json2gostruct";
import { fromCreateSQLToGoStruct } from "@/lib/create2gostruct";
import { goStruct2Struct } from "@/lib/gostruct2struct";

type Converter = {
  title: string;
  description: string;
  func: (input: string, params: FunctionParameters) => string;
  enabledOptions: EnabledConverterOptions;
};

const functions = new Map<string, Converter>([
  [
    "createsql2insertsql",
    {
      title: "MySQL Create Statement to MySQL Insert Statement",
      description:
        "Convert a CREATE statement to an INSERT statement. \n\nNumber of rows is defined by the `rows` parameter.",
      func: fromCreateSQLToInsertSQL,
      enabledOptions: {
        rows: true,
      },
    },
  ],
  [
    "createsql2gostruct",
    {
      title: "Convert MySQL Create Statement to Go Struct",
      description:
        'Convert a MySQL Create Statement to a Go Struct with `tag:"subtag=column"` format fields. \n\nIf subTag is empty, it will be ignored, following the format `tag:column`.',
      func: fromCreateSQLToGoStruct,
      enabledOptions: {
        tag: true,
        subTag: true,
      },
    },
  ],
  [
    "gostruct2createsql",
    {
      title: "Go DB Struct to MySQL Create Statement",
      description:
        'Covert a Go struct with tags of `tag:"subtag=column"` to a CREATE TABLE statement in MySQL.\n\nIf subTag is empty, it will be ignored, following the format `tag:column`.',
      func: fromGoDBStructToCreateSQLStmt,
      enabledOptions: {
        tag: true,
        subTag: true,
      },
    },
  ],
  [
    "json2gostruct",
    {
      title: "JSON Struct to Go Struct",
      description:
        'Convert a JSON struct to a Go Struct with `tag:"subtag=column"` format fields. \n\nIf subTag is empty, it will be ignored, following the format `tag:column`.',
      func: fromGoJSONToGoStruct,
      enabledOptions: {
        tag: true,
        subTag: true,
      },
    },
  ],
  [
    "jsinterface2gostruct",
    {
      title: "JS Interface to Go Struct",
      description:
        'Convert a JS interface to a Go struct with `tag:"subtag=column"` format fields. \n\nIf subTag is empty, it will be ignored, following the format `tag:column`.',
      func: fromJSInterfaceToGoStruct,
      enabledOptions: {
        tag: true,
        subTag: true,
      },
    },
  ],

  [
    "gostruct2assignfunc",
    {
      title: "Create assign function for similar Go Structs",
      description:
        "Create an assign function for structs with same fields.\n\nStruct A is the source struct.\nStruct B is the destination struct.",
      func: goStruct2Struct,
      enabledOptions: {
        structAVarName: true,
        structBVarName: true,
      },
    },
  ],
]);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConverterContent />
    </Suspense>
  );
}

function ConverterContent() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [error, setError] = useState("");
  const [params, setParams] = useState<FunctionParameters>({
    insertStmtRowCount: 5,
    tag: "",
    subTag: "",
    structAVarName: "",
    structBVarName: "",
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
            <ConvertButton
              fromText={fromText}
              converter={chosenConverter.func}
              params={params}
              setToText={setToText}
              setError={setError}
              reload={reload}
              setReload={setReload}
            />
          </div>
          <div className="flex h-1/2 w-full justify-center">
            <Textarea disabled={true} rows={13} value={toText} />
          </div>
        </div>
      </div>
      <ErrorMessage key={reload ? "1" : "0"} error={error} />
    </div>
  );
}

const ConvertButton = ({
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
    <Button className="grow-0 max-w-24 conv-button" onClick={onClick}>
      Convert
    </Button>
  );
};
