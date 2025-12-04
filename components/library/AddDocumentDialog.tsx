"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { parseFile, normalizePastedText } from "@/lib/parsers";
import { documentStorage } from "@/lib/storage/documentStorage";
import { tokenizeWords } from "@/lib/rsvp/wordTokenizer";
import type { Document } from "@/types";
import { useRouter } from "next/navigation";

export function AddDocumentDialog() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"paste" | "upload" | "url">("paste");
  const [title, setTitle] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addDocument = useDocumentStore((state) => state.addDocument);
  const setDocuments = useDocumentStore((state) => state.setDocuments);
  const defaultWPM = useSettingsStore((state) => state.wpm);
  const router = useRouter();

  const handlePasteSubmit = () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!pastedText.trim()) {
      setError("Please paste some text");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const normalizedText = normalizePastedText(pastedText);
      const words = tokenizeWords(normalizedText);

      const document: Document = {
        id: crypto.randomUUID(),
        title: title.trim(),
        body: normalizedText,
        sourceType: "paste",
        createdAt: Date.now(),
        lastReadPosition: 0,
        lastWPM: defaultWPM,
        totalWords: words.length,
        lastUpdated: Date.now(),
      };

      // Save to storage
      documentStorage.saveDocument(document);

      // Update store - reload all documents to ensure consistency (no need to call addDocument)
      const allDocuments = documentStorage.loadDocuments();
      setDocuments(allDocuments);

      // Navigate to reader
      router.push(`/reader/${document.id}`);
      setOpen(false);
      setTitle("");
      setPastedText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create document");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlImport = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/parse-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();

      if (!result.success || !result.text) {
        setError(result.error || "Failed to parse URL");
        setIsLoading(false);
        return;
      }

      const words = tokenizeWords(result.text);
      const documentTitle = title.trim() || result.title || "Imported Article";

      const document: Document = {
        id: crypto.randomUUID(),
        title: documentTitle,
        body: result.text,
        sourceType: "paste", // Treat URL imports as paste for now
        createdAt: Date.now(),
        lastReadPosition: 0,
        lastWPM: defaultWPM,
        totalWords: words.length,
        lastUpdated: Date.now(),
      };

      // Save to storage
      documentStorage.saveDocument(document);

      // Update store
      const allDocuments = documentStorage.loadDocuments();
      setDocuments(allDocuments);

      // Navigate to reader
      router.push(`/reader/${document.id}`);
      setOpen(false);
      setTitle("");
      setUrl("");
      setPastedText("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to import from URL. Please check the URL and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await parseFile(file);

      if (!result.success || !result.text) {
        setError(result.error || "Failed to parse file");
        setIsLoading(false);
        return;
      }

      const words = tokenizeWords(result.text);
      const documentTitle = title.trim() || file.name.replace(/\.[^/.]+$/, "");

      const document: Document = {
        id: crypto.randomUUID(),
        title: documentTitle,
        body: result.text,
        sourceType: file.name.endsWith(".pdf")
          ? "pdf"
          : file.name.endsWith(".docx") || file.name.endsWith(".doc")
          ? "docx"
          : "txt",
        createdAt: Date.now(),
        lastReadPosition: 0,
        lastWPM: defaultWPM,
        totalWords: words.length,
        lastUpdated: Date.now(),
      };

      // Save to storage
      documentStorage.saveDocument(document);

      // Update store - reload all documents to ensure consistency (no need to call addDocument)
      const allDocuments = documentStorage.loadDocuments();
      setDocuments(allDocuments);

      // Navigate to reader
      router.push(`/reader/${document.id}`);
      setOpen(false);
      setTitle("");
      setPastedText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Document</Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Document</DialogTitle>
          <DialogDescription>
            Paste text, upload a file, or import from URL
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={mode === "paste" ? "default" : "outline"}
              onClick={() => {
                setMode("paste");
                setError(null);
              }}
              className="flex-1"
            >
              Paste
            </Button>
            <Button
              variant={mode === "upload" ? "default" : "outline"}
              onClick={() => {
                setMode("upload");
                setError(null);
              }}
              className="flex-1"
            >
              Upload
            </Button>
            <Button
              variant={mode === "url" ? "default" : "outline"}
              onClick={() => {
                setMode("url");
                setError(null);
              }}
              className="flex-1"
            >
              URL
            </Button>
          </div>

          {mode === "paste" ? (
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Label htmlFor="text">Text</Label>
              <textarea
                id="text"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your text here..."
                rows={10}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          ) : mode === "url" ? (
            <div className="space-y-2">
              <Label htmlFor="url">Article URL</Label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isLoading}
              />
              <Label htmlFor="url-title">Title (optional)</Label>
              <input
                id="url-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leave empty to use page title"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                The article text will be extracted from the webpage
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="file-title">Title (optional)</Label>
              <input
                id="file-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leave empty to use filename"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Label htmlFor="file">File (PDF, TXT, DOCX)</Label>
              <input
                id="file"
                type="file"
                accept=".pdf,.txt,.docx,.doc"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
                className="w-full text-sm"
                disabled={isLoading}
              />
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="text-center text-sm text-muted-foreground">
              {mode === "upload"
                ? "Parsing file..."
                : mode === "url"
                ? "Fetching and parsing article..."
                : "Processing..."}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {mode === "paste" && (
            <Button onClick={handlePasteSubmit} disabled={isLoading}>
              Start Reading
            </Button>
          )}
          {mode === "url" && (
            <Button onClick={handleUrlImport} disabled={isLoading || !url.trim()}>
              Import & Read
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

