"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Bell,
  MessageSquare,
  FileSpreadsheet,
  Layers,
  ArrowDown,
  Sparkles,
  Zap,
  Clock,
  Inbox,
  Activity
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";

export default function Act01Interruption() {
  const [chaosLevel, setChaosLevel] = useState(1);

  // Auto-increase operational friction simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setChaosLevel((prev) => (prev < 4 ? prev + 1 : 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
      {/* Background Subtle Gradient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full text-center space-y-8 relative z-10">
        {/* Narrative Chapter Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider animate-in fade-in duration-500">
          <Activity className="w-3.5 h-3.5" />
          <span>Act 01: The Operational Reality</span>
        </div>

        {/* Cinematic Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Your business shouldn't need{" "}
            <span className="text-gradient-cyan">this much work.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-gray-300 font-medium leading-relaxed">
            Customers waiting for replies. Leads slipping through cracks. Teams manually copying data across disconnected tabs.
          </p>
        </div>

        {/* Central Metaphor: The Fragmented Digital Workspace */}
        <div className="relative max-w-3xl mx-auto mt-12 p-6 sm:p-10 rounded-3xl luxury-card border border-white/10 shadow-2xl overflow-hidden min-h-[340px] flex flex-col items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Central Business Core */}
          <div className="relative z-10 text-center space-y-2 p-6 rounded-2xl bg-cyber-900/90 border border-cyan-500/40 shadow-glow-cyan/20">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-gray-950 font-black text-xl">
              &gt;_
            </div>
            <div className="font-bold text-white text-base">Your Core Business Operations</div>
            <div className="text-xs font-mono text-cyan-200 font-semibold">
              Current Friction Level: <span className="font-bold text-amber-300">{chaosLevel * 25}% Manual Drag</span>
            </div>
          </div>

          {/* Floating Operational Friction Objects */}
          {/* 1. Unread Leads Bubble */}
          <div
            className={`absolute top-4 left-4 sm:left-12 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono transition-all duration-700 ${
              chaosLevel >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-90"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <Bell className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span>14 Unread Leads (3h waiting)</span>
            </div>
          </div>

          {/* 2. Manual Spreadsheet Sync */}
          <div
            className={`absolute bottom-4 left-4 sm:left-8 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono transition-all duration-700 ${
              chaosLevel >= 2 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              <span>Copying leads to spreadsheet...</span>
            </div>
          </div>

          {/* 3. Disconnected WhatsApp Inquiries */}
          <div
            className={`absolute top-6 right-4 sm:right-10 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all duration-700 ${
              chaosLevel >= 3 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-90"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp chats scattered across 3 phones</span>
            </div>
          </div>

          {/* 4. CRM Out of Sync Warning */}
          <div
            className={`absolute bottom-6 right-4 sm:right-12 p-3 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono transition-all duration-700 ${
              chaosLevel >= 4 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
              <span>CRM data out of sync with website</span>
            </div>
          </div>
        </div>

        {/* Scroll Prompt */}
        <div className="pt-8 flex flex-col items-center justify-center gap-2">
          <span className="text-xs font-mono text-gray-300 uppercase tracking-wider font-bold">
            Scroll to see what this friction costs you
          </span>
          <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
