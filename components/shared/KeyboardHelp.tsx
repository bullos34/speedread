"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !(e.target instanceof HTMLInputElement)) {
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          ? Help
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Controls</DialogTitle>
          <DialogDescription>
            Keyboard shortcuts and touch controls
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Touch Controls (Mobile)</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tap play/pause button</span>
                <span className="font-medium">Play / Pause</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tap arrow buttons</span>
                <span className="font-medium">Skip words</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tap +/- buttons</span>
                <span className="font-medium">Adjust WPM</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Space</span>
                <span className="text-muted-foreground">Play / Pause</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">← / →</span>
                <span className="text-muted-foreground">Skip backward / forward</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">↑ / ↓ or +/-</span>
                <span className="text-muted-foreground">Increase / Decrease WPM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Esc</span>
                <span className="text-muted-foreground">Back to library</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

