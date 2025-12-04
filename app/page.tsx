"use client";

import { useEffect, useState } from "react";
import { DocumentList } from "@/components/library/DocumentList";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { documentStorage } from "@/lib/storage/documentStorage";
import { progressStorage } from "@/lib/storage/progressStorage";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const setDocuments = useDocumentStore((state) => state.setDocuments);
  const documents = useDocumentStore((state) => state.documents);
  const router = useRouter();

  const [lastDocument, setLastDocument] = useState<typeof documents[0] | undefined>(undefined);

  // Load documents on mount
  useEffect(() => {
    try {
      const loadedDocuments = documentStorage.loadDocuments();
      setDocuments(loadedDocuments);

      // Check for last document to resume
      const lastDocumentId = progressStorage.loadLastDocument();
      if (lastDocumentId) {
        const doc = loadedDocuments.find((doc) => doc.id === lastDocumentId);
        setLastDocument(doc);
      }
    } catch (error) {
      console.error("Failed to load documents:", error);
    }
  }, [setDocuments]);

  const handleResumeLast = () => {
    if (lastDocument) {
      router.push(`/reader/${lastDocument.id}`);
    }
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8">
      {lastDocument && (
        <div className="mb-4 sm:mb-6 rounded-lg border bg-card p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-muted-foreground">Continue reading</p>
              <p className="font-semibold text-sm sm:text-base truncate">{lastDocument.title}</p>
            </div>
            <Button onClick={handleResumeLast} size="sm" className="w-full sm:w-auto">
              Resume
            </Button>
          </div>
        </div>
      )}
      <DocumentList />
    </main>
  );
}

