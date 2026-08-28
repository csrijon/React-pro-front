"use client";

import { useState } from "react";
import {
  Globe,
  Sparkles,
  Save,
  CheckCircle2,
  Search,
  Laptop,
  Smartphone,
  Tag,
  FileText
} from "lucide-react";
import { OrganizationData, ServiceData, ProjectData, BlogPostData, FaqData } from "@/types";
import { updateOrganization } from "@/lib/actions";
import { autoGenerateSeo } from "@/lib/seoGenerator";

interface SeoManagerProps {
  organization: OrganizationData;
  services: ServiceData[];
  projects: ProjectData[];
  blogs: BlogPostData[];
  faqs: FaqData[];
}

export default function SeoManager({
  organization,
  services,
  projects,
  blogs,
  faqs,
}: SeoManagerProps) {
  const [seoTitle, setSeoTitle] = useState(
    organization.seoTitle || "HP Edit Enterprise | Next-Gen Software, AI Agents & Enterprise Systems"
  );
  const [seoDescription, setSeoDescription] = useState(
    organization.seoDescription ||
      "We architect superfast web apps, mobile apps, autonomous AI agents, enterprise automation systems, WhatsApp integrations, and growth engines."
  );
  const [seoKeywords, setSeoKeywords] = useState(
    organization.seoKeywords ||
      "HP Edit, software development, AI agents, Next.js 15, Flutter, WhatsApp API, enterprise automation"
  );

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAutoGenerate = () => {
    const generated = autoGenerateSeo({
      organization,
      services,
      projects,
      blogs,
      faqs,
    });

    setSeoTitle(generated.title);
    setSeoDescription(generated.description);
    setSeoKeywords(generated.keywords.join(", "));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateOrganization({
        seoTitle,
        seoDescription,
        seoKeywords,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      alert("Failed to save SEO settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Banner Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-emerald-500/30">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Search Engine Optimization (SEO &amp; OpenGraph)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Auto-generate Google meta tags, OpenGraph previews, and JSON-LD schema from live site content.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoGenerate}
            className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Auto-Generate from Content</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all duration-200"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save SEO"}</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>SEO settings updated and sitemap revalidated!</span>
        </div>
      )}

      {/* Google Search Result Simulation */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Search Result Live Simulation</span>
          </div>

          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                previewDevice === "desktop" ? "bg-emerald-500 text-gray-950 font-bold" : "text-gray-400"
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                previewDevice === "mobile" ? "bg-emerald-500 text-gray-950 font-bold" : "text-gray-400"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white text-left font-sans shadow-md">
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[9px] font-bold">
              H
            </div>
            <span className="font-medium text-gray-900">HP Edit Enterprise</span>
            <span className="text-gray-400 text-[10px]">https://www.hpedit.com</span>
          </div>

          <h3 className="text-blue-800 hover:underline text-lg font-medium mt-1 leading-snug cursor-pointer">
            {seoTitle || "HP Edit Enterprise | Next-Gen Software, AI Agents & Enterprise Systems"}
          </h3>

          <p className="text-gray-600 text-xs mt-1 leading-relaxed">
            {seoDescription || "We architect superfast web apps, mobile apps, autonomous AI agents, enterprise automation systems, and WhatsApp integrations."}
          </p>

          <div className="mt-3 pt-2 border-t border-gray-200 flex flex-wrap gap-2 text-[11px] text-blue-700">
            <span>• {services.length} Live Services</span>
            <span>• {projects.length} Case Studies</span>
            <span>• {blogs.length} Engineering Insights</span>
            <span>• {faqs.length} Answered FAQs</span>
          </div>
        </div>
      </div>

      {/* SEO Form Inputs */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-300">
              SEO Page Title Tag (Max 60 chars recommended)
            </label>
            <span
              className={`text-[11px] font-mono ${
                seoTitle.length > 65 ? "text-amber-400" : "text-gray-400"
              }`}
            >
              {seoTitle.length} chars
            </span>
          </div>
          <input
            type="text"
            required
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-300">
              Meta Description (150-160 chars recommended)
            </label>
            <span
              className={`text-[11px] font-mono ${
                seoDescription.length > 165 ? "text-amber-400" : "text-gray-400"
              }`}
            >
              {seoDescription.length} chars
            </span>
          </div>
          <textarea
            rows={3}
            required
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 leading-relaxed"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1">
            Target Keywords (Comma separated)
          </label>
          <input
            type="text"
            value={seoKeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            placeholder="AI agents, Next.js 15, WhatsApp API, software firm..."
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>
    </form>
  );
}
