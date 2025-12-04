import type { ParserResult } from "@/types";

export async function parseTextFile(file: File): Promise<ParserResult> {
  try {
    const text = await file.text();
    // Normalize whitespace: replace multiple spaces/newlines with single space
    const normalized = text.replace(/\s+/g, " ").trim();

    if (normalized.length === 0) {
      return {
        success: false,
        error: "File appears to be empty",
      };
    }

    return {
      success: true,
      text: normalized,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to read text file",
    };
  }
}

export function normalizePastedText(text: string): string {
  // Normalize whitespace: replace multiple spaces/newlines with single space
  return text.replace(/\s+/g, " ").trim();
}

