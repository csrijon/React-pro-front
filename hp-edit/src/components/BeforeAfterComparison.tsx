"use client";

import { CheckCircle2, XCircle, Zap, ShieldCheck, Clock, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

const comparisons = [
  {
    category: "Sprint Velocity",
    traditional: "4 to 6 months of endless corporate meetings, slow wireframes, and delayed milestones.",
    hpedit: "2 to 3 weeks rapid production deployment with working staging releases every Friday.",
    advantage: "4x Faster Time-to-Market",
  },
  {
    category: "Architecture & Speed",
    traditional: "Heavy WordPress/PHP monoliths, 3.8s page load times, poor mobile UX, and high cloud bills.",
    hpedit: "Sub-80ms Next.js 15 Edge rendering, 120Hz Flutter mobile apps, and 100/100 Core Web Vitals.",
    advantage: "Sub-100ms SLA Guaranteed",
  },
  {
    category: "Frontier AI & Automations",
    traditional: "Generic iframe chatbots with zero database sync, high hallucinations, and no custom tools.",
    hpedit: "Autonomous Multi-Agent Swarms (Claude 3.7 & Gemini), Private Vector RAG, and Meta WhatsApp Cloud API.",
    advantage: "94% Manual Task Automation",
  },
  {
    category: "Intellectual Property & Code",
    traditional: "Proprietary vendor lock-in, recurring licensing fees, and restricted source code access.",
    hpedit: "100% Irrevocable Source Code Ownership, Git repository handover, and zero ongoing royalty fees.",
    advantage: "100% Code IP Transfer",
  },
];

export default function BeforeAfterComparison() {
  return (
    <section className="py-24 relative bg-cyber-900 border-t border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>The Enterprise Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Why Visionary Leaders <span className="text-gradient-cyan">Choose HP Edit</span>
          </h2>
          <p className="mt-4 text-gray-300 text-sm sm:text-base leading-relaxed">
            Compare our elite modern engineering standards against traditional slow-moving agencies.
          </p>
        </div>

        {/* Comparison Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2 -m-2">
          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="h-full p-8 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-6">
                <h3 className="text-base font-bold text-white">{item.category}</h3>
                <span className="text-xs font-bold text-cyan-400 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  {item.advantage}
                </span>
              </div>

              {/* Side by side comparison */}
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Traditional */}
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-start gap-3 min-h-[104px] sm:min-h-[96px] flex-1">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 flex flex-col justify-start">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block tracking-wider">
                      Traditional Agencies
                    </span>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">{item.traditional}</p>
                  </div>
                </div>

                {/* HP Edit */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 min-h-[104px] sm:min-h-[96px] flex-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 flex flex-col justify-start">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                      HP Edit Enterprise Execution
                    </span>
                    <p className="text-xs text-gray-100 font-medium mt-1 leading-relaxed">{item.hpedit}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl glass-panel border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-lg font-bold text-white">Ready for a High-Velocity Engineering Sprint?</h4>
            <p className="text-xs text-gray-400 mt-1">Get an instant scope and ballpark quotation in 60 seconds.</p>
          </div>

          <Link
            href="/estimator"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 shrink-0 transition-transform hover:scale-105"
          >
            <span>Launch Interactive Scope Estimator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
