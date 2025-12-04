"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReaderSettings } from "@/components/reader/ReaderSettings";

export function SettingsDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="md:hidden h-9 min-w-[44px]"
        aria-label="Open settings"
      >
        <span className="text-lg leading-none">⚙️</span>
        <span className="ml-1.5 text-xs sm:text-sm">Settings</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <ReaderSettings />
        </DialogContent>
      </Dialog>
    </>
  );
}

