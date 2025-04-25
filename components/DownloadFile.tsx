import { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function DownloadFilePanel({
  file,
  extension,
  placeholderFilename,
}: {
  file: Blob | undefined;
  extension: string;
  placeholderFilename: string;
}) {
  const [filename, setFilename] = useState(placeholderFilename);
  if (!file) {
    return <div></div>;
  }
  return (
    <div className="bg-white flex flex-col p-3 rounded gap-2 items-center w-full">
      <div className="flex flex-row items-center gap-1">
        <Label>Filename: </Label>
        <Input
          className="border-2 border-solid rounded"
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        {"." + extension}
      </div>

      <Button
        className="grow-0 max-w-24"
        onClick={(e) => {
          if (!file) {
            return;
          }
          const url = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename + "." + extension;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }}
      >
        Download
      </Button>
    </div>
  );
}
