"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import {
  Activity,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import { soundFX } from "@/components/CyberAudioFx";

export default function TrackProjectPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [projectData, setProjectData] = useState<{
    id: string;
    client: string;
    service: string;
    status: string;
    progress: number;
    stagingUrl?: string;
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.click();
    if (!query.trim()) return;

    // Simulated status lookup
    setSearched(true);
    setProjectData({
      id: query.trim().toUpperCase(),
      client: "Enterprise Partner",
      service: "Next.js 15 Platform + Autonomous AI Agents",
      status: "CORE ENGINEERING & AI PIPELINE (PHASE 2)",
      progress: 65,
      stagingUrl: "https://staging.hpedit.com/demo-preview",
    });
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar organization={null} />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time Client Milestone Radar</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Project Status &amp; <span className="text-gradient-cyan">Sprint Tracker</span>
            </h1>
            <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
              Enter your Proposal Reference ID, Inquiry Code, or Organization Email to track live engineering milestones and staging builds.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2 p-2 rounded-2xl glass-panel border border-cyan-500/30">
            <input
              type="text"
              required
              placeholder="e.g. HPE-849201 or client@domain.com"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-transparent text-white text-xs font-mono focus:outline-none placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track Sprint</span>
            </button>
          </form>

          {/* Active Tracker Card */}
          {searched && projectData && (
            <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-cyan-500/40 shadow-2xl space-y-8 animate-in zoom-in-95">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400">
                    Project Reference: #{projectData.id}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {projectData.service}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {projectData.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Sprint Velocity Progress</span>
                  <span className="font-mono font-bold text-cyan-400">{projectData.progress}% Complete</span>
                </div>
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full shadow-glow-cyan transition-all duration-500"
                    style={{ width: `${projectData.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/30 space-y-1">
                  <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Discovery</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Architecture Blueprint Signed</div>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/40 space-y-1 animate-pulse">
                  <div className="text-purple-400 font-bold text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Engineering</span>
                  </div>
                  <div className="text-[11px] text-gray-300">Next.js &amp; AI Agents Active</div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1 opacity-60">
                  <div className="text-gray-400 font-bold text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Staging &amp; QA</span>
                  </div>
                  <div className="text-[11px] text-gray-500">Security Load Testing</div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1 opacity-60">
                  <div className="text-gray-400 font-bold text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Handover</span>
                  </div>
                  <div className="text-[11px] text-gray-500">100% Code IP Ownership</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <a
                  href="https://wa.me/919876543210?text=Hello%20HP%20Edit%20Architect!%20Inquiring%20on%20Project%20Status."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Lead Architect on WhatsApp</span>
                </a>

                <Link
                  href="/estimator"
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Need adjustments? Update Scope ➔
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer organization={null} />
      <FuturisticChatbot organization={null} />
    </div>
  );
}
