/**
 * Tokenizes text into words while preserving punctuation.
 * Handles edge cases like empty text, special characters, and whitespace.
 */
export function tokenizeWords(text: string): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Normalize whitespace: replace multiple spaces/newlines with single space
  const normalized = text.replace(/\s+/g, " ").trim();

  // Split by whitespace, keeping punctuation attached to words
  const words = normalized.split(/\s+/).filter((word) => word.length > 0);

  return words;
}

/**
 * Checks if a word ends with sentence-ending punctuation.
 */
export function isSentenceEnd(word: string): boolean {
  return /[.!?]$/.test(word);
}

