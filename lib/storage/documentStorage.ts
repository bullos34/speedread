import type { Document } from "@/types";

const STORAGE_KEY = "speedread-documents";
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit for localStorage

export const documentStorage = {
  loadDocuments: (): Document[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const documents: Document[] = JSON.parse(stored);
      // Remove duplicates by keeping the last occurrence of each ID
      const uniqueDocuments: Document[] = Array.from(
        new Map(documents.map((doc: Document) => [doc.id, doc])).values()
      );
      // If duplicates were found, save the cleaned version
      if (uniqueDocuments.length !== documents.length) {
        documentStorage.saveDocuments(uniqueDocuments);
      }
      return uniqueDocuments;
    } catch (error) {
      console.error("Failed to load documents:", error);
      return [];
    }
  },

  saveDocuments: (documents: Document[]): boolean => {
    if (typeof window === "undefined") return false;
    try {
      const serialized = JSON.stringify(documents);
      if (serialized.length > MAX_STORAGE_SIZE) {
        console.warn("Documents exceed storage limit, consider using IndexedDB");
        return false;
      }
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        console.error("Storage quota exceeded");
        return false;
      }
      console.error("Failed to save documents:", error);
      return false;
    }
  },

  getDocument: (id: string): Document | null => {
    const documents = documentStorage.loadDocuments();
    return documents.find((doc) => doc.id === id) || null;
  },

  saveDocument: (document: Document): boolean => {
    const documents = documentStorage.loadDocuments();
    const index = documents.findIndex((doc) => doc.id === document.id);
    if (index >= 0) {
      documents[index] = document;
    } else {
      documents.push(document);
    }
    return documentStorage.saveDocuments(documents);
  },

  deleteDocument: (id: string): boolean => {
    const documents = documentStorage.loadDocuments();
    const filtered = documents.filter((doc) => doc.id !== id);
    return documentStorage.saveDocuments(filtered);
  },
};

