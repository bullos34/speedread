"use client";

import { useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { RSVPReader } from "@/components/reader/RSVPReader";
import { ReaderControls } from "@/components/reader/ReaderControls";
import { ReaderSettings } from "@/components/reader/ReaderSettings";
import { ProgressIndicator } from "@/components/reader/ProgressIndicator";
import { KeyboardHelp } from "@/components/shared/KeyboardHelp";
import { SettingsDrawer } from "@/components/shared/SettingsDrawer";
import { useRSVP } from "@/lib/rsvp/useRSVP";
import { useDocumentStore } from "@/lib/stores/documentStore";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { documentStorage } from "@/lib/storage/documentStorage";
import { progressStorage } from "@/lib/storage/progressStorage";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Button } from "@/components/ui/button";
import { tokenizeWords } from "@/lib/rsvp/wordTokenizer";

export default function ReaderPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const getDocument = useDocumentStore((state) => state.getDocument);
  const updateDocument = useDocumentStore((state) => state.updateDocument);
  const setCurrentDocument = useDocumentStore((state) => state.setCurrentDocument);
  const wpm = useSettingsStore((state) => state.wpm);
  const setWPM = useSettingsStore((state) => state.setWPM);
  const chunkSize = useSettingsStore((state) => state.chunkSize);

  const document = getDocument(documentId);

  // Load document from storage if not in store
  useEffect(() => {
    if (!document) {
      const storedDoc = documentStorage.getDocument(documentId);
      if (storedDoc) {
        const allDocuments = documentStorage.loadDocuments();
        useDocumentStore.getState().setDocuments(allDocuments);
        setCurrentDocument(documentId);
      } else {
        router.push("/");
      }
    } else {
      setCurrentDocument(documentId);
      progressStorage.saveLastDocument(documentId);
    }
  }, [documentId, document, router, setCurrentDocument]);

  // Progress update handler
  const handleProgressUpdate = useCallback(
    (wordIndex: number) => {
      if (!document) return;

      const words = tokenizeWords(document.body);
      const updatedDoc = {
        ...document,
        lastReadPosition: wordIndex,
        lastWPM: wpm,
        lastUpdated: Date.now(),
      };

      updateDocument(documentId, updatedDoc);
      documentStorage.saveDocument(updatedDoc);

      // Also save to progress storage
      progressStorage.saveProgress({
        documentId,
        wordIndex,
        totalWords: words.length,
        lastUpdated: Date.now(),
      });
    },
    [document, documentId, updateDocument, wpm]
  );

  const rsvp = useRSVP({
    document: document || null,
    wpm,
    chunkSize,
    onProgressUpdate: handleProgressUpdate,
  });

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: () => {
      if (rsvp.isPlaying) {
        rsvp.pause();
      } else {
        rsvp.play();
      }
    },
    onSkipForward: () => rsvp.skipForward(1),
    onSkipBackward: () => rsvp.skipBackward(1),
    onWPMIncrease: () => setWPM(Math.min(1000, wpm + 50)),
    onWPMDecrease: () => setWPM(Math.max(100, wpm - 50)),
    onEscape: () => router.push("/"),
    enabled: !!document,
  });

  if (!document) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Document not found</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b p-2 sm:p-4 bg-background sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-sm flex-shrink-0"
            >
              ← Library
            </Button>
            <h1 className="ml-2 sm:ml-4 text-sm sm:text-lg font-semibold truncate">
              {document.title}
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <SettingsDrawer />
            <div className="hidden sm:block">
              <KeyboardHelp />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Reader area */}
        <div className="flex flex-1 flex-col w-full">
          <div className="flex-1 min-h-0">
            <RSVPReader chunk={rsvp.currentChunk} />
          </div>
          <div className="border-t p-2 sm:p-4">
            <ProgressIndicator
              currentIndex={rsvp.currentIndex}
              totalWords={rsvp.totalWords}
              progress={rsvp.progress}
            />
            <div className="mt-2 sm:mt-4">
              <ReaderControls
                isPlaying={rsvp.isPlaying}
                onPlay={rsvp.play}
                onPause={rsvp.pause}
                onRestart={rsvp.restart}
                onSkipForward={rsvp.skipForward}
                onSkipBackward={rsvp.skipBackward}
                wpm={wpm}
                onWPMChange={setWPM}
              />
            </div>
          </div>
        </div>

        {/* Settings sidebar - hidden on mobile */}
        <aside className="hidden md:block w-80 border-l overflow-y-auto p-4">
          <ReaderSettings />
        </aside>
      </div>
    </div>
  );
}

