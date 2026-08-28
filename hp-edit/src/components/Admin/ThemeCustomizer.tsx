"use client";

import { useState, useRef } from "react";
import { OrganizationData } from "@/types";
import {
  Palette,
  Type,
  Volume2,
  Image as ImageIcon,
  Upload,
  Save,
  CheckCircle2,
  Sparkles,
  Trash2,
  Eye,
  Sun,
  Moon,
  Link as LinkIcon,
  ShieldCheck,
  Activity
} from "lucide-react";
import { updateOrganization } from "@/lib/actions";
import { calculateContrast } from "@/lib/contrast";
import ThemeSwitcher from "../ThemeSwitcher";

interface ThemeCustomizerProps {
  organization: OrganizationData;
}

const colorPresets = [
  { id: "cyan", name: "Electric Cyan", darkPrimary: "#06B6D4", darkSecondary: "#8B5CF6", lightPrimary: "#0284c7", lightSecondary: "#7c3aed" },
  { id: "purple", name: "Cyber Violet", darkPrimary: "#8B5CF6", darkSecondary: "#EC4899", lightPrimary: "#7c3aed", lightSecondary: "#db2777" },
  { id: "emerald", name: "Emerald Matrix", darkPrimary: "#10B981", darkSecondary: "#06B6D4", lightPrimary: "#059669", lightSecondary: "#0284c7" },
  { id: "amber", name: "Cyberpunk Gold", darkPrimary: "#F59E0B", darkSecondary: "#EF4444", lightPrimary: "#d97706", lightSecondary: "#dc2626" },
  { id: "rose", name: "Crimson Rose", darkPrimary: "#F43F5E", darkSecondary: "#8B5CF6", lightPrimary: "#e11d48", lightSecondary: "#7c3aed" },
  { id: "blue", name: "Ultra Tech Blue", darkPrimary: "#3B82F6", darkSecondary: "#06B6D4", lightPrimary: "#2563eb", lightSecondary: "#0284c7" },
  { id: "mono", name: "Monochrome Pro", darkPrimary: "#FFFFFF", darkSecondary: "#9CA3AF", lightPrimary: "#0f172a", lightSecondary: "#475569" },
];

const fontPresets = [
  { id: "inter", name: "Inter", desc: "Clean & High Readability" },
  { id: "space-grotesk", name: "Space Grotesk", desc: "Neo-Brutalist & Cyber" },
  { id: "outfit", name: "Outfit", desc: "Modern Geometric Tech" },
  { id: "syne", name: "Syne", desc: "High-End Luxury Studio" },
  { id: "plus-jakarta", name: "Plus Jakarta Sans", desc: "Enterprise SaaS Polish" },
];

