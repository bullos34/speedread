"use client";

import { useSettingsStore } from "@/lib/stores/settingsStore";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ReaderSettings() {
  const wpm = useSettingsStore((state) => state.wpm);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const fontFamily = useSettingsStore((state) => state.fontFamily);
  const setWPM = useSettingsStore((state) => state.setWPM);
  const setFontSize = useSettingsStore((state) => state.setFontSize);
  const setFontFamily = useSettingsStore((state) => state.setFontFamily);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6 rounded-lg border p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold">Settings</h3>

      <div className="space-y-2">
        <Label htmlFor="wpm-slider">Words Per Minute: {wpm}</Label>
        <Slider
          id="wpm-slider"
          min={100}
          max={1000}
          step={50}
          value={[wpm]}
          onValueChange={([value]) => setWPM(value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-size-slider">Font Size: {fontSize}px</Label>
        <Slider
          id="font-size-slider"
          min={24}
          max={72}
          step={4}
          value={[fontSize]}
          onValueChange={([value]) => setFontSize(value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-family">Font Family</Label>
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger id="font-family">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="mono">Monospace</SelectItem>
            <SelectItem value="sans-serif">Sans-serif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select
          value={mounted ? theme : "system"}
          onValueChange={(value) => setTheme(value)}
        >
          <SelectTrigger id="theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

