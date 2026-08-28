"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Download,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  DollarSign
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import { OrganizationData } from "@/types";

interface AutomationMaturityScorecardProps {
  organization: OrganizationData | null;
}

interface Question {
  id: number;
  category: string;
  question: string;
  options: { text: string; points: number; desc: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Speed to Lead",
    question: "How fast does your team currently respond to inbound website & ad leads?",
    options: [
      { text: "More than 4 hours (or next day)", points: 5, desc: "Leads get cold; 78% buy from the first responder." },
      { text: "Within 30–60 minutes manually", points: 12, desc: "Acceptable for small volume, breaks on weekends." },
      { text: "Automated template email within 5 mins", points: 18, desc: "Better speed, but lacks dynamic qualification." },
      { text: "Sub-60 seconds via AI Agent / WhatsApp", points: 25, desc: "Top 1% conversion velocity benchmark." },
    ],
  },
  {
    id: 2,
    category: "Data & Workflow Fragmentation",
    question: "How does customer & operational data move between your tools?",
    options: [
      { text: "Manual copy-pasting across spreadsheets & tabs", points: 5, desc: "High human error, 15+ lost hours/week." },
      { text: "Zapier / basic webhooks that often break", points: 12, desc: "Fragile connectors with no audit ledger." },
      { text: "Partially integrated CRM with custom scripts", points: 18, desc: "Works for basic flows, lacks autonomous actions." },
      { text: "Unified database & real-time bi-directional sync", points: 25, desc: "Zero double data entry, fully synced." },
    ],
  },
  {
    id: 3,
    category: "WhatsApp & Omnichannel Reach",
    question: "How do you engage customers on instant messaging channels?",
    options: [
      { text: "Staff personal WhatsApp numbers / no API", points: 5, desc: "No central CRM logging, high churn risk." },
      { text: "Basic WhatsApp Business App on 1 device", points: 12, desc: "Lacks multi-agent routing and automated booking." },
      { text: "Third-party unofficial API tools", points: 15, desc: "Risk of number ban, limited scale." },
      { text: "Official Meta WhatsApp Cloud API with AI bots", points: 25, desc: "Verified green badge, 24/7 autonomous support." },
    ],
  },
  {
    id: 4,
    category: "AI & Decision Automation",
    question: "How is Artificial Intelligence integrated into your daily operations?",
    options: [
      { text: "No AI usage or occasional ChatGPT prompting", points: 5, desc: "Underutilizing automation advantages." },
      { text: "Team uses individual AI assistants for drafting", points: 12, desc: "Productive for individuals, not systemic." },
      { text: "Basic automated chatbot on the website", points: 18, desc: "Handles simple FAQs, lacks database actions." },
      { text: "Autonomous multi-agent swarms integrated in CRM/ERP", points: 25, desc: "Autonomous pipeline qualification & execution." },
    ],
  },
  {
    id: 5,
    category: "Executive Telemetry & Visibility",
    question: "How do leaders monitor live business metrics & bottlenecks?",
    options: [
      { text: "Manual weekly/monthly Excel reports", points: 5, desc: "Lagging indicators; blind to live leaks." },
      { text: "Scattered native dashboards across 4+ tools", points: 12, desc: "Time-consuming to reconcile metrics." },
      { text: "Google Looker / PowerBI updated daily", points: 18, desc: "Good historical visibility, not real-time." },
      { text: "Real-time automated dashboard with alert webhooks", points: 25, desc: "Instant telemetry, proactive bottleneck defense." },
    ],
  },
];

