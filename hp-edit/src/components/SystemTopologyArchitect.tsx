"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Cpu,
  Layers,
  Zap,
  Globe,
  Smartphone,
  MessageSquare,
  Database,
  Server,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Download,
  CheckCircle2,
  Sparkles,
  Share2,
  RefreshCw
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import { OrganizationData } from "@/types";

interface SystemTopologyArchitectProps {
  organization: OrganizationData | null;
}

interface TopologyNode {
  id: string;
  category: "INGRESS" | "AI_ENGINE" | "DATA" | "EGRESS";
  name: string;
  desc: string;
  icon: string;
  defaultSelected: boolean;
  latencyContributionMs: number;
  throughputScore: number;
}

const TOPOLOGY_NODES: TopologyNode[] = [
  // INGRESS
  { id: "nextjs-web", category: "INGRESS", name: "Next.js 15 Edge Web App", desc: "Sub-50ms worldwide SSR & server actions", icon: "globe", defaultSelected: true, latencyContributionMs: 12, throughputScore: 5000 },
  { id: "flutter-mobile", category: "INGRESS", name: "Flutter Cross-Platform Mobile", desc: "Native iOS & Android mobile frontend", icon: "mobile", defaultSelected: false, latencyContributionMs: 18, throughputScore: 3000 },
  { id: "whatsapp-api", category: "INGRESS", name: "Meta WhatsApp Cloud API", desc: "Official verified WhatsApp bot endpoint", icon: "whatsapp", defaultSelected: true, latencyContributionMs: 25, throughputScore: 2500 },
  { id: "rest-webhooks", category: "INGRESS", name: "Event Webhooks Gateway", desc: "Real-time inbound event ingestion", icon: "server", defaultSelected: false, latencyContributionMs: 8, throughputScore: 8000 },

  // AI & ORCHESTRATION
  { id: "ai-lead-agent", category: "AI_ENGINE", name: "Autonomous AI Lead Qualifier", desc: "Multi-turn context-aware qualification agent", icon: "cpu", defaultSelected: true, latencyContributionMs: 35, throughputScore: 1200 },
  { id: "rag-vector-search", category: "AI_ENGINE", name: "Vector RAG Knowledge Engine", desc: "Private semantic search over company docs", icon: "sparkles", defaultSelected: true, latencyContributionMs: 28, throughputScore: 1500 },
  { id: "ocr-doc-parser", category: "AI_ENGINE", name: "Automated OCR Document Parser", desc: "PDF, invoice, and receipt extraction", icon: "layers", defaultSelected: false, latencyContributionMs: 60, throughputScore: 800 },
  { id: "autonomous-scheduler", category: "AI_ENGINE", name: "Calendar & Meeting Booking Agent", desc: "Timezone-synced discovery call booking", icon: "compass", defaultSelected: false, latencyContributionMs: 15, throughputScore: 4000 },

  // DATA & PERSISTENCE
  { id: "postgres-db", category: "DATA", name: "PostgreSQL & pgvector DB", desc: "High-scale relational & embedding storage", icon: "database", defaultSelected: true, latencyContributionMs: 8, throughputScore: 6000 },
  { id: "redis-cache", category: "DATA", name: "Redis In-Memory Session Cache", desc: "Sub-millisecond token & rate limiting", icon: "zap", defaultSelected: true, latencyContributionMs: 2, throughputScore: 12000 },
  { id: "encrypted-vault", category: "DATA", name: "S3 Encrypted Object Vault", desc: "Private client asset & deliverable storage", icon: "shield", defaultSelected: false, latencyContributionMs: 22, throughputScore: 4000 },

  // INTEGRATION & EGRESS
  { id: "stripe-billing", category: "EGRESS", name: "Stripe Automated Invoicing", desc: "Global multi-currency checkout & webhook sync", icon: "card", defaultSelected: true, latencyContributionMs: 14, throughputScore: 3500 },
  { id: "crm-sync", category: "EGRESS", name: "HubSpot / Salesforce 2-Way Sync", desc: "Instant bi-directional CRM data updates", icon: "share", defaultSelected: true, latencyContributionMs: 20, throughputScore: 2000 },
  { id: "slack-alerts", category: "EGRESS", name: "Real-Time Slack / Telegram Alerts", desc: "Founder & sales team instant mobile alerts", icon: "message", defaultSelected: false, latencyContributionMs: 10, throughputScore: 7000 },
];

