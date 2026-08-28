"use client";

import { Zap, Bot, MessageSquare, Sparkles, Smartphone, Code, Flame, Rocket, Cpu, TrendingUp } from "lucide-react";

export default function GenZMarquee() {
  const items = [
    { label: "10X DEV VELOCITY", icon: Zap, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { label: "AUTONOMOUS AI AGENTS", icon: Bot, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
    { label: "WHATSAPP CLOUD API AUTOMATION", icon: MessageSquare, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { label: "SUB-100MS NEXT.JS 15 RUNTIME", icon: Sparkles, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { label: "120HZ NATIVE & FLUTTER APPS", icon: Smartphone, color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
    { label: "CUSTOM DESKTOP & ERP ROBOTS", icon: Cpu, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
    { label: "4.2X ROAS GROWTH MARKETING", icon: TrendingUp, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { label: "FULL-SPECTRUM SOFTWARE HOUSE", icon: Rocket, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  ];

  return (
    <div className="py-6 bg-cyber-950/90 border-y border-white/10 overflow-hidden relative select-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-cyber-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-cyber-950 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee space-x-6">
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-black tracking-wider uppercase whitespace-nowrap shadow-sm ${item.color}`}
            >
              <Icon className="w-4 h-4 shrink-0 animate-pulse" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
