"use client";

import { useEffect } from "react";

interface KeyboardShortcutsOptions {
  onPlayPause?: () => void;
  onSkipForward?: () => void;
  onSkipBackward?: () => void;
  onWPMIncrease?: () => void;
  onWPMDecrease?: () => void;
  onEscape?: () => void;
  onToggleFocus?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onPlayPause,
  onSkipForward,
  onSkipBackward,
  onWPMIncrease,
  onWPMDecrease,
  onEscape,
  onToggleFocus,
  enabled = true,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          onPlayPause?.();
          break;
        case "ArrowRight":
          e.preventDefault();
          onSkipForward?.();
          break;
        case "ArrowLeft":
          e.preventDefault();
          onSkipBackward?.();
          break;
        case "+":
        case "=":
        case "ArrowUp":
          e.preventDefault();
          onWPMIncrease?.();
          break;
        case "-":
        case "_":
        case "ArrowDown":
          e.preventDefault();
          onWPMDecrease?.();
          break;
        case "Escape":
          e.preventDefault();
          onEscape?.();
          break;
        case "f":
        case "F":
          // Only toggle focus if not typing in an input
          if (!e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            onToggleFocus?.();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    enabled,
    onPlayPause,
    onSkipForward,
    onSkipBackward,
    onWPMIncrease,
    onWPMDecrease,
    onEscape,
    onToggleFocus,
  ]);
}

