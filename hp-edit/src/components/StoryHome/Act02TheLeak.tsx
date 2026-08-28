"use client";

import { useState } from "react";
import {
  TrendingDown,
  DollarSign,
  Clock,
  AlertCircle,
  ArrowRight,
  UserX,
  Zap,
  HelpCircle,
  Layers
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";

const LEAK_STEPS = [
  {
    step: 1,
    title: "1. Prospect Submits Inquiry",
    desc: "A warm buyer reaches out at 7:15 PM requesting a project quote.",
    status: "OK",
    color: "cyan",
  },
  {
    step: 2,
    title: "2. Form Sits in Employee Inbox",
    desc: "Email arrives after hours. Nobody is actively monitoring the queue.",
    status: "DELAY",
    color: "amber",
  },
  {
    step: 3,
    title: "3. Manual Copy to Spreadsheet",
    desc: "Next morning, an employee manually copies contact info into a sheet.",
    status: "SLOW",
    color: "amber",
  },
  {
    step: 4,
    title: "4. The Silent Drop",
    desc: "A high-priority emergency meeting delays the follow-up by 4 hours.",
    status: "LEAK",
    color: "rose",
  },
  {
    step: 5,
    title: "5. Lost to Competitor",
    desc: "The prospect already booked a call with a competitor whose AI replied in 60s.",
    status: "LOST",
    color: "rose",
  },
];

export default function Act02TheLeak() {
  const [activeStep, setActiveStep] = useState(4);
  const [weeklyMissedLeads, setWeeklyMissedLeads] = useState(3);
  const [avgDealValue, setAvgDealValue] = useState(4500);

  const annualLostRevenue = weeklyMissedLeads * avgDealValue * 52 * 0.35; // Assuming 35% close rate

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-cyber-950/60 border-t border-b border-white/5">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Act 02: The Silent Revenue Leak</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            The most expensive problems are{" "}
            <span className="text-rose-400">rarely the obvious ones.</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            One missed follow-up or delayed response doesn't feel disastrous on a Tuesday afternoon. Until you multiply it across an entire operating year.
          </p>
        </div>

        {/* Visual The Breakdown: Step-by-Step Anatomy of a Lost Deal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step-by-Step Flow Pipeline (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono mb-2">
              Anatomy of an Unautomated Inquiry
            </div>

            {LEAK_STEPS.map((item, idx) => {
              const isSelected = activeStep === idx;
              return (
                <div
                  key={item.step}
                  onClick={() => {
                    soundFX.click();
                    setActiveStep(idx);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? item.status === "LEAK" || item.status === "LOST"
                        ? "bg-rose-500/15 border-rose-500/50 shadow-glow-rose/10"
                        : "bg-white/10 border-cyan-400/40 shadow-glow-cyan/10"
                      : "bg-white/3 border-white/5 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{item.desc}</p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase shrink-0 ${
                        item.status === "OK"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : item.status === "DELAY" || item.status === "SLOW"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Dynamic Annual Lost Revenue Visualizer (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl luxury-card border border-rose-500/30 shadow-2xl space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                Annual Leak Calculator
              </span>
              <span className="text-xs text-gray-400 font-mono font-semibold">Silent Loss</span>
            </div>

            {/* Slider 1: Missed / Delayed Leads per Week */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300 font-mono">Leads delayed &gt; 15 mins / week:</span>
                <span className="text-rose-400 font-mono font-black">{weeklyMissedLeads} leads</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={weeklyMissedLeads}
                onChange={(e) => {
                  soundFX.click();
                  setWeeklyMissedLeads(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
            </div>

            {/* Slider 2: Average Deal / Contract Value */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300 font-mono">Average Deal Value:</span>
                <span className="text-cyan-400 font-mono font-black">${avgDealValue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={avgDealValue}
                onChange={(e) => {
                  soundFX.click();
                  setAvgDealValue(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Total Annual Lost Capital */}
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 space-y-1">
              <div className="text-xs font-bold text-gray-300 uppercase font-mono">
                Estimated Annual Lost Pipeline:
              </div>
              <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono tracking-tight">
                ${Math.round(annualLostRevenue).toLocaleString()}
              </div>
              <div className="text-xs text-gray-300 font-medium">
                Capital slipping through cracks due to response lag and manual routing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
