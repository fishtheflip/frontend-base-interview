"use client";

import { useEffect, useState } from "react";

const storageKey = "frontend-base-theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const enabled = saved !== "light";
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  const toggleTheme = () => {
    const enabled = !dark;
    setDark(enabled);
    document.documentElement.classList.toggle("dark", enabled);
    window.localStorage.setItem(storageKey, enabled ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
      aria-label={dark ? "Включить светлую тему" : "Включить тёмную тему"}
      title={dark ? "Светлая тема" : "Тёмная тема"}
    >
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
      <span className="hidden sm:inline">{dark ? "Светлая" : "Тёмная"}</span>
    </button>
  );
}
