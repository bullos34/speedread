"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PrimaryLogo } from "@/components/branding/PrimaryLogo";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHome = pathname === "/";
  const isReader = pathname?.startsWith("/reader/");

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            {!isHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-sm"
              >
                ← Home
              </Button>
            )}
            <button
              onClick={() => router.push("/")}
              className="hover:opacity-80 transition-opacity"
            >
              <PrimaryLogo size="sm" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="h-9 w-9"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

