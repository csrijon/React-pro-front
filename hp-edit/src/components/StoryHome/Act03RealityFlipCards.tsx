"use client";

import { useState } from "react";
import {
  HelpCircle,
  RotateCw,
  Sparkles,
  Layers,
  ArrowRight,
  Zap,
  Globe,
  Database,
  Cpu,
  Bot
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";

interface FlipCardData {
  id: string;
  category: string;
  frontTitle: string;
  frontSubtitle: string;
  frontMetric: string;
  backTitle: string;
  backDiagnosis: string;
  backSolution: string;
  accentColor: string;
}

const CARDS: FlipCardData[] = [
  {
    id: "card-1",
    category: "Manual Friction",
    frontTitle: "Your team is doing work software should be doing.",
    frontSubtitle: "Copying contact info, manually generating PDF invoices, and retyping form entries.",
    frontMetric: "3.5 hrs/day wasted",
    backTitle: "Diagnosis: Mechanical Overhead",
    backDiagnosis: "Highly paid engineers and operators spending 30% of their workday acting as human API bridges between disconnected platforms.",
    backSolution: "Solution: Autonomous Business Process Automation & Background Event Pipelines.",
    accentColor: "cyan",
  },
  {
    id: "card-2",
    category: "Conversion Leak",
    frontTitle: "Your website gets visitors. Not enough customers.",
    frontSubtitle: "Traffic arrives from search and campaigns, but 96% bounce without taking action.",
    frontMetric: "Sub-2% Conversion",
    backTitle: "Diagnosis: Passive Digital Presence",
    backDiagnosis: "Static websites that take 3+ seconds to load, fail to answer prospect questions immediately, and bury the value proposition in corporate jargon.",
    backSolution: "Solution: Sub-100ms Edge Web Platforms & Conversational AI Discovery Funnels.",
    accentColor: "purple",
  },
  {
    id: "card-3",
    category: "Siloed Systems",
    frontTitle: "Your tools work. They just don't work together.",
    frontSubtitle: "WhatsApp, Stripe, CRM, spreadsheets, and emails operating on completely isolated islands.",
    frontMetric: "5+ Disconnected Silos",
    backTitle: "Diagnosis: Fragmented Architecture",
    backDiagnosis: "When sales closes a deal on WhatsApp, finance doesn't see it, delivery doesn't get notified, and customer data remains fragmented across 4 logins.",
    backSolution: "Solution: Centralized Custom ERP Web App & Unified API Synchronization.",
    accentColor: "emerald",
  },
];

export default function Act03RealityFlipCards() {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    soundFX.click();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative bg-cyber-950 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-purple-500/30 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Act 03: The Business Owner's Reality</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Does any of this <span className="text-gradient-purple">look familiar?</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Click or tap each perspective card to flip and inspect the underlying architectural diagnosis.
          </p>
        </div>

        {/* 3D Perspective Card Split Matrix (Inspired by CodeGrid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 [perspective:1200px]">
          {CARDS.map((card) => {
            const isFlipped = !!flippedCards[card.id];

            return (
              <div
                key={card.id}
                onClick={() => toggleFlip(card.id)}
                className="group relative h-[430px] w-full cursor-pointer transition-all duration-300 hover:-translate-y-2 select-none"
              >
                <div
                  className={`relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] shadow-2xl ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* FRONT FACE */}
                  <div className="absolute inset-0 h-full w-full rounded-3xl luxury-card border border-white/10 p-8 flex flex-col justify-between [backface-visibility:hidden]">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-cyan-300">
                          {card.category}
                        </span>
                        <RotateCw className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {card.frontTitle}
                      </h3>

                      <p className="text-sm text-gray-300 leading-relaxed">
                        {card.frontSubtitle}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                      <div className="text-sm font-mono font-bold text-rose-400">
                        {card.frontMetric}
                      </div>
                      <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                        <span>Flip to Diagnose</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className="absolute inset-0 h-full w-full rounded-3xl bg-cyber-900 border border-cyan-500/40 p-8 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-glow-cyan/15">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          System Diagnosis
                        </span>
                        <RotateCw className="w-4 h-4 text-cyan-400" />
                      </div>

                      <h4 className="text-lg font-black text-white">{card.backTitle}</h4>

                      <p className="text-sm text-gray-200 leading-relaxed">
                        {card.backDiagnosis}
                      </p>

                      <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-semibold leading-relaxed">
                        {card.backSolution}
                      </div>
                    </div>

                    <div className="text-xs font-mono text-gray-300 text-center font-bold">
                      Tap to flip back
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
