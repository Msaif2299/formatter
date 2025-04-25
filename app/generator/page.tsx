"use client";
import ConverterOptions, {
  EnabledConverterOptions,
} from "@/components/ConverterOptions";
import { useState, Suspense } from "react";
import { FunctionParameters } from "@/lib/common";
import { generateRandomString } from "@/lib/randomstring";
import { useSearchParams } from "next/navigation";
import ErrorMessage from "@/components/ErrorMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Generator = {
  title: string;
  description: string;
  func: (params: FunctionParameters) => string;
  enabledOptions: EnabledConverterOptions;
};

const functions = new Map<string, Generator>([
  [
    "randomstring",
    {
      title: "Generate random string",
      description: "Generate a random string of a given length",
      func: generateRandomString,
      enabledOptions: {
        length: true,
      },
    },
  ],
]);

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GeneratorContent />
    </Suspense>
  );
}

function GeneratorContent() {
  const [params, setParams] = useState<FunctionParameters>({
    length: 0,
  });
  const [error, setError] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false);
  const [toText, setToText] = useState<string>("");
  const searchParams = useSearchParams();
  const generatorName = searchParams.get("cfn");
  if (generatorName == null) {
    return <div>No generator found</div>;
  }
  const chosenGenerator = functions.get(generatorName);
  if (chosenGenerator === undefined) {
    return <div>No generator found</div>;
  }
  return (
    <div className="flex flex-col gap-2 w-full max-md:p-5 pr-5 h-3/4">
      <div className="flex md:flex-row gap-2 w-full">
        <ConverterOptions
          className="md:w-7/12"
          title={chosenGenerator.title}
          description={chosenGenerator.description}
          params={params}
          setParams={setParams}
          enabledOptions={chosenGenerator.enabledOptions}
        />
        <div className="flex gap-4 w-full md:w-1/4 md:h-full justify-center items-center">
          <GeneratorButton
            params={params}
            generator={chosenGenerator.func}
            setToText={setToText}
            setError={setError}
            reload={reload}
            setReload={setReload}
          />
        </div>
        <div className="flex w-full items-center">
          <Textarea disabled={true} rows={13} value={toText} />
        </div>
      </div>
      <ErrorMessage key={reload ? "1" : "0"} error={error} />
    </div>
  );
}

const GeneratorButton = ({
  params,
  generator,
  setToText,
  setError,
  reload,
  setReload,
}: {
  params: FunctionParameters;
  generator: (params: FunctionParameters) => string;
  setToText: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const onClick = () => {
    try {
      const result = generator(params);
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
    <Button className="grow-0 max-w-24" onClick={onClick}>
      Generate
    </Button>
  );
};
