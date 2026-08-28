"use client";

import React, { useState } from "react";
import {
  Cpu,
  Sparkles,
  Send,
  MessageSquare,
  FileText,
  Calendar,
  Layers,
  CheckCircle2,
  Zap,
  RotateCcw,
  ArrowRight,
  Bot,
  User,
  Clock,
  Database
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import { OrganizationData } from "@/types";
import Link from "next/link";

interface AiAgentSandboxProps {
  organization: OrganizationData | null;
}

interface AgentMode {
  id: string;
  name: string;
  role: string;
  icon: typeof Cpu;
  badgeColor: string;
  description: string;
  samplePrompts: string[];
  initialMessages: { sender: "agent" | "user"; text: string; time: string; metadata?: Record<string, string> }[];
}

const AGENT_MODES: AgentMode[] = [
  {
    id: "lead-qualifier",
    name: "Lead Qualification Agent",
    role: "Autonomous Inbound SDR",
    icon: Sparkles,
    badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    description: "Evaluates project technical requirements, budget fit, and timeline constraints in sub-30ms.",
    samplePrompts: [
      "I need a high-speed multi-tenant SaaS with AI vector search.",
      "We want to build a mobile app in Flutter with WhatsApp bot integration.",
      "What is the average timeline for an enterprise automation pipeline?",
    ],
    initialMessages: [
      {
        sender: "agent",
        text: "👋 Welcome to HP Edit Enterprise! I am your Autonomous Qualification Agent. What digital platform or AI architecture are you looking to architect today?",
        time: "Just now",
      },
    ],
  },
  {
    id: "whatsapp-support",
    name: "WhatsApp Support & Order Bot",
    role: "24/7 Meta Cloud API Agent",
    icon: MessageSquare,
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    description: "Answers customer queries, looks up real-time database orders, and initiates human escalation.",
    samplePrompts: [
      "Check delivery status for tracking code HPE-8942.",
      "Can I reschedule my onboarding consultation to Friday 4 PM?",
      "Do you support custom Stripe payment gateway integrations?",
    ],
    initialMessages: [
      {
        sender: "agent",
        text: "⚡ Meta WhatsApp Cloud API Agent initialized. How can I assist you with your active service order or project delivery today?",
        time: "Just now",
      },
    ],
  },
  {
    id: "doc-parser",
    name: "Document & Invoice Parser",
    role: "Multimodal OCR & Data Extractor",
    icon: FileText,
    badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    description: "Parses unformatted invoices, receipts, and contracts into normalized JSON database records.",
    samplePrompts: [
      "Extract line items and subtotal from Invoice #INV-2026-904.",
      "Parse vendor name, tax ID, and due date from raw PDF text.",
      "Normalize messy CSV data into structured SQL schema.",
    ],
    initialMessages: [
      {
        sender: "agent",
        text: "📄 Multimodal Data Extraction Engine ready. Paste raw invoice text, purchase orders, or contract specs to extract structured JSON data.",
        time: "Just now",
      },
    ],
  },
  {
    id: "calendar-scheduler",
    name: "Executive Calendar Agent",
    role: "Autonomous Meeting Coordinator",
    icon: Calendar,
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    description: "Coordinates multi-timezone discovery sprints and integrates directly with Google Meet & Cal.com.",
    samplePrompts: [
      "Find an available 15-minute slot tomorrow afternoon IST.",
      "Book an architecture consultation for next Monday.",
      "What are the prerequisite details needed before our technical scoping sprint?",
    ],
    initialMessages: [
      {
        sender: "agent",
        text: "📅 Calendar Scheduling Intelligence active. I can schedule a 15-minute Discovery Sprint with our Principal Architect. What date works best?",
        time: "Just now",
      },
    ],
  },
];

export default function AiAgentSandbox({ organization }: AiAgentSandboxProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("lead-qualifier");
  const [messages, setMessages] = useState<Record<string, { sender: "agent" | "user"; text: string; time: string; metadata?: Record<string, string> }[]>>({
    "lead-qualifier": [...AGENT_MODES[0].initialMessages],
    "whatsapp-support": [...AGENT_MODES[1].initialMessages],
    "doc-parser": [...AGENT_MODES[2].initialMessages],
    "calendar-scheduler": [...AGENT_MODES[3].initialMessages],
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const activeAgent = AGENT_MODES.find((a) => a.id === selectedAgentId) || AGENT_MODES[0];
  const currentMessages = messages[selectedAgentId] || [];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    soundFX.click();

    // Append user message
    const userMsg = {
      sender: "user" as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedAgentId]: [...(prev[selectedAgentId] || []), userMsg],
    }));

    if (!textToSend) setInputValue("");
    setIsTyping(true);

    // Simulate real-time agent response stream
    setTimeout(() => {
      soundFX.success();
      let replyText = "";
      let metadata: Record<string, string> | undefined;

      if (selectedAgentId === "lead-qualifier") {
        replyText = `🚀 Project architecture recognized! For a high-speed system with custom AI vector embeddings, we recommend a Next.js Edge SSR frontend connected to Supabase pgvector and FastAPI microservices. Typical deployment timeline is 3 to 4 weeks. Would you like to reserve a 15-min discovery sprint?`;
        metadata = { MatchConfidence: "98.4%", SuggestedTier: "Enterprise Sprint", Latency: "34ms" };
      } else if (selectedAgentId === "whatsapp-support") {
        replyText = `📦 Order Status Lookup: Project #${text.slice(0, 12) || "HPE-8942"} is currently in Milestone 3 (Vector Cluster Deployment) at 75% completion. Scheduled QA staging release is tomorrow at 5:00 PM IST.`;
        metadata = { Channel: "WhatsApp Cloud API v21.0", Security: "End-to-End Encrypted", Latency: "19ms" };
      } else if (selectedAgentId === "doc-parser") {
        replyText = `{\n  "status": "SUCCESS",\n  "extractedData": {\n    "vendor": "Acme Cloud Services",\n    "invoiceNumber": "INV-2026-904",\n    "totalAmount": "$4,500.00",\n    "currency": "USD",\n    "lineItemsCount": 4\n  }\n}`;
        metadata = { ConfidenceScore: "99.8%", TokensProcessed: "412", Latency: "42ms" };
      } else {
        replyText = `✅ Verified open slots: Tomorrow at 2:30 PM IST, 4:00 PM IST, or 6:30 PM IST. I can lock in your slot and dispatch a calendar invite with Google Meet link immediately.`;
        metadata = { CalendarSync: "Google Meet / Cal.com", Timezone: "Asia/Kolkata", Latency: "16ms" };
      }

      const agentMsg = {
        sender: "agent" as const,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        metadata,
      };

      setMessages((prev) => ({
        ...prev,
        [selectedAgentId]: [...(prev[selectedAgentId] || []), agentMsg],
      }));
      setIsTyping(false);
    }, 900);
  };

  const handleResetChat = () => {
    soundFX.click();
    setMessages((prev) => ({
      ...prev,
      [selectedAgentId]: [...activeAgent.initialMessages],
    }));
  };

  return (
    <div className="space-y-12">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Interactive Live AI Sandbox</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Autonomous AI Agent <span className="text-gradient-purple">Simulation Lab</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
          Test real-time business AI agent workflows live in your browser. Experience sub-50ms lead qualification, WhatsApp support bots, and multimodal data parsing.
        </p>
      </div>

      {/* 4 Agent Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {AGENT_MODES.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          const Icon = agent.icon;

          return (
            <div
              key={agent.id}
              onClick={() => {
                soundFX.click();
                setSelectedAgentId(agent.id);
              }}
              className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 space-y-3 ${
                isSelected
                  ? "bg-purple-500/10 border-purple-500/50 shadow-glow-purple/20 scale-[1.02]"
                  : "bg-white/5 border-white/10 hover:border-white/20 opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-2xl border ${agent.badgeColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white leading-tight">{agent.name}</h3>
                <p className="text-[11px] font-mono text-purple-300 mt-0.5">{agent.role}</p>
              </div>

              <p className="text-xs text-gray-300 font-medium leading-relaxed line-clamp-2">
                {agent.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Interactive Chat Sandbox Terminal */}
      <div className="max-w-4xl mx-auto rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{activeAgent.name}</span>
                <span className="text-[10px] font-mono text-gray-400">({activeAgent.role})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetChat}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Session</span>
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="p-6 space-y-4 min-h-[340px] max-h-[460px] overflow-y-auto font-sans">
          {currentMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === "user"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 space-y-2 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-cyan-500/15 border border-cyan-500/30 text-white rounded-tr-none"
                    : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none font-sans"
                }`}
              >
                {msg.text.startsWith("{") ? (
                  <pre className="font-mono text-[11px] text-cyan-300 bg-black/40 p-3 rounded-xl overflow-x-auto">
                    {msg.text}
                  </pre>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}

                {/* Telemetry Trace */}
                {msg.metadata && (
                  <div className="flex items-center gap-3 pt-2 border-t border-white/10 text-[10px] font-mono text-purple-300">
                    {Object.entries(msg.metadata).map(([k, v]) => (
                      <span key={k}>
                        {k}: <strong className="text-white">{v}</strong>
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-[10px] font-mono text-gray-400 text-right">{msg.time}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-purple-300 font-mono animate-pulse">
              <Bot className="w-4 h-4" />
              <span>Autonomous agent processing inference...</span>
            </div>
          )}
        </div>

        {/* 1-Click Sample Prompts */}
        <div className="p-3 bg-black/30 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-mono text-gray-400 shrink-0">Try prompt:</span>
          {activeAgent.samplePrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-500/20 text-gray-300 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 text-[11px] whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-3">
          <input
            type="text"
            placeholder={`Ask ${activeAgent.name}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-grow px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-purple/20"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Discovery Booking CTA */}
      <div className="text-center">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-gray-950 font-bold text-xs sm:text-sm hover:scale-105 transition-all shadow-glow-purple/25"
        >
          <span>Deploy Custom AI Agent Pipelines For Your Business</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