export default function SystemTopologyArchitect({ organization }: SystemTopologyArchitectProps) {
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>(() =>
    TOPOLOGY_NODES.filter((n) => n.defaultSelected).map((n) => n.id)
  );
  const [copiedNotification, setCopiedNotification] = useState(false);

  const toggleNode = (nodeId: string) => {
    soundFX.click();
    setSelectedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  const selectedNodes = TOPOLOGY_NODES.filter((n) => selectedNodeIds.includes(n.id));

  // Compute Estimated Latency
  const totalLatencyMs = selectedNodes.reduce((acc, curr) => acc + curr.latencyContributionMs, 0);
  // Compute System Throughput Score
  const avgThroughput = Math.round(
    selectedNodes.length > 0
      ? selectedNodes.reduce((acc, curr) => acc + curr.throughputScore, 0) / selectedNodes.length
      : 0
  );

  const handleExportTopology = () => {
    soundFX.success();
    const spec = {
      project: "HP Edit Enterprise Custom Architecture Topology",
      generatedAt: new Date().toISOString(),
      nodesCount: selectedNodes.length,
      estimatedThroughputReqSec: avgThroughput,
      endToEndLatencyMs: totalLatencyMs,
      selectedModules: selectedNodes.map((n) => ({
        layer: n.category,
        name: n.name,
        description: n.desc,
      })),
      recommendedDeployment: "Next.js Edge + Supabase Vector + Cloudflare Global CDN",
    };

    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hpedit_architecture_topology_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      {/* Top Title & Overview */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Enterprise Architecture Designer</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Visual System Topology &amp; <span className="text-gradient-cyan">Pipeline Architect</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
          Configure your desired software stack, AI agent pipelines, and database layers. Watch real-time throughput calculations and generate an executive technical blueprint.
        </p>
      </div>

      {/* Real-Time Telemetry HUD Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <div className="p-4 rounded-2xl luxury-card border border-white/10 text-center space-y-1">
          <span className="text-xs font-mono text-gray-400">Selected Layers</span>
          <div className="text-2xl font-black text-white font-mono">{selectedNodes.length} Nodes</div>
          <span className="text-[10px] text-cyan-300 font-mono">Active Pipeline</span>
        </div>

        <div className="p-4 rounded-2xl luxury-card border border-white/10 text-center space-y-1">
          <span className="text-xs font-mono text-gray-400">Est. Throughput</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{avgThroughput.toLocaleString()} Req/s</div>
          <span className="text-[10px] text-emerald-300 font-mono">High-Concurrency Edge</span>
        </div>

        <div className="p-4 rounded-2xl luxury-card border border-white/10 text-center space-y-1">
          <span className="text-xs font-mono text-gray-400">Est. Latency</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">{totalLatencyMs} ms</div>
          <span className="text-[10px] text-cyan-300 font-mono">Global Edge Roundtrip</span>
        </div>

        <div className="p-4 rounded-2xl luxury-card border border-white/10 text-center space-y-1">
          <span className="text-xs font-mono text-gray-400">Est. Deployment</span>
          <div className="text-2xl font-black text-purple-400 font-mono">2–4 Weeks</div>
          <span className="text-[10px] text-purple-300 font-mono">Rapid Production Sprint</span>
        </div>
      </div>

      {/* Interactive 4-Tier Node Grid */}
      <div className="space-y-8 max-w-6xl mx-auto">
        {[
          { key: "INGRESS", title: "1. Inbound Ingress & User Channels", color: "text-cyan-400 border-cyan-500/30" },
          { key: "AI_ENGINE", title: "2. Autonomous AI & Processing Engine", color: "text-purple-400 border-purple-500/30" },
          { key: "DATA", title: "3. Vector Database & Persistence Vault", color: "text-emerald-400 border-emerald-500/30" },
          { key: "EGRESS", title: "4. Integrations, Billing & Real-Time Egress", color: "text-amber-400 border-amber-500/30" },
        ].map((layer) => {
          const layerNodes = TOPOLOGY_NODES.filter((n) => n.category === layer.key);

          return (
            <div key={layer.key} className="space-y-3">
              <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${layer.color.split(" ")[0]} flex items-center gap-2`}>
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span>{layer.title}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {layerNodes.map((node) => {
                  const isSelected = selectedNodeIds.includes(node.id);

                  return (
                    <div
                      key={node.id}
                      onClick={() => toggleNode(node.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative select-none ${
                        isSelected
                          ? "bg-cyan-500/10 border-cyan-500/50 shadow-glow-cyan/15 scale-[1.02]"
                          : "bg-white/5 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100"
                      }`}
                    >
                      {/* Checkmark Indicator */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-white text-xs leading-snug">
                          {node.name}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            isSelected ? "bg-cyan-400 text-gray-950" : "border border-gray-600"
                          }`}
                        >
                          {isSelected && "✓"}
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-300 font-medium leading-relaxed mb-3">
                        {node.desc}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 border-t border-white/5 pt-2">
                        <span>+{node.latencyContributionMs}ms</span>
                        <span>{node.throughputScore.toLocaleString()} req/s</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Blueprint Action Bar & Discovery CTA */}
      <div className="p-6 sm:p-8 rounded-3xl luxury-card border border-cyan-500/30 max-w-4xl mx-auto shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Ready to Build This Exact System?</span>
          </h4>
          <p className="text-xs text-gray-300 font-medium mt-1 max-w-lg leading-relaxed">
            Download your customized architecture specification or schedule a 15-minute scoping sprint with our Principal System Architect.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleExportTopology}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Topology JSON</span>
          </button>

          <Link
            href={`/book?topic=${encodeURIComponent(`Custom Architecture Sprint: ${selectedNodes.length} Nodes`)}`}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-2 transition-all shadow-glow-cyan/20 w-full sm:w-auto justify-center"
          >
            <span>Book Discovery Sprint</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mobile-Only Sticky Floating Architecture HUD */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-cyber-950/95 backdrop-blur-xl border-t border-cyan-500/30 shadow-2xl flex items-center justify-between gap-2 safe-area-bottom">
        <div>
          <div className="text-[10px] font-mono text-cyan-400 font-bold">
            {selectedNodes.length} Nodes Active
          </div>
          <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
            <span>{avgThroughput.toLocaleString()} Req/s</span>
            <span className="text-gray-500">•</span>
            <span className="text-cyan-300">{totalLatencyMs} ms</span>
          </div>
        </div>

        <Link
          href={`/book?topic=${encodeURIComponent(`Architecture Sprint: ${selectedNodes.length} Nodes`)}`}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-transform shrink-0"
        >
          <span>Book Sprint</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
