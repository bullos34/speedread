import { parseTextFile, normalizePastedText } from "./textParser";
import { parseDocxFile } from "./docxParser";
import { parsePdfFile } from "./pdfParser";
import type { ParserResult } from "@/types";

export type FileType = "txt" | "docx" | "pdf";

export function getFileType(file: File): FileType | null {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "txt") return "txt";
  if (extension === "docx" || extension === "doc") return "docx";
  if (extension === "pdf") return "pdf";
  return null;
}

export async function parseFile(file: File): Promise<ParserResult> {
  const fileType = getFileType(file);

  if (!fileType) {
    return {
      success: false,
      error: "Unsupported file type. Please use TXT, DOCX, or PDF files.",
    };
  }

  switch (fileType) {
    case "txt":
      return parseTextFile(file);
    case "docx":
      return parseDocxFile(file);
    case "pdf":
      return parsePdfFile(file);
    default:
      return {
        success: false,
        error: "Unsupported file type",
      };
  }
}

export { parseTextFile, parseDocxFile, parsePdfFile, normalizePastedText };

