"use client";

import { useDocumentStore } from "@/lib/stores/documentStore";
import { DocumentCard } from "@/components/library/DocumentCard";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RecentDocuments() {
  const documents = useDocumentStore((state) => state.documents);
  const router = useRouter();

  // Get documents sorted by lastUpdated, filter out unread ones
  const recentDocuments = documents
    .filter((doc) => doc.lastReadPosition > 0)
    .sort((a, b) => b.lastUpdated - a.lastUpdated)
    .slice(0, 5);

  if (recentDocuments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold">Recent Documents</h2>
        {documents.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Scroll to library section
              const librarySection = window.document.getElementById("library-section");
              if (librarySection) {
                librarySection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            View All
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentDocuments.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
}

