"use client";

import { useState } from "react";
import { VisitorActivityData } from "@/types";
import {
  Activity,
  Globe,
  Smartphone,
  Laptop,
  Calculator,
  Bot,
  MessageSquare,
  FileText,
  Clock,
  Filter,
  RefreshCw
} from "lucide-react";

interface LiveActivityFeedProps {
  initialActivities: VisitorActivityData[];
}

export default function LiveActivityFeed({ initialActivities }: LiveActivityFeedProps) {
  const [activities, setActivities] = useState<VisitorActivityData[]>(initialActivities);
  const [filterType, setFilterType] = useState<string>("ALL");

  const filtered = filterType === "ALL"
    ? activities
    : activities.filter((a) => a.eventType === filterType);

  const getEventBadge = (type: string) => {
    switch (type) {
      case "ESTIMATOR_CALC":
        return { label: "Scope Estimator Run", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30", icon: Calculator };
      case "AI_DEMO_RUN":
        return { label: "AI Agent Simulator", color: "bg-purple-500/10 text-purple-400 border-purple-500/30", icon: Bot };
      case "WHATSAPP_CLICK":
        return { label: "WhatsApp Connect", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30", icon: MessageSquare };
      case "PDF_DOWNLOAD":
        return { label: "PDF Proposal Download", color: "bg-amber-500/10 text-amber-400 border-amber-500/30", icon: FileText };
      case "FORM_SUBMIT":
        return { label: "Discovery Inquiry", color: "bg-rose-500/10 text-rose-400 border-rose-500/30", icon: Globe };
      default:
        return { label: "Page View", color: "bg-blue-500/10 text-blue-400 border-blue-500/30", icon: Globe };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Live Customer Activity &amp; Telemetry Radar</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time tracking of page visits, calculator configurations, AI simulator runs, and conversions.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
          {[
            { id: "ALL", label: "All Events" },
            { id: "ESTIMATOR_CALC", label: "Estimator" },
            { id: "AI_DEMO_RUN", label: "AI Simulator" },
            { id: "WHATSAPP_CLICK", label: "WhatsApp" },
            { id: "PDF_DOWNLOAD", label: "PDFs" },
            { id: "PAGE_VIEW", label: "Visits" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterType === f.id
                  ? "bg-cyan-500 text-gray-950 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl glass-panel border border-white/10 text-center space-y-3">
          <Activity className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-sm font-bold text-gray-400">Telemetry Stream Initialized</h3>
          <p className="text-xs text-gray-500">
            Real-time customer clicks and page interactions will stream here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const badge = getEventBadge(item.eventType);
            const Icon = badge.icon;
            const isMobile = item.device === "Mobile";

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-cyan-500/30 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 shrink-0 border border-white/10">
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">{item.path}</span>
                    </div>

                    {item.details && (
                      <div className="text-[11px] text-gray-300 font-mono line-clamp-1">
                        {item.details}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 shrink-0">
                  <div className="flex items-center gap-1.5 text-[11px] bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                    {isMobile ? <Smartphone className="w-3.5 h-3.5 text-purple-400" /> : <Laptop className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{item.device || "Desktop"} • {item.os || "Windows"}</span>
                  </div>

                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
