import { PDFDocument } from "pdf-lib";
import { FunctionParameters } from "./common";
import React from "react";

export default async function merge(
  files: File[],
  params: FunctionParameters,
  setProgress: React.Dispatch<React.SetStateAction<number>>
): Promise<Blob> {
  if (!files.length) {
    throw Error("No files found");
  }
  let currentProgress = 0;
  const progressSplit = 100 / (files.length + 2);
  const updateProgress = () => {
    if (currentProgress == 100) {
      return;
    }
    currentProgress += progressSplit;
    setProgress(currentProgress);
  };
  setProgress(currentProgress); // set to 0 to show the progress bar
  const mergedPDF = await PDFDocument.create();
  updateProgress();
  for (const file of files) {
    if (file.type == "text/plain") {
      const txtFileData = await file.text();
      const txtLines = txtFileData.split("\n");
      let newPage = mergedPDF.addPage();
      const { height } = newPage.getSize();
      const fontSize = 12;
      const lineHeight = fontSize * 1.2;
      const margin = 50;
      let y = height - margin;
      txtLines.forEach((value: string) => {
        if (y < margin + lineHeight) {
          newPage = mergedPDF.addPage();
          y = height - margin;
        }
        newPage.drawText(value, {
          x: margin,
          y: y,
          size: fontSize,
        });
        y -= lineHeight;
      });
    } else if (file.type == "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPDF.addPage(page));
    } else {
      throw Error(
        "Unknown extension encountered: " + file.type + " in " + file.name
      );
    }
    updateProgress();
  }
  const mergedPDFFile = await mergedPDF.save();
  updateProgress();
  return new Blob([mergedPDFFile], { type: "application/pdf" });
}
