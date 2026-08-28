"use client";

import { useState } from "react";
import { OrganizationData, AboutStatItem } from "@/types";
import { Compass, Plus, Trash2, Save, CheckCircle2, TrendingUp } from "lucide-react";
import { updateOrganization } from "@/lib/actions";

interface AboutUsManagerProps {
  organization: OrganizationData;
}

export default function AboutUsManager({ organization }: AboutUsManagerProps) {
  const [aboutHeading, setAboutHeading] = useState(
    organization.aboutHeading || "Forging Digital Supremacy for Modern Enterprises"
  );
  const [aboutStory, setAboutStory] = useState(
    organization.aboutStory ||
      "Founded with a mission to bridge high-level computer science, frontier artificial intelligence, and pragmatic business engineering, HP Edit Enterprise has engineered mission-critical software for global logistics, hyper-scale retail brands, and venture-backed tech startups."
  );
  const [aboutMission, setAboutMission] = useState(
    organization.aboutMission ||
      "To empower visionary organizations with autonomous AI agents, frictionless workflows, and sub-100ms software architectures that scale effortlessly."
  );

  const [stats, setStats] = useState<AboutStatItem[]>(() => {
    try {
      const parsed = JSON.parse(organization.aboutStats || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // Fallback
    }
    return [
      { label: "Production Systems Deployed", value: "120+" },
      { label: "Average Performance Boost", value: "340%" },
      { label: "Enterprise API Uptime", value: "99.99%" },
      { label: "Happy Global Clients", value: "50+" },
    ];
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddStat = () => {
    setStats((prev) => [...prev, { label: "New Metric", value: "100%" }]);
  };

  const handleRemoveStat = (idx: number) => {
    setStats((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateStat = (idx: number, field: keyof AboutStatItem, val: string) => {
    setStats((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateOrganization({
        aboutHeading,
        aboutStory,
        aboutMission,
        aboutStats: JSON.stringify(stats),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      alert("Failed to save About Us information.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>About Us &amp; Company Narrative Management</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your founding narrative, core mission, and verifiable impact metrics.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all duration-200"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving..." : "Save About Us"}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>About Us narrative updated successfully!</span>
        </div>
      )}

      {/* Narrative Fields */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Section Heading
          </label>
          <input
            type="text"
            value={aboutHeading}
            onChange={(e) => setAboutHeading(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Founding Story &amp; Company Background
          </label>
          <textarea
            rows={4}
            value={aboutStory}
            onChange={(e) => setAboutStory(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Mission Statement
          </label>
          <textarea
            rows={3}
            value={aboutMission}
            onChange={(e) => setAboutMission(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
          />
        </div>
      </div>

      {/* Impact Metric Stats */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Impact Metrics Grid</span>
          </h3>
          <button
            type="button"
            onClick={handleAddStat}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 text-xs font-semibold flex items-center gap-1 border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stat Metric</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((st, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl glass-panel border border-white/5 flex items-center gap-3"
            >
              <div className="w-1/3">
                <label className="text-[10px] text-gray-400 block mb-1">Value (e.g. 120+)</label>
                <input
                  type="text"
                  value={st.value}
                  onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold font-mono focus:outline-none"
                />
              </div>

              <div className="flex-1">
                <label className="text-[10px] text-gray-400 block mb-1">Metric Description</label>
                <input
                  type="text"
                  value={st.label}
                  onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveStat(idx)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors mt-4"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
