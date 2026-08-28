"use client";

import { useEffect, useState } from "react";
import { OrganizationData } from "@/types";

interface ThemeWrapperProps {
  organization: OrganizationData | null;
  children: React.ReactNode;
}

export default function ThemeWrapper({ organization, children }: ThemeWrapperProps) {
  const [mounted, setMounted] = useState(false);

  const themeMode = organization?.themeMode || "system";
  const themeColor = organization?.themeColor || "cyan";
  const fontFamily = organization?.fontFamily || "inter";
  const fontSizeScale = organization?.fontSizeScale || "normal";

  // Dark mode custom colors
  const darkBg = organization?.darkBgColor || "#030712";
  const darkText = organization?.darkTextColor || "#f9fafb";
  const darkCard = organization?.darkCardColor || "rgba(17, 24, 39, 0.65)";
  const darkAccent = organization?.darkAccentColor || "#06B6D4";
  const darkSecondary = organization?.darkSecondaryAccent || "#8B5CF6";

  // Light mode custom colors
  const lightBg = organization?.lightBgColor || "#f8fafc";
  const lightText = organization?.lightTextColor || "#0f172a";
  const lightCard = organization?.lightCardColor || "rgba(255, 255, 255, 0.85)";
  const lightAccent = organization?.lightAccentColor || "#0284c7";
  const lightSecondary = organization?.lightSecondaryAccent || "#7c3aed";

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;

    // Apply CSS Variables
    root.style.setProperty("--dark-bg", darkBg);
    root.style.setProperty("--dark-text", darkText);
    root.style.setProperty("--dark-card", darkCard);
    root.style.setProperty("--dark-accent", darkAccent);
    root.style.setProperty("--dark-secondary", darkSecondary);

    root.style.setProperty("--light-bg", lightBg);
    root.style.setProperty("--light-text", lightText);
    root.style.setProperty("--light-card", lightCard);
    root.style.setProperty("--light-accent", lightAccent);
    root.style.setProperty("--light-secondary", lightSecondary);

    // Apply Active Mode
    const savedMode = localStorage.getItem("hp_theme_mode") || themeMode;
    const updateActiveMode = (mode: string) => {
      if (mode === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isDark) {
          root.classList.add("dark");
          root.classList.remove("light");
        } else {
          root.classList.add("light");
          root.classList.remove("dark");
        }
      } else if (mode === "light") {
        root.classList.add("light");
        root.classList.remove("dark");
      } else {
        root.classList.add("dark");
        root.classList.remove("light");
      }
    };

    updateActiveMode(savedMode);

    // Handle System Preference Change
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const current = localStorage.getItem("hp_theme_mode") || themeMode;
      if (current === "system") updateActiveMode("system");
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    // Custom Font Injection
    if (organization?.customFontType === "google" && organization?.googleFontUrl) {
      const linkId = "hp-google-font";
      let link = document.getElementById(linkId) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      link.href = organization.googleFontUrl;
      if (organization.googleFontName) {
        root.style.fontFamily = `"${organization.googleFontName}", sans-serif`;
      }
    } else if (organization?.customFontType === "upload" && organization?.uploadedFontData) {
      const styleId = "hp-uploaded-font";
      let style = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }
      const fontName = organization.uploadedFontName || "CustomUploadedFont";
      style.textContent = `
        @font-face {
          font-family: '${fontName}';
          src: url('${organization.uploadedFontData}') format('woff2');
          font-display: swap;
        }
      `;
      root.style.fontFamily = `'${fontName}', sans-serif`;
    }

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, [
    themeMode,
    themeColor,
    fontFamily,
    fontSizeScale,
    darkBg,
    darkText,
    darkCard,
    darkAccent,
    darkSecondary,
    lightBg,
    lightText,
    lightCard,
    lightAccent,
    lightSecondary,
    organization,
  ]);

  return (
    <div
      className={`theme-container transition-colors duration-300 ${
        fontSizeScale === "compact"
          ? "text-sm"
          : fontSizeScale === "large"
          ? "text-lg"
          : "text-base"
      }`}
    >
      {children}
    </div>
  );
}
