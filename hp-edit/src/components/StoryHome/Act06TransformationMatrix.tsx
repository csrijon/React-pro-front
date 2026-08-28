"use client";

import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  TrendingUp,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";

export default function Act06TransformationMatrix() {
  const [activeTab, setActiveTab] = useState<"after" | "before">("after");

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative bg-cyber-950/80 border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Act 06: Before vs. After Transformation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Same business.{" "}
            <span className="text-gradient-emerald">Better system.</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            You don't need to reinvent your product or hire dozens of employees. You just need your digital infrastructure to communicate seamlessly.
          </p>

          {/* Interactive State Toggle */}
          <div className="inline-flex p-1 rounded-2xl bg-white/5 border border-white/10 mt-4">
            <button
              type="button"
              onClick={() => {
                soundFX.click();
                setActiveTab("before");
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "before"
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Traditional Manual Flow (Before)
            </button>
            <button
              type="button"
              onClick={() => {
                soundFX.click();
                setActiveTab("after");
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "after"
                  ? "bg-emerald-500 text-gray-950 font-black shadow-lg shadow-emerald-500/25"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Connected Autonomous Flow (After)
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* 1. BEFORE CARD */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between space-y-6 ${
              activeTab === "before"
                ? "bg-rose-950/20 border-rose-500/40 shadow-glow-rose/15 scale-[1.02]"
                : "bg-white/3 border-white/5 opacity-50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  Before: Disconnected Operations
                </span>
                <span className="text-xs font-mono text-rose-400 font-bold">4.5 Hours Response Lag</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                {[
                  { step: "1", text: "Customer submits form after business hours", bad: true },
                  { step: "2", text: "Email sits unread until 10:30 AM next morning", bad: true },
                  { step: "3", text: "Employee manually copies name & email into spreadsheet", bad: true },
                  { step: "4", text: "Calendar clash causes delayed follow-up meeting", bad: true },
                  { step: "5", text: "Customer signs with faster competitor", bad: true },
                ].map((s) => (
                  <div key={s.step} className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-center gap-3">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-gray-200 font-medium">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm font-mono font-bold">
              Outcome: High employee stress, low close rates, lost revenue.
            </div>
          </div>

          {/* 2. AFTER CARD */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-500 flex flex-col justify-between space-y-6 ${
              activeTab === "after"
                ? "bg-emerald-950/20 border-emerald-500/40 shadow-glow-emerald/20 scale-[1.02]"
                : "bg-white/3 border-white/5 opacity-50"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  After: HP Edit Unified Ecosystem
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">&lt;60 Seconds Cycle Time</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                {[
                  { step: "1", text: "Customer submits query on sub-100ms web app", good: true },
                  { step: "2", text: "Gemini 2.0 AI agent instantly answers & qualifies budget", good: true },
                  { step: "3", text: "CRM auto-syncs contact & logs lead intent score", good: true },
                  { step: "4", text: "Founder receives instant WhatsApp alert with 1-tap call", good: true },
                  { step: "5", text: "Milestone portal auto-provisions project staging", good: true },
                ].map((s) => (
                  <div key={s.step} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-emerald-100 font-medium">{s.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-mono font-bold">
              Outcome: 3.5x higher conversion, zero manual data entry, 100% automated.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
