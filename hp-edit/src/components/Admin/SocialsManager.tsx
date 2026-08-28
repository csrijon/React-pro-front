"use client";

import { useState } from "react";
import { OrganizationData, SocialLinkItem } from "@/types";
import { Share2, Plus, Trash2, Save, CheckCircle2, Globe, ExternalLink } from "lucide-react";
import { updateOrganization } from "@/lib/actions";

interface SocialsManagerProps {
  organization: OrganizationData;
}

const availablePlatforms = [
  { name: "LinkedIn", icon: "Linkedin" },
  { name: "GitHub", icon: "Github" },
  { name: "Twitter / X", icon: "Twitter" },
  { name: "Instagram", icon: "Instagram" },
  { name: "YouTube", icon: "Youtube" },
  { name: "Discord", icon: "Discord" },
  { name: "Telegram", icon: "Telegram" },
  { name: "Facebook", icon: "Facebook" },
  { name: "TikTok", icon: "TikTok" },
  { name: "Threads", icon: "Threads" },
  { name: "Reddit", icon: "Reddit" },
  { name: "WhatsApp Channel", icon: "WhatsApp" },
];

export default function SocialsManager({ organization }: SocialsManagerProps) {
  const [socials, setSocials] = useState<SocialLinkItem[]>(() => {
    try {
      const parsed = JSON.parse(organization.customSocials || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // Fallback
    }
    return [
      { platform: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com/company/hp-edit-enterprise", active: true },
      { platform: "GitHub", icon: "Github", url: "https://github.com/hp-edit", active: true },
      { platform: "Twitter / X", icon: "Twitter", url: "https://x.com/hpedit_tech", active: true },
      { platform: "Instagram", icon: "Instagram", url: "https://instagram.com/hpedit_enterprise", active: true },
      { platform: "YouTube", icon: "Youtube", url: "https://youtube.com/@hpedit", active: true },
    ];
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddSocial = () => {
    setSocials((prev) => [
      ...prev,
      { platform: "Discord", icon: "Discord", url: "https://discord.gg/", active: true },
    ]);
  };

  const handleRemoveSocial = (idx: number) => {
    setSocials((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdate = (idx: number, field: keyof SocialLinkItem, val: unknown) => {
    setSocials((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateOrganization({
        customSocials: JSON.stringify(socials),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      alert("Failed to save social media channels.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Social Media Channels &amp; Custom Icons</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Choose which social profiles appear on your header, contact section, and footer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddSocial}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Add Channel</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Social Links"}</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Social media channels saved successfully!</span>
        </div>
      )}

      {/* Socials List */}
      <div className="space-y-3">
        {socials.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl glass-panel border border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
          >
            {/* Select Platform */}
            <div className="sm:col-span-4">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                Platform &amp; Icon
              </label>
              <select
                value={item.platform}
                onChange={(e) => {
                  const match = availablePlatforms.find((p) => p.name === e.target.value);
                  handleUpdate(idx, "platform", e.target.value);
                  if (match) handleUpdate(idx, "icon", match.icon);
                }}
                className="w-full px-3 py-2 rounded-lg bg-cyber-900 border border-white/10 text-white text-xs focus:outline-none"
              >
                {availablePlatforms.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* URL Input */}
            <div className="sm:col-span-6">
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                Profile / Channel URL
              </label>
              <input
                type="url"
                required
                value={item.url}
                onChange={(e) => handleUpdate(idx, "url", e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none font-mono"
              />
            </div>

            {/* Active Toggle & Delete */}
            <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2 sm:pt-4">
              <label className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={(e) => handleUpdate(idx, "active", e.target.checked)}
                  className="rounded border-white/20 text-cyan-500 focus:ring-0"
                />
                <span>Active</span>
              </label>

              <button
                type="button"
                onClick={() => handleRemoveSocial(idx)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
