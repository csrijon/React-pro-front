"use client";

import { useState } from "react";
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  Layers,
  Bot,
  Globe,
  Smartphone,
  Database
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";
import Link from "next/link";

interface BottleneckOption {
  id: string;
  label: string;
  iconName: string;
  recommendedArchitecture: string;
  timeToDeploy: string;
  expectedOutcome: string;
  deliverables: string[];
}

const BOTTLENECKS: BottleneckOption[] = [
  {
    id: "leads",
    label: "We're losing leads before our team can respond",
    iconName: "Zap",
    recommendedArchitecture: "Meta WhatsApp Cloud API + Instant Gemini 2.0 Lead Qualification",
    timeToDeploy: "2 Weeks",
    expectedOutcome: "Immediate 60-second response to 100% of incoming leads with automated calendar scheduling.",
    deliverables: [
      "Official Meta WhatsApp Cloud API integration",
      "Interactive conversational qualification flows",
      "Real-time CRM & Google Sheets sync",
      "Founder WhatsApp push notification cards"
    ],
  },
  {
    id: "manual",
    label: "Too much daily work is manual and repetitive",
    iconName: "Layers",
    recommendedArchitecture: "Custom Workflow Automation Engine & Background Data Pipelines",
    timeToDeploy: "2-3 Weeks",
    expectedOutcome: "Eliminate 15+ hours/week per employee of mechanical data entry and PDF generation.",
    deliverables: [
      "Automated document & invoice generation",
      "Cross-platform Webhook orchestrators",
      "Stripe payment to CRM status sync",
      "Automated team task dispatchers"
    ],
  },
  {
    id: "conversion",
    label: "Our website gets visitors but not enough customers",
    iconName: "Globe",
    recommendedArchitecture: "Sub-100ms Edge Web Platform & Persuasive Conversion Funnel",
    timeToDeploy: "3-4 Weeks",
    expectedOutcome: "Lift visitor-to-inquiry conversion rate by 2.5x to 4x with psychological conversion sequencing.",
    deliverables: [
      "Next.js 15 Server Components & Edge Caching",
      "Interactive scope & ballpark pricing estimators",
      "Core Web Vitals 100/100 performance audit",
      "Lead magnet & discovery call funnels"
    ],
  },
  {
    id: "disconnected",
    label: "Our software tools operate on isolated islands",
    iconName: "Database",
    recommendedArchitecture: "Unified Internal Web App & Centralized API Connector",
    timeToDeploy: "3-5 Weeks",
    expectedOutcome: "Single source of truth dashboard for sales, operations, and financial reporting.",
    deliverables: [
      "Custom React & Tailwind dashboard portal",
      "Bi-directional API synchronizers",
      "Role-based access control (RBAC)",
      "Automated daily executive Slack/email summaries"
    ],
  },
  {
    id: "ai_swarm",
    label: "We need autonomous AI agents to scale operations",
    iconName: "Bot",
    recommendedArchitecture: "LangGraph Multi-Agent Swarm with Vector Knowledge Base",
    timeToDeploy: "3-4 Weeks",
    expectedOutcome: "Autonomous customer support and lead research agents operating 24/7 with zero human latency.",
    deliverables: [
      "Gemini 2.0 Flash / Claude 3.7 LangGraph pipeline",
      "Pgvector RAG semantic document search",
      "Web speech voice interaction companion",
      "Admin telemetry and conversation inspection vault"
    ],
  },
  {
    id: "mobile_saas",
    label: "We have an idea we need to build into a product",
    iconName: "Smartphone",
    recommendedArchitecture: "120 FPS Native Flutter Mobile App & Full-Stack Next.js SaaS",
    timeToDeploy: "4-6 Weeks Sprint",
    expectedOutcome: "Production-ready, app-store approved MVP with 100% full source code ownership.",
    deliverables: [
      "Cross-platform Flutter iOS & Android build",
      "Next.js 15 multi-tenant SaaS backend",
      "Stripe billing & subscription portal",
      "App Store & Google Play deployment support"
    ],
  },
];

export default function Act08BottleneckDiagnostic() {
  const [selectedBottleneck, setSelectedBottleneck] = useState<BottleneckOption>(BOTTLENECKS[0]);

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative bg-cyber-950/70 border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Narrative Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-purple-500/30 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Act 08: Interactive Self-Selection</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            What is slowing your{" "}
            <span className="text-gradient-purple">business down?</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Select your primary operational friction to inspect the exact custom architecture blueprint we build to resolve it.
          </p>
        </div>

        {/* Diagnostic Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 6 Bottleneck Choice Buttons (6 cols) */}
          <div className="lg:col-span-6 space-y-3">
            {BOTTLENECKS.map((item) => {
              const isSelected = selectedBottleneck.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setSelectedBottleneck(item);
                  }}
                  className={`w-full p-4 sm:p-5 rounded-2xl text-left border transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-purple-500/15 border-purple-400 text-white shadow-glow-purple/20 scale-[1.02]"
                      : "bg-white/3 border-white/5 text-gray-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        isSelected ? "bg-purple-400 animate-pulse" : "bg-white/30"
                      }`}
                    />
                    <span className="text-sm sm:text-base font-bold text-white">{item.label}</span>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-purple-400 translate-x-1" : "text-gray-400 group-hover:text-gray-200"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Tailored Architecture Blueprint Box (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl luxury-card border border-purple-500/30 shadow-2xl space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                Recommended Solution Blueprint
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                Deploy in {selectedBottleneck.timeToDeploy}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {selectedBottleneck.recommendedArchitecture}
              </h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                {selectedBottleneck.expectedOutcome}
              </p>
            </div>

            {/* Core Deliverable Checklist */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                Sprint Deliverables Included:
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                {selectedBottleneck.deliverables.map((del, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2.5 text-gray-100 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/book"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-gray-950 font-black text-xs sm:text-sm shadow-glow-purple/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Book 15-Min Blueprint Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/estimator"
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs sm:text-sm font-bold text-center transition-colors"
              >
                Calculate Ballpark Cost
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
