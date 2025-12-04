"use client";

import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { SettingsDrawer } from "@/components/shared/SettingsDrawer";

interface ReaderControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onSkipForward: (words?: number) => void;
  onSkipBackward: (words?: number) => void;
  wpm: number;
  onWPMChange: (wpm: number) => void;
}

export function ReaderControls({
  isPlaying,
  onPlay,
  onPause,
  onRestart,
  onSkipForward,
  onSkipBackward,
  wpm,
  onWPMChange,
}: ReaderControlsProps) {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
      {/* Main controls - larger on mobile */}
      <div className="flex items-center justify-center gap-2 sm:gap-2 w-full">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 sm:h-10 sm:w-10 text-lg"
          onClick={() => onSkipBackward(10)}
          aria-label="Skip backward 10 words"
          title="Skip backward 10 words"
        >
          ⏮
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 sm:h-10 sm:w-10 text-lg"
          onClick={() => onSkipBackward(1)}
          aria-label="Skip backward 1 word"
          title="Skip backward 1 word"
        >
          ←
        </Button>
        <Button
          size="lg"
          className="h-14 w-14 sm:h-12 sm:w-12 text-2xl"
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause reading" : "Start reading"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 sm:h-10 sm:w-10 text-lg"
          onClick={() => onSkipForward(1)}
          aria-label="Skip forward 1 word"
          title="Skip forward 1 word"
        >
          →
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 sm:h-10 sm:w-10 text-lg"
          onClick={() => onSkipForward(10)}
          aria-label="Skip forward 10 words"
          title="Skip forward 10 words"
        >
          ⏭
        </Button>
      </div>
      {/* Secondary controls */}
      <div className="flex items-center justify-center gap-2 sm:gap-2 flex-wrap w-full">
        <Button
          variant="outline"
          size="sm"
          className="h-10 sm:h-9"
          onClick={onRestart}
          title="Restart"
        >
          ↻ Restart
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 sm:h-9 sm:w-9 text-lg"
            onClick={() => onWPMChange(Math.max(100, wpm - 50))}
            title="Decrease WPM"
          >
            −
          </Button>
          <span className="min-w-[70px] sm:min-w-[60px] text-center text-sm font-medium">
            {wpm} WPM
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 sm:h-9 sm:w-9 text-lg"
            onClick={() => onWPMChange(Math.min(1000, wpm + 50))}
            title="Increase WPM"
          >
            +
          </Button>
        </div>
        {/* Settings button for mobile - visible in controls area */}
        <div className="md:hidden">
          <SettingsDrawer />
        </div>
      </div>
    </div>
  );
}

