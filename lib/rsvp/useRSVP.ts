"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { tokenizeWords, isSentenceEnd } from "./wordTokenizer";
import type { Document } from "@/types";

interface UseRSVPOptions {
  document: Document | null;
  wpm: number;
  chunkSize: number; // Number of words to display at once (1-3)
  onProgressUpdate?: (wordIndex: number) => void;
  autoSaveInterval?: number; // Save progress every N words
}

interface UseRSVPReturn {
  currentChunk: string; // The current chunk of words to display
  currentIndex: number;
  totalWords: number;
  isPlaying: boolean;
  progress: number; // 0-100
  play: () => void;
  pause: () => void;
  restart: () => void;
  skipForward: (words?: number) => void;
  skipBackward: (words?: number) => void;
  goToIndex: (index: number) => void;
}

const SENTENCE_END_DELAY_MULTIPLIER = 1.5; // 50% extra delay on sentence endings

export function useRSVP({
  document,
  wpm,
  chunkSize,
  onProgressUpdate,
  autoSaveInterval = 10,
}: UseRSVPOptions): UseRSVPReturn {
  const [words, setWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedIndexRef = useRef(0);

  // Tokenize document text when document changes
  useEffect(() => {
    if (document) {
      const tokenized = tokenizeWords(document.body);
      setWords(tokenized);
      setCurrentIndex(document.lastReadPosition || 0);
      lastSavedIndexRef.current = document.lastReadPosition || 0;
    } else {
      setWords([]);
      setCurrentIndex(0);
      lastSavedIndexRef.current = 0;
    }
  }, [document?.id, document?.body]);

  // Calculate interval in milliseconds based on WPM
  const getInterval = useCallback(
    (word: string): number => {
      const baseInterval = (60 * 1000) / wpm;
      if (isSentenceEnd(word)) {
        return baseInterval * SENTENCE_END_DELAY_MULTIPLIER;
      }
      return baseInterval;
    },
    [wpm]
  );

  // Auto-save progress
  const saveProgressIfNeeded = useCallback(
    (index: number) => {
      if (
        onProgressUpdate &&
        Math.abs(index - lastSavedIndexRef.current) >= autoSaveInterval
      ) {
        onProgressUpdate(index);
        lastSavedIndexRef.current = index;
      }
    },
    [onProgressUpdate, autoSaveInterval]
  );

  // Play function
  const play = useCallback(() => {
    if (words.length === 0) {
      return;
    }

    setIsPlaying(true);

    const scheduleNext = () => {
      setCurrentIndex((prevIndex) => {
        // Advance by chunkSize, but don't go past the last word
        const nextIndex = Math.min(prevIndex + chunkSize, words.length - 1);
        
        if (prevIndex >= words.length - 1) {
          setIsPlaying(false);
          if (intervalRef.current) {
            clearTimeout(intervalRef.current);
            intervalRef.current = null;
          }
          return prevIndex;
        }

        saveProgressIfNeeded(nextIndex);
        // Use the last word in the chunk for interval calculation (for sentence endings)
        const lastWordInChunk = words[Math.min(nextIndex + chunkSize - 1, words.length - 1)];
        const interval = getInterval(lastWordInChunk);

        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
        }

        intervalRef.current = setTimeout(() => {
          scheduleNext();
        }, interval);

        return nextIndex;
      });
    };

    // Clear any existing interval
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    // Start immediately
    const currentWord = words[currentIndex];
    const interval = getInterval(currentWord);
    intervalRef.current = setTimeout(() => {
      scheduleNext();
    }, interval);
  }, [words, currentIndex, chunkSize, getInterval, saveProgressIfNeeded]);

  // Pause function
  const pause = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    // Save progress on pause
    if (onProgressUpdate) {
      onProgressUpdate(currentIndex);
      lastSavedIndexRef.current = currentIndex;
    }
  }, [currentIndex, onProgressUpdate]);

  // Restart function
  const restart = useCallback(() => {
    pause();
    setCurrentIndex(0);
    lastSavedIndexRef.current = 0;
    if (onProgressUpdate) {
      onProgressUpdate(0);
    }
  }, [pause, onProgressUpdate]);

  // Skip forward
  const skipForward = useCallback(
    (count: number = 1) => {
      pause();
      setCurrentIndex((prev) => {
        const next = Math.min(prev + count, words.length - 1);
        saveProgressIfNeeded(next);
        return next;
      });
    },
    [pause, words.length, saveProgressIfNeeded]
  );

  // Skip backward
  const skipBackward = useCallback(
    (count: number = 1) => {
      pause();
      setCurrentIndex((prev) => {
        const next = Math.max(prev - count, 0);
        saveProgressIfNeeded(next);
        return next;
      });
    },
    [pause, saveProgressIfNeeded]
  );

  // Go to specific index
  const goToIndex = useCallback(
    (index: number) => {
      pause();
      const clampedIndex = Math.max(0, Math.min(index, words.length - 1));
      setCurrentIndex(clampedIndex);
      saveProgressIfNeeded(clampedIndex);
    },
    [pause, words.length, saveProgressIfNeeded]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, []);

  // Update interval when WPM or chunkSize changes while playing
  useEffect(() => {
    if (isPlaying && words.length > 0 && currentIndex < words.length) {
      // Restart playback with new WPM or chunkSize
      const wasPlaying = isPlaying;
      pause();
      if (wasPlaying) {
        // Small delay to ensure pause completes
        setTimeout(() => {
          play();
        }, 0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wpm, chunkSize]); // React to WPM and chunkSize changes

  // Get current chunk of words
  const getCurrentChunk = useCallback((): string => {
    if (words.length === 0 || currentIndex >= words.length) {
      return "";
    }
    const chunk: string[] = [];
    for (let i = 0; i < chunkSize && currentIndex + i < words.length; i++) {
      chunk.push(words[currentIndex + i]);
    }
    return chunk.join(" ");
  }, [words, currentIndex, chunkSize]);

  const currentChunk = getCurrentChunk();
  const totalWords = words.length;
  const progress = totalWords > 0 ? (currentIndex / totalWords) * 100 : 0;

  return {
    currentChunk,
    currentIndex,
    totalWords,
    isPlaying,
    progress,
    play,
    pause,
    restart,
    skipForward,
    skipBackward,
    goToIndex,
  };
}

