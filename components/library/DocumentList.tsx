"use client";

import { useDocumentStore } from "@/lib/stores/documentStore";
import { DocumentCard } from "./DocumentCard";
import { AddDocumentDialog } from "./AddDocumentDialog";

export function DocumentList() {
  const documents = useDocumentStore((state) => state.documents);

  // Remove duplicates as a safeguard (keep last occurrence)
  const uniqueDocuments = Array.from(
    new Map(documents.map((doc) => [doc.id, doc])).values()
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold">Library</h2>
        <AddDocumentDialog />
      </div>

      {uniqueDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg text-muted-foreground">
            No documents yet. Add your first document to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {uniqueDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}

