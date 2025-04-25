import { PDFDocument, PDFImage } from "pdf-lib";
import { FunctionParameters } from "./common";

export default async function Img2pdf(
  files: File[],
  _params: FunctionParameters,
  _setProgress: React.Dispatch<React.SetStateAction<number>>
): Promise<Blob> {
  if (files.length == 0) {
    throw Error("No files found");
  }
  const PDF = await PDFDocument.create();
  for (const file of files) {
    const imgArray = await file.arrayBuffer();
    let img: PDFImage;
    switch (file.type) {
      case "image/jpg":
      case "image/jpeg":
        img = await PDF.embedJpg(imgArray);
        break;
      case "image/png":
        img = await PDF.embedPng(imgArray);
        break;
      default:
        throw Error(`Unknown file type: ${file.type}`);
    }
    const page = PDF.addPage();
    const imgDims = img.scale(1);
    page.drawImage(img, {
      x: page.getWidth() / 2 - imgDims.width / 2,
      y: page.getHeight() / 2 - imgDims.height / 2,
      width: imgDims.width,
      height: imgDims.height,
    });
  }
  const result = await PDF.save();
  return new Blob([result], { type: "application/pdf" });
}
