"use client";

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
import { PrimaryLogo } from "@/components/branding/PrimaryLogo";
import type { Document } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HeroSection() {
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

      documentStorage.saveDocument(document);
      const allDocuments = documentStorage.loadDocuments();
      setDocuments(allDocuments);

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

  const handleFileUpload = async (file: File) => {
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
        sourceType: file.type.includes("pdf")
          ? "pdf"
          : file.type.includes("wordprocessingml")
          ? "docx"
          : "txt",
        createdAt: Date.now(),
        lastReadPosition: 0,
        lastWPM: defaultWPM,
        totalWords: words.length,
        lastUpdated: Date.now(),
      };

      documentStorage.saveDocument(document);
      const allDocuments = documentStorage.loadDocuments();
      setDocuments(allDocuments);

      router.push(`/reader/${document.id}`);
      setOpen(false);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file");
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
        sourceType: "url",
        createdAt: Date.now(),
        lastReadPosition: 0,
        lastWPM: defaultWPM,
        totalWords: words.length,
        lastUpdated: Date.now(),
      };

      documentStorage.saveDocument(document);
      const allDocuments = documentStorage.loadDocuments();
      setDocuments(allDocuments);

      router.push(`/reader/${document.id}`);
      setOpen(false);
      setTitle("");
      setUrl("");
      setPastedText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse URL");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6 sm:p-8 md:p-12 text-center">
      <div className="flex justify-center mb-4 sm:mb-6">
        <PrimaryLogo size="lg" className="hidden sm:block" />
        <PrimaryLogo size="md" className="block sm:hidden" />
      </div>
      <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
        Read faster with RSVP. Paste text, upload files, or import articles and start speed reading instantly.
      </p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7">
            + Add Document
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>
              Paste text, upload a file, or import from a URL to start reading
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
                Paste Text
              </Button>
              <Button
                variant={mode === "upload" ? "default" : "outline"}
                onClick={() => {
                  setMode("upload");
                  setError(null);
                }}
                className="flex-1"
              >
                Upload File
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
                <Label htmlFor="paste-title">Title</Label>
                <input
                  id="paste-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Label htmlFor="paste-text">Text</Label>
                <textarea
                  id="paste-text"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your text here..."
                  rows={8}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            ) : mode === "upload" ? (
              <div className="space-y-2">
                <Label htmlFor="upload-title">Title (optional)</Label>
                <input
                  id="upload-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Leave empty to use filename"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Label htmlFor="upload-file">File (PDF, TXT, DOCX)</Label>
                <input
                  id="upload-file"
                  type="file"
                  accept=".pdf,.txt,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="url-title">Title (optional)</Label>
                <input
                  id="url-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Leave empty to use page title"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
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
                  ? "Fetching and parsing URL..."
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
              <Button onClick={handleUrlImport} disabled={isLoading}>
                Import & Read
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

