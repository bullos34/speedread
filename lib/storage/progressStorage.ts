import type { Progress } from "@/types";

const PROGRESS_KEY = "speedread-progress";
const LAST_DOCUMENT_KEY = "speedread-last-document";

export const progressStorage = {
  saveProgress: (progress: Progress): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const allProgress = progressStorage.loadAllProgress();
      const index = allProgress.findIndex((p) => p.documentId === progress.documentId);
      if (index >= 0) {
        allProgress[index] = progress;
      } else {
        allProgress.push(progress);
      }
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
      return true;
    } catch (error) {
      console.error("Failed to save progress:", error);
      return false;
    }
  },

  loadProgress: (documentId: string): Progress | null => {
    const allProgress = progressStorage.loadAllProgress();
    return allProgress.find((p) => p.documentId === documentId) || null;
  },

  loadAllProgress: (): Progress[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to load progress:", error);
      return [];
    }
  },

  saveLastDocument: (documentId: string | null): void => {
    if (typeof window === "undefined") return;
    try {
      if (documentId) {
        sessionStorage.setItem(LAST_DOCUMENT_KEY, documentId);
      } else {
        sessionStorage.removeItem(LAST_DOCUMENT_KEY);
      }
    } catch (error) {
      console.error("Failed to save last document:", error);
    }
  },

  loadLastDocument: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return sessionStorage.getItem(LAST_DOCUMENT_KEY);
    } catch (error) {
      console.error("Failed to load last document:", error);
      return null;
    }
  },
};

