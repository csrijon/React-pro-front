"use client";

import { useState } from "react";
import {
  Sparkles,
  Zap,
  Globe,
  Bot,
  Database,
  Smartphone,
  CheckCircle2,
  Play,
  RotateCcw,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";

export default function Act04TurningPoint() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNode, setActiveNode] = useState<number>(0);

  const runSimulation = () => {
    soundFX.success();
    setIsPlaying(true);
    setActiveNode(1);

    setTimeout(() => setActiveNode(2), 600);
    setTimeout(() => setActiveNode(3), 1200);
    setTimeout(() => setActiveNode(4), 1800);
    setTimeout(() => {
      setActiveNode(5);
      setIsPlaying(false);
    }, 2400);
  };

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative bg-cyber-950/80 border-t border-b border-cyan-500/20 overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Act 04: The Turning Point</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
            What if all of this{" "}
            <span className="text-gradient-emerald">talked to each other?</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            When your website, AI agents, CRM, mobile apps, and automated workflows communicate as a unified organism, manual busywork disappears completely.
          </p>
        </div>

        {/* Interactive Autonomous Data Conduit Sandbox */}
        <div className="p-6 sm:p-10 rounded-3xl luxury-card border border-emerald-500/30 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Live Data Pipeline Simulation
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                The 1.8-Second Autonomous Flow
              </h3>
            </div>

            <button
              type="button"
              onClick={runSimulation}
              disabled={isPlaying}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-glow-emerald/25 transition-all self-start sm:self-auto disabled:opacity-50"
            >
              {isPlaying ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? "Simulating Autonomous Flow..." : "Trigger Live Inquiry Flow"}</span>
            </button>
          </div>

          {/* 4-Node Connected Pipeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Node 1: Fast Web Entry */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-500 ${
                activeNode >= 1
                  ? "bg-cyan-500/15 border-cyan-400 shadow-glow-cyan/20 translate-y-0"
                  : "bg-white/5 border-white/10 opacity-60"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono text-cyan-300 font-bold">Step 1 (0.2s)</div>
              <div className="font-bold text-white text-base mt-1">Sub-100ms Web Platform</div>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">Prospect submits intent on high-speed edge web interface.</p>
            </div>

            {/* Node 2: AI Agent Qualification */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-500 ${
                activeNode >= 2
                  ? "bg-purple-500/15 border-purple-400 shadow-glow-purple/20 translate-y-0"
                  : "bg-white/5 border-white/10 opacity-60"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold mb-3">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono text-purple-300 font-bold">Step 2 (0.6s)</div>
              <div className="font-bold text-white text-base mt-1">Gemini 2.0 AI Agent</div>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">Answers instant questions, scopes budget, and scores lead intent.</p>
            </div>

            {/* Node 3: Real-Time CRM & WhatsApp Sync */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-500 ${
                activeNode >= 3
                  ? "bg-emerald-500/15 border-emerald-400 shadow-glow-emerald/20 translate-y-0"
                  : "bg-white/5 border-white/10 opacity-60"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono text-emerald-300 font-bold">Step 3 (1.2s)</div>
              <div className="font-bold text-white text-base mt-1">Meta WhatsApp Cloud</div>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">Founder receives pre-formatted lead card with 1-tap call button.</p>
            </div>

            {/* Node 4: Live Client Sprint Portal */}
            <div
              className={`p-5 rounded-2xl border transition-all duration-500 ${
                activeNode >= 4
                  ? "bg-cyan-500/15 border-cyan-400 shadow-glow-cyan/20 translate-y-0"
                  : "bg-white/5 border-white/10 opacity-60"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono text-cyan-300 font-bold">Step 4 (1.8s)</div>
              <div className="font-bold text-white text-base mt-1">Instant Milestone Vault</div>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">Auto-provisions staging environment and digital sign-off tracker.</p>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-200 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero manual copy-pasting. Zero delayed follow-ups. Zero lost opportunities.</span>
            </div>
            <div className="font-mono text-cyan-300 font-bold shrink-0">
              Latency: 1.8s • 100% Automated
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
