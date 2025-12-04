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
import { AppHeader } from "@/components/shared/AppHeader";
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
  const focusMode = useSettingsStore((state) => state.focusMode);
  const toggleFocusMode = useSettingsStore((state) => state.toggleFocusMode);

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
    onEscape: () => {
      if (focusMode) {
        toggleFocusMode();
      } else {
        router.push("/");
      }
    },
    onToggleFocus: () => toggleFocusMode(),
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

  // Focus mode: show only the reading pane
  if (focusMode) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-background">
        <RSVPReader chunk={rsvp.currentChunk} />
        {/* Minimal exit button - low opacity, full opacity on hover */}
        <div className="absolute top-4 right-4 opacity-30 hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFocusMode}
            className="h-10 w-10 bg-background/90 backdrop-blur-sm border-2"
            aria-label="Exit focus mode (F or Esc)"
            title="Exit focus mode (F or Esc)"
          >
            ✕
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader />
      
      {/* Document title bar */}
      <div className="border-b p-2 sm:p-3 bg-background">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <h1 className="text-sm sm:text-lg font-semibold truncate flex-1">
            {document.title}
          </h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFocusMode}
              className="text-xs sm:text-sm"
              title="Focus mode (F)"
            >
              🔍 Focus
            </Button>
            <SettingsDrawer />
            <div className="hidden sm:block">
              <KeyboardHelp />
            </div>
          </div>
        </div>
      </div>

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

