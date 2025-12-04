import { create } from "zustand";
import type { Document } from "@/types";

interface DocumentState {
  documents: Document[];
  currentDocumentId: string | null;
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setCurrentDocument: (id: string | null) => void;
  getCurrentDocument: () => Document | undefined;
  getDocument: (id: string) => Document | undefined;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocumentId: null,
  setDocuments: (documents) => set({ documents }),
  addDocument: (document) =>
    set((state) => {
      // Check if document already exists
      const existingIndex = state.documents.findIndex((doc) => doc.id === document.id);
      if (existingIndex >= 0) {
        // Update existing document instead of adding duplicate
        const updatedDocuments = [...state.documents];
        updatedDocuments[existingIndex] = document;
        return {
          documents: updatedDocuments,
          currentDocumentId: document.id,
        };
      }
      return {
        documents: [...state.documents, document],
        currentDocumentId: document.id,
      };
    }),
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
  deleteDocument: (id) =>
    set((state) => {
      const newDocuments = state.documents.filter((doc) => doc.id !== id);
      return {
        documents: newDocuments,
        currentDocumentId:
          state.currentDocumentId === id ? null : state.currentDocumentId,
      };
    }),
  setCurrentDocument: (id) => set({ currentDocumentId: id }),
  getCurrentDocument: () => {
    const state = get();
    return state.documents.find((doc) => doc.id === state.currentDocumentId);
  },
  getDocument: (id) => {
    return get().documents.find((doc) => doc.id === id);
  },
}));

