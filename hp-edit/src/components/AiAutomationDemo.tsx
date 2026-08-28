"use client";

import { useState, useEffect } from "react";
import {
  Cpu,
  Bot,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Layers,
  ArrowRight,
  Database,
  MessageSquare,
  Sparkles,
  Search,
  FileSpreadsheet
} from "lucide-react";

interface WorkflowStep {
  agentName: string;
  action: string;
  status: "pending" | "running" | "completed";
  detail: string;
}

interface Scenario {
  id: string;
  title: string;
  badge: string;
  description: string;
  steps: WorkflowStep[];
  outputPayload: Record<string, unknown>;
}

const scenarios: Scenario[] = [
  {
    id: "lead-qualifier",
    title: "Inbound Lead Triage & WhatsApp AI Agent",
    badge: "AI Agents & WhatsApp API",
    description: "Autonomous multi-agent system analyzing inbound client inquiries, grading technical feasibility, generating custom architecture briefs, and triggering instant WhatsApp CRM notifications.",
    steps: [
      {
        agentName: "Agent-01: Ingestion & Parser",
        action: "Parsing unstructured enquiry & verifying company domain authenticity...",
        status: "pending",
        detail: "Extracted: Budget \$15k+, Tech Stack: Next.js + Flutter + AI Agent",
      },
      {
        agentName: "Agent-02: LLM Architect (Claude 3.7 / Gemini)",
        action: "Synthesizing optimal tech stack & timeline milestone breakdown...",
        status: "pending",
        detail: "Proposed 4-sprint agile delivery with CI/CD cloud orchestrator",
      },
      {
        agentName: "Agent-03: Meta WhatsApp Dispatcher",
        action: "Formatting interactive WhatsApp card & notifying enterprise account lead...",
        status: "pending",
        detail: "Dispatched payload via Meta Cloud API webhook (Status: 200 OK)",
      },
    ],
    outputPayload: {
      lead_score: "96 / 100 (Tier 1 Priority)",
      recommended_architecture: "Next.js 15 + Fast-API Python Agent + PostgreSQL + Redis",
      estimated_sprints: 4,
      whatsapp_notification: "SENT via Meta WhatsApp Cloud API to Account Lead",
      timestamp: "2026-08-26T03:00:00Z",
    },
  },
  {
    id: "invoice-extractor",
    title: "Autonomous Invoice & Document Extraction Pipeline",
    badge: "Enterprise Automation & Vision",
    description: "Multimodal AI agent reading complex PDF documents, extracting tabular line items, cross-referencing legacy ERP inventory, and exporting verified ledger entries.",
    steps: [
      {
        agentName: "Agent-01: Document OCR & Visual Grounding",
        action: "Scanning PDF layout, bounding boxes, and tabular invoice line items...",
        status: "pending",
        detail: "Identified 18 line items across 3 pages (Confidence: 99.4%)",
      },
      {
        agentName: "Agent-02: ERP Anomaly & Fraud Check",
        action: "Validating vendor tax ID against master database & checking price variance...",
        status: "pending",
        detail: "All PO numbers verified. Zero variance detected.",
      },
      {
        agentName: "Agent-03: Automated ERP Synchronization",
        action: "Executing database transaction & archiving cryptographic receipt...",
        status: "pending",
        detail: "Synced to ERP Ledger (TxHash: 0x8f2a...c419)",
      },
    ],
    outputPayload: {
      document_type: "Commercial Logistics Invoice #INV-8829",
      total_amount: "\$48,920.00 USD",
      validation_status: "PASSED (0 Anomaly)",
      erp_sync: "SUCCESS (Ledger Updated)",
      processing_time: "1.42 seconds",
    },
  },
  {
    id: "growth-engine",
    title: "Influencer Campaign ROI & Growth Analyzer",
    badge: "Growth Engine & Marketing AI",
    description: "Crawls social creator posts, calculates real engagement velocity vs. fake bot followers, and computes true cost-per-acquisition (CPA) multipliers.",
    steps: [
      {
        agentName: "Agent-01: Social Graph Scraper",
        action: "Fetching real-time creator post metrics, comments, and sentiment vectors...",
        status: "pending",
        detail: "Analyzed 45 latest video reels & 12,000 comment threads",
      },
      {
        agentName: "Agent-02: Audience Quality & Fraud Filtering",
        action: "Filtering suspicious bot activity & clustering genuine buyer personas...",
        status: "pending",
        detail: "Organic audience ratio: 92.6% (High-intent buyer concentration)",
      },
      {
        agentName: "Agent-03: Campaign Allocation Optimiser",
        action: "Computing optimal budget split across highest-converting creators...",
        status: "pending",
        detail: "Projected 4.2x ROAS across targeted demographics",
      },
    ],
    outputPayload: {
      influencer_fit_score: "89% (High Conversion Affinity)",
      audience_authenticity: "92.6% verified humans",
      projected_roas: "4.2x",
      recommended_ad_budget: "\$5,000 -> Projected Revenue: \$21,000",
    },
  },
];