export default function AutomationMaturityScorecard({ organization }: AutomationMaturityScorecardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (points: number) => {
    soundFX.click();
    const newAnswers = [...selectedAnswers];
    newAnswers[currentStep] = points;
    setSelectedAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      soundFX.success();
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    soundFX.click();
    setSelectedAnswers([]);
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const totalScore = selectedAnswers.reduce((acc, curr) => acc + curr, 0);

  // Determine Maturity Level
  let levelTitle = "";
  let levelBadge = "";
  let levelColor = "";
  let levelSummary = "";
  let estimatedHoursSaved = 0;
  let estimatedRevenueLeak = "";

  if (totalScore <= 35) {
    levelTitle = "Level 1: Fragmented Operations";
    levelBadge = "CRITICAL BOTTLENECK";
    levelColor = "text-rose-400 border-rose-500/30 bg-rose-500/10";
    levelSummary = "Your business is currently burdened by heavy manual data re-entry, slow lead response times (>2 hours), and disconnected spreadsheets. Automating your core pipeline will unlock dramatic capacity.";
    estimatedHoursSaved = 24;
    estimatedRevenueLeak = "$45,000 – $95,000 / year";
  } else if (totalScore <= 65) {
    levelTitle = "Level 2: Partially Connected";
    levelBadge = "GROWTH BOTTLENECK";
    levelColor = "text-amber-400 border-amber-500/30 bg-amber-500/10";
    levelSummary = "You have established baseline digital tools, but fragile connectors and semi-manual handoffs cause operational drag and lost inquiries during peak traffic.";
    estimatedHoursSaved = 16;
    estimatedRevenueLeak = "$25,000 – $55,000 / year";
  } else if (totalScore <= 85) {
    levelTitle = "Level 3: Automated Operations";
    levelBadge = "ADVANCED PIPELINE";
    levelColor = "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
    levelSummary = "Your workflows are well structured. Adding autonomous AI agents and official WhatsApp Cloud API funnels will push your conversion velocity into the top 5% of your industry.";
    estimatedHoursSaved = 10;
    estimatedRevenueLeak = "$10,000 – $25,000 / year";
  } else {
    levelTitle = "Level 4: Autonomous Digital Enterprise";
    levelBadge = "TOP 1% INDUSTRY BENCHMARK";
    levelColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    levelSummary = "Exceptional automation maturity! Your focus should be fine-tuning multi-agent LLM swarms and custom private vector search to dominate your market category.";
    estimatedHoursSaved = 4;
    estimatedRevenueLeak = "< $5,000 / year";
  }

  const handleDownloadBlueprint = () => {
    soundFX.success();
    const content = `=====================================================
HP EDIT ENTERPRISE — AUTOMATION MATURITY SCORECARD
=====================================================
Generated: ${new Date().toLocaleString()}
Overall Score: ${totalScore} / 100
Classification: ${levelTitle}
Status: ${levelBadge}

EXECUTIVE SUMMARY:
${levelSummary}

PROJECTED IMPACT:
• Potential Time Saved: ${estimatedHoursSaved} Hours / Week
• Estimated Revenue Leak Prevented: ${estimatedRevenueLeak}

RECOMMENDED 30-DAY TRANSFORMATION ACTIONS:
1. Deploy Meta WhatsApp Cloud API with Sub-60s AI Lead Qualification.
2. Replace Spreadsheets with PostgreSQL + Centralized CRM Sync.
3. Install Real-Time Executive Alert Webhooks.

Schedule your Scoping Sprint: https://www.hpedit.com/book
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hpedit_automation_scorecard_${totalScore}pts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>60-Second Operational Diagnostic</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Digital Automation <span className="text-gradient-cyan">Maturity Scorecard</span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed">
          Evaluate your business operational speed, software integration depth, and AI readiness. Get an instant score and custom engineering roadmap.
        </p>
      </div>

      {!isCompleted ? (
        /* Quiz Flow */
        <div className="max-w-3xl mx-auto rounded-3xl glass-panel border border-white/10 p-6 sm:p-10 space-y-8 shadow-2xl">
          {/* Step Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold">
                Question {currentStep + 1} of {QUESTIONS.length}
              </span>
              <span className="text-gray-400">
                {QUESTIONS[currentStep].category}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Question */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {QUESTIONS[currentStep].question}
            </h2>

            <div className="grid grid-cols-1 gap-3.5">
              {QUESTIONS[currentStep].options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(opt.points)}
                  className="p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-left transition-all group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {opt.text}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results Breakdown */
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-10 space-y-8 shadow-2xl animate-in zoom-in-95">
          {/* Result Score Banner */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="space-y-2 text-center md:text-left">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${levelColor}`}>
                {levelBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{levelTitle}</h2>
              <p className="text-xs text-gray-300 font-medium max-w-xl leading-relaxed">
                {levelSummary}
              </p>
            </div>

            {/* Score Ring */}
            <div className="p-6 rounded-3xl bg-black/40 border border-cyan-500/30 text-center shrink-0 min-w-[170px]">
              <span className="text-xs font-mono text-gray-400 uppercase">Maturity Score</span>
              <div className="text-5xl font-black text-gradient-cyan my-1">{totalScore}</div>
              <span className="text-xs font-mono text-gray-400">out of 100 pts</span>
            </div>
          </div>

          {/* Metric Projection Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl luxury-card border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                <Clock className="w-4 h-4" />
                <span>Recoverable Capacity</span>
              </div>
              <div className="text-3xl font-black text-white font-mono">
                +{estimatedHoursSaved} Hours / wk
              </div>
              <p className="text-xs text-gray-300">
                Eliminated manual data entry, spreadsheet copy-pasting, and repetitive tasks.
              </p>
            </div>

            <div className="p-5 rounded-2xl luxury-card border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
                <DollarSign className="w-4 h-4" />
                <span>Annual Revenue Leak Prevented</span>
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {estimatedRevenueLeak}
              </div>
              <p className="text-xs text-gray-300">
                Gained by reducing lead response latency from hours down to sub-60 seconds.
              </p>
            </div>
          </div>

          {/* Action Suite & CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold flex items-center gap-1.5 transition-colors w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Diagnostic</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              <button
                type="button"
                onClick={handleDownloadBlueprint}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white text-xs font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Executive Plan (TXT)</span>
              </button>

              <Link
                href={`/book?topic=${encodeURIComponent(`Automation Roadmap: ${totalScore} Score Level`)}`}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-2 transition-all shadow-glow-cyan/20 w-full sm:w-auto justify-center"
              >
                <span>Book 15-Min Scoping Sprint</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
