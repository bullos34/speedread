"use client";

interface ProgressIndicatorProps {
  currentIndex: number;
  totalWords: number;
  progress: number;
}

export function ProgressIndicator({
  currentIndex,
  totalWords,
  progress,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full space-y-1.5 sm:space-y-2">
      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
        <span className="truncate">
          Word {currentIndex + 1} of {totalWords}
        </span>
        <span className="flex-shrink-0 ml-2">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

