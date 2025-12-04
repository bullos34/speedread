"use client";

import { useTheme } from "next-themes";

interface FocusedWordBoxProps {
  width?: number;
  height?: number;
  className?: string;
}

export function FocusedWordBox({
  width = 220,
  height = 60,
  className,
}: FocusedWordBoxProps) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 220 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer box */}
      <rect
        x="10"
        y="10"
        width="200"
        height="40"
        rx="12"
        fill={isDark ? "#1E293B" : "#FFFFFF"}
        stroke={isDark ? "#475569" : "#111827"}
        strokeWidth="1.5"
      />
      {/* Top guide line */}
      <line
        x1="24"
        y1="20"
        x2="196"
        y2="20"
        stroke="#3B82F6"
        strokeWidth="1"
      />
      {/* Bottom guide line */}
      <line
        x1="24"
        y1="40"
        x2="196"
        y2="40"
        stroke="#3B82F6"
        strokeWidth="1"
      />
      {/* Text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="18"
        fill={isDark ? "#F9FAFB" : "#111827"}
        fontWeight="600"
      >
        Speed-r
      </text>
    </svg>
  );
}

