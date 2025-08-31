"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Find the current theme index
  const currentIndex = themes.findIndex((t) => t.value === theme) !== -1 ? themes.findIndex((t) => t.value === theme) : 0;
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  return (
    <button
      onClick={() => setTheme(nextTheme.value)}
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 50,
        padding: "0.5rem 1.5rem",
        borderRadius: 6,
        border: "2px solid #4299e1",
        background: theme === "dark" ? "#2d3748" : theme === "light" ? "#bee3f8" : "#e2e8f0",
        color: theme === "dark" ? "#fff" : "#222",
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      aria-label={`Switch theme (current: ${themes[currentIndex].label})`}
      title={`Switch theme (current: ${themes[currentIndex].label})`}
    >
      {themes[currentIndex].label} Mode
    </button>
  );
}
