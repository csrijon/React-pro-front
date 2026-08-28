"use client";

import { useState } from "react";
import {
  Globe,
  Cpu,
  Bot,
  Database,
  MessageSquare,
  Server,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import WhatsAppIcon from "./WhatsAppIcon";

const nodes = [
  {
    id: "frontend",
    title: "Edge Client Tier",
    sub: "Next.js 15 & Flutter Mobile",
    icon: Globe,
    color: "#06B6D4",
    latency: "18 ms",
    tech: ["Next.js 15", "React 19", "Flutter / Dart", "Tailwind CSS"],
    deliverable: "120Hz butter-smooth rendering, instant edge hydration, sub-100ms Core Web Vitals across iOS, Android, and Web.",
  },
  {
    id: "gateway",
    title: "Sub-40ms Edge API Gateway",
    sub: "Zero-Trust Load Balancer",
    icon: Server,
    color: "#3B82F6",
    latency: "24 ms",
    tech: ["Global Anycast Edge", "TLS 1.3", "Sliding Rate Limiter", "DDoS Shield"],
    deliverable: "Instant global traffic routing, automatic spam bot honeypot neutralization, and bank-grade cryptographic protection.",
  },
  {
    id: "ai_swarm",
    title: "Autonomous AI Agent Swarm",
    sub: "Frontier LLM Orchestrator",
    icon: Bot,
    color: "#8B5CF6",
    latency: "62 ms",
    tech: ["Python FastAPI", "Claude 3.7", "Gemini 2.0 Flash", "LangChain"],
    deliverable: "Autonomous multi-agent task execution, document reasoning, invoice audit, and CRM triage without human bottleneck.",
  },
  {
    id: "rag_vector",
    title: "Private Vector Knowledge Base",
    sub: "Air-Gapped Semantic Search",
    icon: Database,
    color: "#EC4899",
    latency: "31 ms",
    tech: ["Pinecone / Milvus", "Hybrid Embeddings", "AES-256", "Zero Public Training"],
    deliverable: "Instant semantic recall over 100k+ enterprise documents. 100% tenant-isolated data safety and SOC-2 compliance.",
  },
  {
    id: "meta_wa",
    title: "Meta WhatsApp Cloud API",
    sub: "Real-Time Conversational Funnel",
    icon: MessageSquare,
    color: "#10B981",
    latency: "45 ms",
    tech: ["Official Graph API v21.0", "Webhooks", "Catalog Pay", "98% Open Rate"],
    deliverable: "Automated instant lead capture, AI appointment booking, and frictionless checkout directly on customer WhatsApp.",
  },
  {
    id: "database_core",
    title: "High-Throughput Data Core",
    sub: "PostgreSQL & Prisma Engine",
    icon: Cpu,
    color: "#F59E0B",
    latency: "12 ms",
    tech: ["PostgreSQL 16", "Prisma ORM", "Redis Caching", "Read Replicas"],
    deliverable: "ACID compliant, sub-15ms transactional execution with automated backups and scalable multi-tenant tenancy.",
  },
];

export default function InteractiveSystemArchitecture() {
  const [activeNode, setActiveNode] = useState(nodes[0]);

  return (
    <section className="py-24 relative bg-cyber-950 overflow-hidden scroll-reveal">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Architecture Visualizer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How We Engineer{" "}
            <span className="text-gradient-cyan">High-Velocity Systems</span>
          </h2>
          <p className="mt-4 text-gray-400 text-sm sm:text-base leading-relaxed">
            Click any architecture node below to inspect live latency SLAs, stack composition, and enterprise deliverables.
          </p>
        </div>

        {/* Interactive Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 6 Interactive System Nodes (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {nodes.map((node) => {
              const Icon = node.icon;
              const isSelected = activeNode.id === node.id;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setActiveNode(node);
                  }}
                  className={`p-5 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between group ${
                    isSelected
                      ? "bg-white/10 border-cyan-400 shadow-glow-cyan/25 scale-[1.02]"
                      : "luxury-card border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${node.color}15`,
                        borderColor: `${node.color}40`,
                        color: node.color,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>{node.latency}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {node.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-1">{node.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Deep-Dive Visualizer Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-8 sm:p-10 rounded-3xl glass-dropdown border border-cyan-500/40 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `${activeNode.color}20`,
                      borderColor: `${activeNode.color}50`,
                      color: activeNode.color,
                    }}
                  >
                    <activeNode.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{activeNode.title}</h3>
                    <span className="text-xs text-gray-400 font-mono">{activeNode.sub}</span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {activeNode.latency} SLA
                </span>
              </div>

              {/* What This Delivers For Your Company */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Enterprise Deliverable
                </span>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
                  {activeNode.deliverable}
                </p>
              </div>

              {/* Stack Composition */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Engineered With
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Guarantee Pill */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Source Code Handover</span>
                </div>
                <span className="font-mono text-cyan-400">Zero Lock-in</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
