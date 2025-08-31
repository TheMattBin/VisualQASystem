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

  return (
    <div style={{ position: "fixed", bottom: 16, left: 16, zIndex: 50, display: 'flex', gap: 8 }}>
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 6,
            border: theme === t.value ? "2px solid #4299e1" : "1px solid #ccc",
            background: theme === "dark" ? (t.value === theme ? "#2d3748" : "#222") : (t.value === theme ? "#bee3f8" : "#fff"),
            color: theme === "dark" ? "#fff" : "#222",
            fontWeight: t.value === theme ? 700 : 400,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          aria-pressed={theme === t.value}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
