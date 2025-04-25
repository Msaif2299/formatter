"use client";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { X } from "lucide-react";

export default function MultiFileUploaderViewer({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
}) {
  const [draggingItem, setDraggingItem] = useState<File>();
  return (
    <div className="bg-white p-3 flex gap-2 flex-col h-full w-full rounded">
      <form method="post" encType="multipart/form-data">
        <input
          className="rounded"
          type="file"
          multiple
          accept="*.pdf"
          onInput={(e: FormEvent<HTMLInputElement>) => {
            if (!e.currentTarget.files) {
              return;
            }
            if (!files) {
              setFiles(Array.from(e.currentTarget.files));
              return;
            }
            setFiles([...files, ...Array.from(e.currentTarget.files)]);
          }}
        />
      </form>
      <div className="h-full flex flex-col rounded gap-2 overflow-y-auto">
        {files &&
          Array.from(files).map((item, idx) => (
            <div
              className="bg-grey border-2 border-solid rounded p-1 flex flex-row gap-2"
              key={item.name + idx}
              draggable={true}
              onDragStart={(e) => {
                setDraggingItem(item);
                e.dataTransfer.setData("text/plain", "");
              }}
              onDragEnd={(e) => {
                setDraggingItem(undefined);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                if (!draggingItem) {
                  return;
                }
                const currentIndex = files.indexOf(draggingItem);
                const targetIndex = files.indexOf(item);
                if (currentIndex != -1 && targetIndex != -1) {
                  files.splice(currentIndex, 1);
                  files.splice(targetIndex, 0, draggingItem);
                  setFiles(files);
                }
              }}
            >
              <div>{idx + 1}</div>
              <X
                color="#f70202"
                onClick={(e) => {
                  const currentIndex = files.indexOf(item);
                  let newFiles = [...files];
                  console.log(currentIndex);
                  if (currentIndex != -1) {
                    newFiles.splice(currentIndex, 1);
                    setFiles(newFiles);
                  }
                }}
              />
              {item.name}
            </div>
          ))}
      </div>
    </div>
  );
}
