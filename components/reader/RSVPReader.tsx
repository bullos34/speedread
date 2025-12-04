"use client";

import { useSettingsStore } from "@/lib/stores/settingsStore";
import { cn } from "@/lib/utils";

interface RSVPReaderProps {
  chunk: string; // Chunk of words to display
  className?: string;
  onTap?: () => void; // Callback when user taps the word area
}

const fontFamilyMap = {
  system: "system-ui, -apple-system, sans-serif",
  serif: "Georgia, serif",
  mono: "Menlo, Monaco, monospace",
  "sans-serif": "Inter, sans-serif",
};

export function RSVPReader({ chunk, className, onTap }: RSVPReaderProps) {
  const fontSize = useSettingsStore((state) => state.fontSize);
  const fontFamily = useSettingsStore((state) => state.fontFamily);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    // Only trigger if tapping the word area itself, not margins
    e.stopPropagation();
    onTap?.();
  };

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center px-4 sm:px-8",
        className
      )}
    >
      <div
        className={cn(
          "text-center transition-opacity duration-75 max-w-full break-words",
          onTap && "cursor-pointer select-none touch-manipulation"
        )}
        style={{
          fontSize: `clamp(24px, ${fontSize * 0.8}px, ${fontSize}px)`,
          fontFamily: fontFamilyMap[fontFamily],
          lineHeight: "1.2",
          touchAction: onTap ? "manipulation" : "auto", // Prevent double-tap zoom
        }}
        role="region"
        aria-live="polite"
        aria-label="Current word"
        onClick={handleTap}
        onTouchEnd={handleTap}
      >
        {chunk || "Ready to read"}
      </div>
    </div>
  );
}

