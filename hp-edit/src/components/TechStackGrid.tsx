"use client";

import { useState } from "react";
import {
  Code2,
  Database,
  Cpu,
  Layers,
  Cloud,
  Terminal,
  Sparkles,
  CheckCircle2,
  Globe,
  Bot,
  Zap,
  Smartphone,
  ShieldCheck,
  Server
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";

const techPillars = [
  {
    id: "frontend",
    title: "Edge Frontend & 120Hz Mobile",
    category: "Client Tier",
    icon: Globe,
    accentColor: "#06B6D4",
    sla: "< 80ms TTFB",
    desc: "Next.js 15 App Router with instant server component streaming and 120Hz native Flutter mobile platforms.",
    stack: [
      { name: "Next.js 15", tag: "App Router / SSR" },
      { name: "React 19", tag: "Concurrent Mode" },
      { name: "Flutter 3", tag: "iOS & Android 120Hz" },
      { name: "TypeScript", tag: "Strict Type Safety" },
      { name: "Tailwind CSS", tag: "Design Systems" },
      { name: "Three.js / WebGL", tag: "3D Visuals" },
    ],
  },
  {
    id: "ai_llm",
    title: "Frontier AI & Multi-Agent Swarms",
    category: "Intelligence Tier",
    icon: Bot,
    accentColor: "#8B5CF6",
    sla: "Zero Data Leak",
    desc: "Autonomous multi-agent orchestration pipelines powered by Gemini 2.0 Flash and Claude 3.7 with private vector RAG.",
    stack: [
      { name: "Gemini 2.0 Flash", tag: "Real-Time Multimodal" },
      { name: "Claude 3.7 Sonnet", tag: "Deep Reasoning" },
      { name: "LangChain / LlamaIndex", tag: "Multi-Agent Frameworks" },
      { name: "Vector Databases", tag: "Pinecone / Milvus" },
      { name: "Private Air-Gapped RAG", tag: "AES-256 Vector Store" },
      { name: "Local LLMs", tag: "vLLM / Ollama" },
    ],
  },
  {
    id: "cloud_backend",
    title: "High-Throughput Microservices",
    category: "Compute Tier",
    icon: Server,
    accentColor: "#3B82F6",
    sla: "99.99% Uptime",
    desc: "Async event-driven architectures capable of handling 50k+ req/sec with sub-40ms latency.",
    stack: [
      { name: "Python / FastAPI", tag: "Async AI Microservices" },
      { name: "Node.js / Express", tag: "WebSocket Real-Time" },
      { name: "AWS & Google Cloud", tag: "Serverless & Cloud Run" },
      { name: "Docker & Kubernetes", tag: "Container Orchestration" },
      { name: "Global Anycast CDN", tag: "Edge Caching" },
      { name: "Zero-Trust TLS 1.3", tag: "Encrypted Ingress" },
    ],
  },
  {
    id: "automation_wa",
    title: "Meta WhatsApp & Enterprise Automations",
    category: "Workflow Tier",
    icon: Zap,
    accentColor: "#10B981",
    sla: "< 5s Pipeline Sync",
    desc: "Official Meta WhatsApp Cloud API conversational funnels, bi-directional CRM synchronizers, and automated checkout.",
    stack: [
      { name: "Meta WhatsApp Cloud API", tag: "Graph API v21.0" },
      { name: "Zapier / n8n / Make", tag: "Multi-App Integrations" },
      { name: "Stripe & Razorpay", tag: "Multi-Currency Checkout" },
      { name: "Puppeteer / Headless", tag: "Web Intelligence Robots" },
      { name: "HubSpot / Salesforce Sync", tag: "2-Way Lead Pipelines" },
      { name: "Automated Invoicing", tag: "ERP Accounting Bots" },
    ],
  },
  {
    id: "data_cache",
    title: "Data Core & Ultra-Fast Caching",
    category: "Data Tier",
    icon: Database,
    accentColor: "#F59E0B",
    sla: "< 5ms Cache Hits",
    desc: "ACID-compliant relational clusters combined with in-memory distributed Redis caches.",
    stack: [
      { name: "PostgreSQL 16", tag: "ACID Relational Core" },
      { name: "Redis 7", tag: "Sub-ms In-Memory Cache" },
      { name: "Prisma ORM", tag: "Type-Safe DB Schemas" },
      { name: "Supabase / Firebase", tag: "Real-time State Sync" },
      { name: "Read Replicas", tag: "High-Availability DB" },
      { name: "Automated Backups", tag: "Point-in-Time Recovery" },
    ],
  },
];

export default function TechStackGrid() {
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);

  return (
    <section id="tech-stack" className="py-24 relative bg-cyber-950 overflow-hidden scroll-reveal">
      {/* Background radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Code2 className="w-3.5 h-3.5" />
            <span>Modern Engineering Arsenal</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Battle-Tested <span className="text-gradient-cyan">Technologies</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed">
            We don&apos;t compromise on infrastructure. We select optimal engineering stacks to guarantee lightning speed, ironclad security, and effortless scale.
          </p>
        </div>

        {/* Categorized Bento Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2 -m-2">
          {techPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isLarge = index === 0 || index === 1;

            return (
              <div
                key={pillar.id}
                onMouseEnter={() => {
                  soundFX.click();
                  setHoveredPillar(pillar.id);
                }}
                onMouseLeave={() => setHoveredPillar(null)}
                className={`luxury-card h-full p-7 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between group transition-all duration-300 ${
                  isLarge ? "lg:col-span-1" : ""
                } hover:border-cyan-500/40 hover:shadow-2xl`}
              >
                <div className="flex-1 flex flex-col">
                  {/* Pillar Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${pillar.accentColor}15`,
                        borderColor: `${pillar.accentColor}40`,
                        color: pillar.accentColor,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-gray-400">
                        {pillar.category}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        {pillar.sla}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 min-h-[56px] flex items-center">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6 min-h-[64px] flex-1">
                    {pillar.desc}
                  </p>

                  {/* Stack Chips Matrix */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/5 mt-auto">
                    {pillar.stack.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/3 border border-white/5 group-hover:border-white/10 transition-colors min-h-[54px] flex flex-col justify-center"
                      >
                        <div className="font-bold text-xs text-white">{item.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{item.tag}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Production Grade</span>
                  </span>
                  <span className="text-gray-500 uppercase">HP Edit Core</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
