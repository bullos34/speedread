"use client";

import { useSettingsStore } from "@/lib/stores/settingsStore";
import { cn } from "@/lib/utils";

interface RSVPReaderProps {
  word: string;
  className?: string;
}

const fontFamilyMap = {
  system: "system-ui, -apple-system, sans-serif",
  serif: "Georgia, serif",
  mono: "Menlo, Monaco, monospace",
  "sans-serif": "Inter, sans-serif",
};

export function RSVPReader({ word, className }: RSVPReaderProps) {
  const fontSize = useSettingsStore((state) => state.fontSize);
  const fontFamily = useSettingsStore((state) => state.fontFamily);

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center px-4 sm:px-8",
        className
      )}
    >
      <div
        className="text-center transition-opacity duration-75 max-w-full break-words"
        style={{
          fontSize: `clamp(24px, ${fontSize * 0.8}px, ${fontSize}px)`,
          fontFamily: fontFamilyMap[fontFamily],
          lineHeight: "1.2",
        }}
        role="region"
        aria-live="polite"
        aria-label="Current word"
      >
        {word || "Ready to read"}
      </div>
    </div>
  );
}

