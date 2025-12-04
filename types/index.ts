export interface Document {
  id: string;
  title: string;
  body: string;
  sourceType: "paste" | "pdf" | "txt" | "docx" | "url";
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
  chunkSize: number; // Number of words to display at once (1-3)
  focusMode: boolean; // Hide all UI except reading pane
}

export interface ParserResult {
  success: boolean;
  text?: string;
  error?: string;
}

export type ParserFunction = (file: File) => Promise<ParserResult>;

export interface ReadingSession {
  id: string;
  documentId: string;
  startTime: number;
  endTime: number | null;
  wordsRead: number;
  averageWPM: number;
  duration: number; // in milliseconds
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  wordsRead: number;
  timeSpent: number; // in milliseconds
  sessions: number;
  averageWPM: number;
  maxWPM: number;
  minWPM: number;
}

export interface AnalyticsData {
  sessions: ReadingSession[];
  dailyStats: { [date: string]: DailyStats };
  aggregated: {
    totalWords: number;
    totalTime: number; // in milliseconds
    averageWPM: number;
    currentStreak: number;
    longestStreak: number;
    totalSessions: number;
  };
}

