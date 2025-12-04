import type { ParserResult } from "@/types";

export async function parsePdfFile(file: File): Promise<ParserResult> {
  // Dynamic import to avoid SSR issues
  if (typeof window === "undefined") {
    return {
      success: false,
      error: "PDF parsing is only available in the browser",
    };
  }

  try {
    const pdfjsLib = await import("pdfjs-dist");
    
    // Set up PDF.js worker - use local worker from public directory
    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const numPages = pdf.numPages;
    const textParts: string[] = [];

    // Extract text from each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      textParts.push(pageText);
    }

    const fullText = textParts.join(" ").trim();

    if (fullText.length === 0) {
      return {
        success: false,
        error: "No text content found in PDF file",
      };
    }

    // Normalize whitespace
    const normalized = fullText.replace(/\s+/g, " ").trim();

    return {
      success: true,
      text: normalized,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to parse PDF file. Try copying and pasting the text instead.",
    };
  }
}

