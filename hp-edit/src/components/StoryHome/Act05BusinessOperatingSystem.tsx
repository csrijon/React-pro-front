"use client";

import { useState } from "react";
import {
  Layers,
  Sparkles,
  Zap,
  Globe,
  Bot,
  Database,
  Smartphone,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Server
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";
import Link from "next/link";

interface OsPillar {
  id: string;
  name: string;
  badge: string;
  headline: string;
  description: string;
  businessOutcome: string;
  techArsenal: string[];
  linkHref: string;
  accentColor: string;
}

const PILLARS: OsPillar[] = [
  {
    id: "attract",
    name: "1. ATTRACT",
    badge: "Inbound Engine",
    headline: "Fill your pipeline with high-intent buyers.",
    description: "Programmatic SEO architectures, technical content systems, and high-conversion acquisition funnels that drive sustainable organic traffic.",
    businessOutcome: "Consistent flow of qualified enterprise inbound prospects without relying solely on ad spend.",
    techArsenal: ["Dynamic Programmatic SEO", "Core Web Vitals 100/100", "Structured Rich Snippets", "Meta Pixel Tracking"],
    linkHref: "/services/web-development",
    accentColor: "cyan",
  },
  {
    id: "convert",
    name: "2. CONVERT",
    badge: "Persuasive Web",
    headline: "Turn your website into your best salesperson.",
    description: "Sub-100ms server-rendered digital experiences designed with psychological conversion sequencing that turn cold visitors into booked appointments.",
    businessOutcome: "Lift conversion rates from 1.5% to 5%+ with instant interactive estimators and discovery funnels.",
    techArsenal: ["Next.js 15 Edge SSR", "React 19 Server Actions", "Tailwind 4 & Framer Motion", "Ballpark Cost Calculators"],
    linkHref: "/services/web-development",
    accentColor: "blue",
  },
  {
    id: "sell",
    name: "3. SELL",
    badge: "Sales Funnels",
    headline: "Respond in 60 seconds, not 6 hours.",
    description: "Official Meta WhatsApp Cloud API funnels and automated qualification engines that instantly capture, score, and route high-value leads directly to your phone.",
    businessOutcome: "Close deals 3.5x faster by responding while the buyer's purchase intent is at its absolute peak.",
    techArsenal: ["Meta Cloud API", "Interactive WhatsApp Quick Replies", "Automated Lead Scoring", "CRM Webhook Sync"],
    linkHref: "/services/whatsapp-integration",
    accentColor: "emerald",
  },
  {
    id: "serve",
    name: "4. SERVE",
    badge: "24/7 AI Agents",
    headline: "Never leave a customer waiting.",
    description: "Autonomous Gemini 2.0 & Claude 3.7 AI agents equipped with company vector knowledge bases that handle customer inquiries, onboardings, and support around the clock.",
    businessOutcome: "Resolve 75% of customer questions instantly with zero human support bottleneck.",
    techArsenal: ["Gemini 2.0 Flash", "LangGraph Agent Swarms", "Pgvector RAG Cache", "Web Speech Voice Synthesis"],
    linkHref: "/ai-lab",
    accentColor: "purple",
  },
  {
    id: "operate",
    name: "5. OPERATE",
    badge: "Workflow Automation",
    headline: "Give repetitive robotic work to machines.",
    description: "Custom internal web applications, ERP dashboards, and background robotic process pipelines that eliminate manual spreadsheet copy-pasting forever.",
    businessOutcome: "Reclaim 15+ hours per employee every week for high-value strategic growth.",
    techArsenal: ["Custom React Dashboards", "PostgreSQL & Prisma ORM", "Stripe & Invoicing Webhooks", "Zero-Trust RBAC"],
    linkHref: "/services/automation-tools",
    accentColor: "amber",
  },
  {
    id: "scale",
    name: "6. SCALE",
    badge: "Cloud & Mobile",
    headline: "Scale 10x without multiplying complexity.",
    description: "120 FPS native iOS & Android Flutter applications, multi-tenant SaaS platforms, and dedicated sprint engineering pods.",
    businessOutcome: "Rapidly expand your product reach to mobile app stores with 100% full source code ownership.",
    techArsenal: ["Flutter Cross-Platform", "Docker & Kubernetes", "Multi-Region Edge Caching", "SOC2 Compliance Ready"],
    linkHref: "/services/mobile-apps",
    accentColor: "rose",
  },
];

export default function Act05BusinessOperatingSystem() {
  const [selectedPillar, setSelectedPillar] = useState<OsPillar>(PILLARS[0]);

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative bg-cyber-950">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Act 05: The Digital Machinery</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            We build the digital machinery behind{" "}
            <span className="text-gradient-cyan">growing businesses.</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Not isolated deliverables, but a unified business operating system designed to attract, convert, sell, serve, operate, and scale.
          </p>
        </div>

        {/* 6-Pillar Interactive Operating System Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 6 Pillar Selector Tabs (5 cols) */}
          <div className="lg:col-span-5 space-y-2.5">
            {PILLARS.map((pillar) => {
              const isSelected = selectedPillar.id === pillar.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setSelectedPillar(pillar);
                  }}
                  className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-400 text-white shadow-glow-cyan/20 scale-[1.02]"
                      : "bg-white/3 border-white/5 text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono font-black text-cyan-300 flex items-center gap-2">
                      <span>{pillar.name}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 border border-white/15 text-gray-200">
                        {pillar.badge}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white truncate max-w-xs sm:max-w-sm">
                      {pillar.headline}
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-cyan-400 translate-x-1" : "text-gray-400 group-hover:text-gray-200"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Pillar Inspector & Business Outcome Engine (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl luxury-card border border-cyan-500/30 shadow-2xl space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider">
                {selectedPillar.badge} Architecture
              </span>
              <span className="text-xs font-mono text-gray-300 font-bold">
                Pillar {selectedPillar.name.split(".")[0]} of 6
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {selectedPillar.headline}
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                {selectedPillar.description}
              </p>
            </div>

            {/* Tangible Business Outcome Box */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
              <div className="text-xs font-bold text-emerald-300 uppercase font-mono flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Tangible Business Outcome:</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-100 leading-relaxed">
                {selectedPillar.businessOutcome}
              </p>
            </div>

            {/* Technical Capabilities Arsenal */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                Core Engineering Capabilities:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedPillar.techArsenal.map((tech, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2 text-gray-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="font-mono text-xs">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/estimator"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all"
              >
                <span>Calculate Scope for {selectedPillar.badge}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={selectedPillar.linkHref}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
