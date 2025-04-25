"use client";
import React, { BaseSyntheticEvent, useState } from "react";
import ConverterOptions, {
  EnabledConverterOptions,
} from "@/components/ConverterOptions";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { FunctionParameters } from "@/lib/common";
import ErrorMessage from "@/components/ErrorMessage";
import MultiFileUploaderViewer from "@/components/MultiFileUploadViewer";
import merge from "@/lib/merge-pdf";
import DownloadFilePanel from "@/components/DownloadFile";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import PDFsToImages from "@/lib/break-pdf";

type Converter = {
  title: string;
  description: string;
  func: (
    files: File[],
    params: FunctionParameters,
    setProgress: React.Dispatch<React.SetStateAction<number>>
  ) => Promise<Blob>;
  enabledOptions?: EnabledConverterOptions;
  extension: string;
  placeholderFilename: string;
};

const functions = new Map<string, Converter>([
  [
    "merge",
    {
      title: "Merges multiple uploaded PDFs into a Singular PDF file",
      description:
        "Upload multiple PDF files and download a merged PDF file with all pages in the order of the files.",
      func: merge,
      extension: "pdf",
      placeholderFilename: "merged",
    },
  ],
  [
    "toPNG",
    {
      title: "Converts PDF Pages to .PNG images",
      description:
        "Upload multiple (or single) PDF file and download all the pages of PDF(s) as .PNG images.\n\nDownloads as a .zip folder.",
      func: PDFsToImages,
      extension: "zip",
      placeholderFilename: "broken",
    },
  ],
]);

export default function Page() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputFile, setOutputFile] = useState<Blob>();
  const [error, setError] = useState("");
  const [params, setParams] = useState<FunctionParameters>({});
  const [reload, setReload] = useState(false);
  const [progress, setProgress] = useState(-1);
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
            <MultiFileUploaderViewer files={files} setFiles={setFiles} />
          </div>
          <div className="flex max-h-1/4 justify-center gap-20 w-full">
            <Process
              files={files}
              params={params}
              processor={chosenConverter.func}
              setProcessedFile={setOutputFile}
              setError={setError}
              reload={reload}
              setReload={setReload}
              progress={progress}
              setProgress={setProgress}
            />
          </div>
          <div className="flex w-full justify-center">
            <DownloadFilePanel
              file={outputFile}
              extension={chosenConverter.extension}
              placeholderFilename={chosenConverter.placeholderFilename}
            />
          </div>
        </div>
      </div>
      <ErrorMessage key={reload ? "1" : "0"} error={error} />
    </div>
  );
}

const Process = ({
  files,
  params,
  processor,
  setProcessedFile,
  setError,
  reload,
  setReload,
  progress,
  setProgress,
}: {
  files: File[];
  params: FunctionParameters;

  processor: (
    files: File[],
    params: FunctionParameters,
    setProgress: React.Dispatch<React.SetStateAction<number>>
  ) => Promise<Blob>;
  setProcessedFile: React.Dispatch<React.SetStateAction<Blob | undefined>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      const result = await processor(files, params, setProgress);
      setIsLoading(false);
      setProcessedFile(result);
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
    <div className="flex grow flex-col items-center gap-3">
      {isLoading && (
        <Button className="grow-0 max-w-24" variant="secondary" disabled>
          <Loader2 className="animate-spin" />
          Please wait
        </Button>
      )}
      {!isLoading && (
        <Button
          className="grow-0 max-w-24"
          variant="secondary"
          onClick={onClick}
        >
          Process
        </Button>
      )}
      <ProcessProgress value={progress} />
    </div>
  );
};

const ProcessProgress = ({ value }: { value: number }) => {
  if (value == -1) {
    return <div></div>;
  }
  return <Progress value={value} data-state="loading"></Progress>;
};