export default function AiAutomationDemo() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState<boolean>(false);

  const currentScenario = scenarios[activeScenarioIndex];

  const runSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStepIndex(0);
    setShowOutput(false);
    setConsoleLogs([
      `[SYSTEM] Initializing autonomous agent cluster: "${currentScenario.title}"...`,
      `[KERNEL] Allocating compute nodes & connecting secure API bridges...`,
    ]);
  };

  useEffect(() => {
    if (!isRunning) return;

    if (currentStepIndex >= 0 && currentStepIndex < currentScenario.steps.length) {
      const step = currentScenario.steps[currentStepIndex];
      const timer = setTimeout(() => {
        setConsoleLogs((prev) => [
          ...prev,
          `[${step.agentName}] ${step.action}`,
          `[RESULT] -> ${step.detail}`,
        ]);
        setCurrentStepIndex((prev) => prev + 1);
      }, 1300);

      return () => clearTimeout(timer);
    } else if (currentStepIndex >= currentScenario.steps.length) {
      const finishTimer = setTimeout(() => {
        setConsoleLogs((prev) => [
          ...prev,
          `[PIPELINE COMPLETE] All autonomous agent tasks executed successfully in 3.9s.`,
        ]);
        setIsRunning(false);
        setShowOutput(true);
      }, 700);

      return () => clearTimeout(finishTimer);
    }
  }, [isRunning, currentStepIndex, currentScenario]);

  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentStepIndex(-1);
    setShowOutput(false);
    setConsoleLogs([]);
  };

  const handleSelectScenario = (index: number) => {
    resetSimulation();
    setActiveScenarioIndex(index);
  };

  return (
    <section id="ai-demo" className="py-24 relative bg-cyber-900 border-y border-white/10 overflow-hidden">
      {/* Radial Glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Interactive Technology Sandbox</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              See Our <span className="text-gradient-purple">AI &amp; Automation Agents</span> in Action
            </h2>
            <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
              We do not just build chatbots—we architect autonomous multi-agent pipelines that eliminate hundreds of hours of manual operational bottlenecks.
            </p>
          </div>

          <a
            href="/ai-lab"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all hover:scale-105 shrink-0 shadow-glow-purple/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Open Dedicated AI Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Scenario Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 p-1 -m-1">
          {scenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(idx)}
              className={`h-full p-4 rounded-xl text-left transition-all duration-200 border flex flex-col justify-between ${
                activeScenarioIndex === idx
                  ? "bg-cyber-850 border-purple-500/50 shadow-glow-purple/20"
                  : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  {sc.badge}
                </span>
                {activeScenarioIndex === idx && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                )}
              </div>
              <div className="font-bold text-sm text-white flex-1 flex items-center">{sc.title}</div>
            </button>
          ))}
        </div>

        {/* Live Interactive Simulator Console */}
        <div className="rounded-2xl glass-panel border border-purple-500/30 overflow-hidden shadow-2xl">
          {/* Top Bar of Console */}
          <div className="bg-cyber-950/90 px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="h-4 w-[1px] bg-white/20 mx-1" />
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>agent-orchestrator://hpedit-cluster-node-01</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetSimulation}
                disabled={isRunning}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={runSimulation}
                disabled={isRunning}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-60"
              >
                {isRunning ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Executing Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Workflow Execution Pipeline Map (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Autonomous Agent Sequence</span>
              </h4>

              <div className="space-y-3">
                {currentScenario.steps.map((step, idx) => {
                  const isDone = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border transition-all duration-300 ${
                        isCurrent
                          ? "bg-purple-500/10 border-purple-400 shadow-glow-purple/30 scale-[1.02]"
                          : isDone
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : "bg-white/5 border-white/5 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {step.agentName}
                        </span>
                        {isDone ? (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        ) : isCurrent ? (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded animate-pulse">
                            Processing...
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500">Queued</span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-gray-300">{step.action}</p>
                    </div>
                  );
                })}
              </div>

              {/* Action Note */}
              <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-gray-300">
                <span className="font-semibold text-cyan-400">Production Ready:</span> We build similar autonomous bots for WhatsApp support, invoice reconciliation, customs clearance, and lead conversion.
              </div>
            </div>

            {/* Right: Terminal Stream & Structured Output (7 cols) */}
            <div className="lg:col-span-7 flex flex-col h-[340px] rounded-xl bg-cyber-950 border border-white/10 overflow-hidden font-mono text-xs">
              <div className="px-4 py-2 bg-cyber-900 border-b border-white/5 text-gray-400 flex items-center justify-between text-[11px]">
                <span>STREAM LOGS</span>
                <span>STATUS: {isRunning ? "PROCESSING" : showOutput ? "DONE" : "IDLE"}</span>
              </div>

              {/* Scrollable logs */}
              <div className="flex-1 p-4 overflow-y-auto space-y-2 text-gray-300 no-scrollbar">
                {consoleLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center p-6">
                    <Bot className="w-10 h-10 mb-2 opacity-30 text-purple-400" />
                    <p>Click &quot;Run Simulation&quot; above to watch the multi-agent execution pipeline in real-time.</p>
                  </div>
                ) : (
                  consoleLogs.map((log, index) => {
                    const isResult = log.startsWith("[RESULT]");
                    const isComplete = log.startsWith("[PIPELINE COMPLETE]");
                    return (
                      <div
                        key={index}
                        className={`leading-relaxed animate-in fade-in ${
                          isComplete
                            ? "text-emerald-400 font-bold bg-emerald-500/10 p-2 rounded border border-emerald-500/20"
                            : isResult
                            ? "text-cyan-300 pl-4 border-l-2 border-cyan-400"
                            : "text-gray-300"
                        }`}
                      >
                        {log}
                      </div>
                    );
                  })
                )}

                {/* Final JSON Output card */}
                {showOutput && (
                  <div className="mt-4 p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 animate-in zoom-in-95">
                    <div className="text-purple-300 font-bold mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>PARSED AGENT PAYLOAD:</span>
                    </div>
                    <pre className="text-[11px] text-gray-200 overflow-x-auto p-2 bg-black/40 rounded">
                      {JSON.stringify(currentScenario.outputPayload, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
