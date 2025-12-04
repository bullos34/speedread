"use client";

import { useTheme } from "next-themes";

interface IconMarkProps {
  variant?: "sp" | "s";
  size?: number;
  className?: string;
}

export function IconMark({ variant = "sp", size = 64, className }: IconMarkProps) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const fontSize = variant === "sp" ? size * 0.3125 : size * 0.375; // 20/64 or 24/64
  const text = variant === "sp" ? "Sp" : "S";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="8"
        y="16"
        width="48"
        height="32"
        rx="10"
        fill={isDark ? "#020617" : "#FFFFFF"}
        stroke={isDark ? "#3B82F6" : "#3B82F6"}
        strokeWidth="2"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize={fontSize}
        fill={isDark ? "#F9FAFB" : "#020617"}
        fontWeight="600"
      >
        {text}
      </text>
    </svg>
  );
}

