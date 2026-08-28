"use client";

import {
  Award,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ExternalLink,
  Bot,
  Smartphone,
  Globe
} from "lucide-react";
import Link from "next/link";

const CASE_STORIES = [
  {
    client: "OmniAI Technologies",
    title: "Enterprise Multi-Agent LLM & Vector Retrieval Platform",
    category: "Autonomous AI Swarm",
    problem: "Their team was struggling with multi-second agent latency, hallucinated knowledge retrieval, and fragmented database queries.",
    whatChanged: "We engineered a LangGraph multi-agent swarm connected to high-throughput Pgvector caching, sub-100ms Next.js 15 analytics, and real-time guardrail validators.",
    outcome: "Sub-120ms agent response latency and $140,000/yr saved in redundant infrastructure overhead.",
    tags: ["Gemini 2.0 Flash", "LangGraph", "Next.js 15", "Pgvector"],
  },
  {
    client: "LogiTrans Global Logistics",
    title: "Automated WhatsApp Cloud Freight Quotation Pipeline",
    category: "WhatsApp API & Automation",
    problem: "Prospects across 4 time zones were waiting up to 6 hours for freight rate estimates, causing over 40% of warm leads to leak to competitors.",
    whatChanged: "We deployed official Meta WhatsApp Cloud API funnels with interactive rate calculators, automated driver dispatch, and CRM sync.",
    outcome: "100% of global inquiries answered within 45 seconds, lifting weekly quote completion by 4.2x.",
    tags: ["Meta WhatsApp API", "Node.js Microservice", "PostgreSQL", "Stripe"],
  },
  {
    client: "PayFlow Digital",
    title: "120 FPS Native Cross-Platform Mobile Payment Wallet",
    category: "Mobile Applications",
    problem: "An outdated hybrid mobile app was suffering from jittery 30 FPS scrolling, frequent checkout crashes, and poor user retention.",
    whatChanged: "We re-architected the entire mobile client in native Flutter, featuring biometric security, offline caching, and sub-100ms transaction APIs.",
    outcome: "4.9★ App Store rating, zero checkout drops, and seamless 120 FPS UI across iOS and Android.",
    tags: ["Flutter", "Dart", "Biometric SDK", "Edge APIs"],
  },
];

export default function Act09ProofStories() {
  return (
    <section id="proof-stories" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative bg-cyber-950">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Act 09: Verified Proof &amp; Transformations</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Mini stories of <span className="text-gradient-cyan">real transformations.</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Every business problem we took on was transformed from manual chaos into connected, high-speed digital machinery.
          </p>
        </div>

        {/* 3 Case Transformation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {CASE_STORIES.map((item, idx) => (
            <div
              key={idx}
              className="p-7 sm:p-8 rounded-3xl luxury-card border border-white/10 flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300 group h-full"
            >
              {/* Upper Content Section */}
              <div className="space-y-4">
                {/* Category Badge & Verified Badge */}
                <div className="flex items-center justify-between h-7">
                  <span className="px-3 py-1 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-cyan-300">
                    {item.category}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>

                {/* Client & Title Header */}
                <div className="space-y-1 min-h-[76px] flex flex-col justify-start">
                  <div className="text-xs font-mono text-gray-300 font-bold">{item.client}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                </div>

                {/* Problem Box */}
                <div className="space-y-1 min-h-[86px] flex flex-col justify-start">
                  <span className="font-bold text-rose-400 font-mono uppercase text-xs">
                    The Friction:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{item.problem}</p>
                </div>

                {/* Solution Box */}
                <div className="space-y-1 min-h-[104px] flex flex-col justify-start">
                  <span className="font-bold text-cyan-300 font-mono uppercase text-xs">
                    What Changed:
                  </span>
                  <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{item.whatChanged}</p>
                </div>
              </div>

              {/* Lower Outcome & Tech Section */}
              <div className="space-y-4 pt-5 mt-4 border-t border-white/10">
                {/* Outcome Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs min-h-[86px] flex flex-col justify-center">
                  <span className="font-bold text-emerald-300 font-mono uppercase text-xs block mb-0.5">
                    Verified Outcome:
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-emerald-100 leading-snug">{item.outcome}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 min-h-[58px] content-start items-start">
                  {item.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-white/10 text-xs font-mono text-gray-200 font-medium whitespace-nowrap"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Explore All Enterprise Case Studies &amp; Architecture Blueprints</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
