"use client";

import {
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const OUTCOMES = [
  {
    headline: "Respond in seconds, not hours.",
    metric: "<60s",
    metricLabel: "Automated Lead Response",
    description: "Capture buyer intent at the exact moment of peak interest with 24/7 conversational AI qualification.",
    color: "cyan",
  },
  {
    headline: "Convert attention into revenue.",
    metric: "3.5x",
    metricLabel: "Conversion Multiplier",
    description: "Sub-100ms edge web platforms with interactive pricing estimators that remove sales friction.",
    color: "emerald",
  },
  {
    headline: "Automate the robotic tasks.",
    metric: "15+ hrs",
    metricLabel: "Reclaimed per Employee/Wk",
    description: "Eliminate manual spreadsheet copy-pasting, invoice drafting, and status sync across tools forever.",
    color: "purple",
  },
  {
    headline: "Scale without multiplying complexity.",
    metric: "10x",
    metricLabel: "Operational Throughput",
    description: "Unified cloud, mobile, and agent architectures that let your existing team handle massive transaction volume.",
    color: "amber",
  },
];

export default function Act07Outcomes() {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative bg-cyber-950">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Act 07: Real Business Outcomes</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            We don't sell deliverables.{" "}
            <span className="text-gradient-cyan">We sell business outcomes.</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Every line of code, automated pipeline, and AI agent we build serves one singular goal: increasing your velocity and bottom-line revenue.
          </p>
        </div>

        {/* 4-Bento Outcome Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {OUTCOMES.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl luxury-card border border-white/10 space-y-6 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
                    Target Metric 0{idx + 1}
                  </span>
                  <Sparkles className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {item.headline}
                </h3>

                <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">
                    {item.metric}
                  </div>
                  <div className="text-xs font-mono text-gray-300 mt-1 font-semibold">
                    {item.metricLabel}
                  </div>
                </div>

                <Link
                  href="/roi"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/15 text-gray-200 hover:text-cyan-300 border border-white/10 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <span>See ROI Math</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
