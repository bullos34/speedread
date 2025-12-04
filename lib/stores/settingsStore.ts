import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Settings } from "@/types";

interface SettingsState extends Settings {
  setWPM: (wpm: number) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: Settings["fontFamily"]) => void;
  setTheme: (theme: Settings["theme"]) => void;
  setChunkSize: (chunkSize: number) => void;
  setFocusMode: (focusMode: boolean) => void;
  toggleFocusMode: () => void;
}

const defaultSettings: Settings = {
  wpm: 300,
  fontSize: 48,
  fontFamily: "system",
  theme: "system",
  chunkSize: 1,
  focusMode: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      setWPM: (wpm) => set({ wpm: Math.max(100, Math.min(1000, wpm)) }),
      setFontSize: (fontSize) => set({ fontSize: Math.max(24, Math.min(72, fontSize)) }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setTheme: (theme) => set({ theme }),
      setChunkSize: (chunkSize) => set({ chunkSize: Math.max(1, Math.min(3, chunkSize)) }),
      setFocusMode: (focusMode) => set({ focusMode }),
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
    }),
    {
      name: "speedread-settings",
    }
  )
);

