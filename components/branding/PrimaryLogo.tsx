"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface PrimaryLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showAccent?: boolean; // Show accent color on the dash
}

const sizeClasses = {
  sm: "text-lg px-3 py-1.5",
  md: "text-2xl px-4 py-2",
  lg: "text-3xl px-6 py-3",
};

export function PrimaryLogo({ className, size = "md", showAccent = false }: PrimaryLogoProps) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-xl border",
        "border-slate-300 dark:border-slate-500",
        "bg-white dark:bg-slate-900",
        sizeClasses[size],
        className
      )}
    >
      <span
        className={cn(
          "font-semibold tracking-wide",
          "text-slate-900 dark:text-slate-50"
        )}
      >
        Speed{showAccent ? (
          <>
            -<span className="text-blue-500 dark:text-blue-400">r</span>
          </>
        ) : (
          "-r"
        )}
      </span>
    </div>
  );
}

