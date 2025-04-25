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
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPDF.addPage(page));
    updateProgress();
  }
  const mergedPDFFile = await mergedPDF.save();
  updateProgress();
  return new Blob([mergedPDFFile], { type: "application/pdf" });
}
