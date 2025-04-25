import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { FunctionParameters } from "./common";
import JSZip from "jszip";

// Assuming pdf.worker.js is at public/pdf.worker.js
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

async function PDFToImages(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result;
        if (!arrayBuffer) {
          return;
        }
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const images: string[] = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const scale = 1;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) {
            return;
          }
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;

          const dataUrl = canvas.toDataURL("image/png");
          images.push(dataUrl);
        }
        resolve(images);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export default async function PDFsToImages(
  files: File[],
  params: FunctionParameters,
  setProgress: React.Dispatch<React.SetStateAction<number>>
): Promise<Blob> {
  const imageURLs: string[] = [];
  setProgress(0);
  let incrementProgress = 50 / files.length;
  let currentProgress = 0;
  const updateProgress = (incrementVal: number) => {
    if (currentProgress == 100) {
      return;
    }
    setProgress((currentProgress += incrementVal));
  };
  for (const file of files) {
    imageURLs.push(...(await PDFToImages(file)));
    updateProgress(incrementProgress);
  }
  const zip = new JSZip();
  incrementProgress = 50 / (imageURLs.length + 1);
  imageURLs.forEach((url, idx) => {
    const base64Data = url.split(",")[1];
    zip.file(`page${idx + 1}.png`, base64Data, { base64: true });
    updateProgress(incrementProgress);
  });
  const result = await zip.generateAsync({ type: "blob" });
  updateProgress(incrementProgress);
  return result;
}
