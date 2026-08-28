"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { soundFX } from "./CyberAudioFx";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeSwitcherProps {
  initialMode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
  compact?: boolean;
}

export default function ThemeSwitcher({
  initialMode = "dark",
  onModeChange,
  compact = false,
}: ThemeSwitcherProps) {
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  useEffect(() => {
    const saved = localStorage.getItem("hp_theme_mode") as ThemeMode | null;
    if (saved && ["dark", "light", "system"].includes(saved)) {
      setMode(saved);
      applyMode(saved);
    } else {
      applyMode(initialMode);
    }
  }, [initialMode]);

  const applyMode = (newMode: ThemeMode) => {
    const root = document.documentElement;
    if (newMode === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    } else if (newMode === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  };

  const handleSelect = (newMode: ThemeMode) => {
    soundFX.click();
    setMode(newMode);
    localStorage.setItem("hp_theme_mode", newMode);
    applyMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };

  if (compact) {
    return (
      <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
        <button
          onClick={() => handleSelect("dark")}
          className={`p-1.5 rounded-lg transition-colors ${
            mode === "dark" ? "bg-cyan-500 text-gray-950 shadow-sm" : "text-gray-400 hover:text-white"
          }`}
          title="Dark Mode"
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleSelect("light")}
          className={`p-1.5 rounded-lg transition-colors ${
            mode === "light" ? "bg-amber-400 text-gray-950 shadow-sm" : "text-gray-400 hover:text-white"
          }`}
          title="Light Mode"
        >
          <Sun className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleSelect("system")}
          className={`p-1.5 rounded-lg transition-colors ${
            mode === "system" ? "bg-purple-500 text-white shadow-sm" : "text-gray-400 hover:text-white"
          }`}
          title="System Preference"
        >
          <Laptop className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
      <button
        onClick={() => handleSelect("dark")}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
          mode === "dark" ? "bg-cyan-500 text-gray-950" : "text-gray-400 hover:text-white"
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Dark</span>
      </button>

      <button
        onClick={() => handleSelect("light")}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
          mode === "light" ? "bg-amber-400 text-gray-950" : "text-gray-400 hover:text-white"
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Light</span>
      </button>

      <button
        onClick={() => handleSelect("system")}
        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
          mode === "system" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        <Laptop className="w-3.5 h-3.5" />
        <span>System</span>
      </button>
    </div>
  );
}