export default function ThemeCustomizer({ organization }: ThemeCustomizerProps) {
  // Theme Mode
  const [themeMode, setThemeMode] = useState(organization.themeMode || "system");

  // Dark Mode Colors
  const [darkBgColor, setDarkBgColor] = useState(organization.darkBgColor || "#030712");
  const [darkTextColor, setDarkTextColor] = useState(organization.darkTextColor || "#f9fafb");
  const [darkCardColor, setDarkCardColor] = useState(organization.darkCardColor || "rgba(17, 24, 39, 0.65)");
  const [darkAccentColor, setDarkAccentColor] = useState(organization.darkAccentColor || "#06B6D4");
  const [darkSecondaryAccent, setDarkSecondaryAccent] = useState(organization.darkSecondaryAccent || "#8B5CF6");

  // Light Mode Colors
  const [lightBgColor, setLightBgColor] = useState(organization.lightBgColor || "#f8fafc");
  const [lightTextColor, setLightTextColor] = useState(organization.lightTextColor || "#0f172a");
  const [lightCardColor, setLightCardColor] = useState(organization.lightCardColor || "rgba(255, 255, 255, 0.85)");
  const [lightAccentColor, setLightAccentColor] = useState(organization.lightAccentColor || "#0284c7");
  const [lightSecondaryAccent, setLightSecondaryAccent] = useState(organization.lightSecondaryAccent || "#7c3aed");

  // Preset Theme & Font
  const [themeColor, setThemeColor] = useState(organization.themeColor || "cyan");
  const [fontFamily, setFontFamily] = useState(organization.fontFamily || "inter");
  const [fontSizeScale, setFontSizeScale] = useState(organization.fontSizeScale || "normal");
  const [enableSoundFX, setEnableSoundFX] = useState(organization.enableSoundFX ?? true);

  // Logo
  const [logoUrl, setLogoUrl] = useState<string | null>(organization.logoUrl || null);

  // Custom Font Settings
  const [customFontType, setCustomFontType] = useState(organization.customFontType || "preset");
  const [googleFontUrl, setGoogleFontUrl] = useState(organization.googleFontUrl || "");
  const [googleFontName, setGoogleFontName] = useState(organization.googleFontName || "");
  const [uploadedFontData, setUploadedFontData] = useState(organization.uploadedFontData || "");
  const [uploadedFontName, setUploadedFontName] = useState(organization.uploadedFontName || "");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fontFileInputRef = useRef<HTMLInputElement | null>(null);

  // Real-time Readability Calculations
  const darkContrast = calculateContrast(darkTextColor, darkBgColor);
  const lightContrast = calculateContrast(lightTextColor, lightBgColor);

  const handleApplyPreset = (preset: typeof colorPresets[0]) => {
    setThemeColor(preset.id);
    setDarkAccentColor(preset.darkPrimary);
    setDarkSecondaryAccent(preset.darkSecondary);
    setLightAccentColor(preset.lightPrimary);
    setLightSecondaryAccent(preset.lightSecondary);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Please upload an image smaller than 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFontFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload a font file smaller than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFontData(reader.result as string);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "");
      setUploadedFontName(cleanName);
      setCustomFontType("upload");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateOrganization({
        themeMode,
        darkBgColor,
        darkTextColor,
        darkCardColor,
        darkAccentColor,
        darkSecondaryAccent,
        lightBgColor,
        lightTextColor,
        lightCardColor,
        lightAccentColor,
        lightSecondaryAccent,
        themeColor,
        fontFamily,
        fontSizeScale,
        enableSoundFX,
        logoUrl,
        customFontType,
        googleFontUrl,
        googleFontName,
        uploadedFontData,
        uploadedFontName,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      alert("Failed to save theme settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Top Banner Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Theme, Custom Colors, Logo &amp; Typography Engine</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure custom Dark/Light color schemes, Google Fonts, and inspect live WCAG Readability Scores.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all duration-200"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Theme..." : "Save & Live Publish Theme"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Theme and typography updates applied across both client and admin portals!</span>
        </div>
      )}

      {/* 1. Theme Mode Switcher */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
          <Moon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Default Theme Mode (Dark, Light, System)</span>
        </h3>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            {[
              { id: "dark", label: "Dark Mode", icon: Moon },
              { id: "light", label: "Light Mode", icon: Sun },
              { id: "system", label: "System Sync", icon: Activity },
            ].map((m) => {
              const Icon = m.icon;
              const isSel = themeMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setThemeMode(m.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                    isSel
                      ? "bg-cyan-500 text-gray-950 border-cyan-400 shadow-glow-cyan/20"
                      : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-gray-400">
            Current live toggle: <ThemeSwitcher compact />
          </div>
        </div>
      </div>

      {/* 2. Brand Logo Upload */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
          <span>Brand Logo (Click Button Upload)</span>
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-cyber-900 border border-white/20 flex items-center justify-center overflow-hidden relative shadow-inner">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
            ) : (
              <div className="text-center p-2 text-gray-500">
                <ImageIcon className="w-8 h-8 mx-auto opacity-40 mb-1" />
                <span className="text-[10px]">Default SVG</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Logo (PNG / SVG / JPG)</span>
              </button>

              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl(null)}
                  className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-1.5 transition-colors border border-rose-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              Recommended: High-resolution transparent PNG or SVG logo (Max 3MB).
            </p>
          </div>
        </div>
      </div>

      {/* 3. Quick Color Presets */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Aesthetic Presets (One-Click Palettes)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {colorPresets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className={`p-3 rounded-xl border text-center transition-all ${
                themeColor === p.id
                  ? "border-cyan-400 bg-white/10 scale-105 shadow-md"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div
                className="w-7 h-7 rounded-full mx-auto mb-2 shadow-sm"
                style={{ background: p.darkPrimary }}
              />
              <div className="text-xs font-bold text-white truncate">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Custom Dark Mode Colors & Readability Score */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dark Mode Custom Colors &amp; Readability Score</span>
          </h3>

          {/* Dark Contrast Score Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${darkContrast.colorClass}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Contrast: {darkContrast.ratioFormatted}</span>
            <span>•</span>
            <span>{darkContrast.rating}</span>
          </div>
        </div>

        {/* Readability progress meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>WCAG 2.1 Contrast Score</span>
            <span className="font-mono font-bold text-white">{darkContrast.score}/100</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                darkContrast.wcagAAA
                  ? "bg-emerald-400 shadow-glow-cyan"
                  : darkContrast.wcagAA
                  ? "bg-cyan-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${darkContrast.score}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Dark Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={darkBgColor}
                onChange={(e) => setDarkBgColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={darkBgColor}
                onChange={(e) => setDarkBgColor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Dark Font / Text</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={darkTextColor}
                onChange={(e) => setDarkTextColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={darkTextColor}
                onChange={(e) => setDarkTextColor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Primary Accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={darkAccentColor}
                onChange={(e) => setDarkAccentColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={darkAccentColor}
                onChange={(e) => setDarkAccentColor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Secondary Accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={darkSecondaryAccent}
                onChange={(e) => setDarkSecondaryAccent(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={darkSecondaryAccent}
                onChange={(e) => setDarkSecondaryAccent(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Card / Surface</label>
            <input
              type="text"
              value={darkCardColor}
              onChange={(e) => setDarkCardColor(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Custom Light Mode Colors & Readability Score */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Light Mode Custom Colors &amp; Readability Score</span>
          </h3>

          {/* Light Contrast Score Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${lightContrast.colorClass}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Contrast: {lightContrast.ratioFormatted}</span>
            <span>•</span>
            <span>{lightContrast.rating}</span>
          </div>
        </div>

        {/* Readability progress meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>WCAG 2.1 Contrast Score</span>
            <span className="font-mono font-bold text-white">{lightContrast.score}/100</span>
          </div>
          <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                lightContrast.wcagAAA
                  ? "bg-emerald-400 shadow-glow-cyan"
                  : lightContrast.wcagAA
                  ? "bg-cyan-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${lightContrast.score}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Light Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lightBgColor}
                onChange={(e) => setLightBgColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={lightBgColor}
                onChange={(e) => setLightBgColor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Light Font / Text</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lightTextColor}
                onChange={(e) => setLightTextColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={lightTextColor}
                onChange={(e) => setLightTextColor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Primary Accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lightAccentColor}
                onChange={(e) => setLightAccentColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={lightAccentColor}
                onChange={(e) => setLightAccentColor(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Secondary Accent</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lightSecondaryAccent}
                onChange={(e) => setLightSecondaryAccent(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={lightSecondaryAccent}
                onChange={(e) => setLightSecondaryAccent(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-gray-300 block mb-1">Card / Surface</label>
            <input
              type="text"
              value={lightCardColor}
              onChange={(e) => setLightCardColor(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 6. Custom Typography (Presets, Google Fonts, or Upload Font File) */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
          <Type className="w-3.5 h-3.5 text-purple-400" />
          <span>Custom Typography &amp; Font Source</span>
        </h3>

        {/* Font Source Selector */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "preset", label: "Curated Presets" },
            { id: "google", label: "Google Font Link" },
            { id: "upload", label: "Upload Custom Font (.woff2 / .ttf)" },
          ].map((src) => (
            <button
              key={src.id}
              type="button"
              onClick={() => setCustomFontType(src.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                customFontType === src.id
                  ? "bg-purple-500 text-white border-purple-400 shadow-glow-purple/20"
                  : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>

        {/* 1. Presets */}
        {customFontType === "preset" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fontPresets.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFontFamily(f.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  fontFamily === f.id
                    ? "bg-purple-500/20 border-purple-400 text-white shadow-sm"
                    : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="font-bold text-sm text-white">{f.name}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* 2. Google Fonts */}
        {customFontType === "google" && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Google Font Embed URL
                </label>
                <input
                  type="url"
                  value={googleFontUrl}
                  onChange={(e) => setGoogleFontUrl(e.target.value)}
                  placeholder="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Font Family Name
                </label>
                <input
                  type="text"
                  value={googleFontName}
                  onChange={(e) => setGoogleFontName(e.target.value)}
                  placeholder="e.g. Poppins, Syne, Clash Display"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
            <p className="text-[11px] text-gray-400">
              Paste standard Google Fonts stylesheet URL from fonts.google.com.
            </p>
          </div>
        )}

        {/* 3. Upload Font */}
        {customFontType === "upload" && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in">
            <input
              ref={fontFileInputRef}
              type="file"
              accept=".woff2, .woff, .ttf, .otf"
              onChange={handleFontFileUpload}
              className="hidden"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fontFileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Font File (.woff2, .ttf, .otf)</span>
              </button>

              {uploadedFontName && (
                <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Loaded: {uploadedFontName}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 7. UI Density & Audio Interactions */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>UI Density &amp; Sound Interactions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">Font Size Scale</label>
            <div className="flex gap-2">
              {[
                { id: "compact", label: "Compact Density" },
                { id: "normal", label: "Standard / Balanced" },
                { id: "large", label: "Spacious / Large" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFontSizeScale(s.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    fontSizeScale === s.id
                      ? "bg-cyan-500 text-gray-950 border-cyan-400"
                      : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-2">Web Audio Synthesizer</label>
            <button
              type="button"
              onClick={() => setEnableSoundFX(!enableSoundFX)}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold border flex items-center justify-between transition-colors ${
                enableSoundFX
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-white/5 text-gray-400 border-white/10"
              }`}
            >
              <span>Cyber UI Sound Effects</span>
              <span>{enableSoundFX ? "🟢 Enabled" : "⚪ Disabled"}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
