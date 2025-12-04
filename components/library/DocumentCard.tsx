"use client";

import { Button } from "@/components/ui/button";
import type { Document } from "@/types";
import { useRouter } from "next/navigation";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { documentStorage } from "@/lib/storage/documentStorage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface DocumentCardProps {
  document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const router = useRouter();
  const deleteDocument = useDocumentStore((state) => state.deleteDocument);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const progress =
    document.totalWords > 0
      ? Math.round((document.lastReadPosition / document.totalWords) * 100)
      : 0;

  const handleOpen = () => {
    router.push(`/reader/${document.id}`);
  };

  const handleDelete = () => {
    deleteDocument(document.id);
    documentStorage.deleteDocument(document.id);
    setDeleteDialogOpen(false);
  };

  const sourceTypeLabels = {
    paste: "Pasted",
    pdf: "PDF",
    txt: "TXT",
    docx: "DOCX",
  };

  return (
    <div className="group rounded-lg border p-3 sm:p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 cursor-pointer min-w-0" onClick={handleOpen}>
          <h3 className="text-base sm:text-lg font-semibold truncate">{document.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {sourceTypeLabels[document.sourceType]} • {document.totalWords}{" "}
            words
          </p>
          <div className="mt-2">
            {progress > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Not started</p>
            )}
          </div>
        </div>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-100 sm:opacity-0 transition-opacity group-hover:opacity-100 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
              }}
              aria-label="Delete document"
            >
              ×
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Document</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{document.title}"? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

