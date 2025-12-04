import mammoth from "mammoth";
import type { ParserResult } from "@/types";

export async function parseDocxFile(file: File): Promise<ParserResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages.length > 0) {
      console.warn("DOCX parsing warnings:", result.messages);
    }

    const text = result.value.trim();

    if (text.length === 0) {
      return {
        success: false,
        error: "No text content found in DOCX file",
      };
    }

    // Normalize whitespace
    const normalized = text.replace(/\s+/g, " ").trim();

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
          : "Failed to parse DOCX file. Try copying and pasting the text instead.",
    };
  }
}

