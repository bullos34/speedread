export interface Document {
  id: string;
  title: string;
  body: string;
  sourceType: "paste" | "pdf" | "txt" | "docx";
  createdAt: number;
  lastReadPosition: number;
  lastWPM: number;
  totalWords: number;
  lastUpdated: number;
}

export interface Progress {
  documentId: string;
  wordIndex: number;
  totalWords: number;
  lastUpdated: number;
}

export interface Settings {
  wpm: number;
  fontSize: number;
  fontFamily: "system" | "serif" | "mono" | "sans-serif";
  theme: "light" | "dark" | "system";
}

export interface ParserResult {
  success: boolean;
  text?: string;
  error?: string;
}

export type ParserFunction = (file: File) => Promise<ParserResult>;

