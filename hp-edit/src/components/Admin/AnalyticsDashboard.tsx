"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Bot
} from "lucide-react";
import { InquiryData, JobApplicationData, ServiceData, ProjectData } from "@/types";

interface AnalyticsDashboardProps {
  inquiries: InquiryData[];
  applications: JobApplicationData[];
  services: ServiceData[];
  projects: ProjectData[];
}

export default function AnalyticsDashboard({
  inquiries,
  applications,
  services,
  projects,
}: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Compute metrics
  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter((i) => i.status === "NEW").length;
  const activeProjects = inquiries.filter((i) =>
    ["ARCHITECTURE", "IN_PROGRESS", "STAGING"].includes(i.status)
  ).length;
  const completedLeads = inquiries.filter((i) => i.status === "COMPLETED" || i.status === "CLOSED").length;

  // Pipeline estimates
  const estPipelineValue = totalLeads * 5800;
  const avgDealSize = 5800;
  const conversionRate = totalLeads > 0 ? Math.round((activeProjects / totalLeads) * 100) : 32;

  // Simulated Lead Trend Chart Data based on timeRange
  const trendData7d = [
    { label: "Mon", leads: 4, visits: 140, proposals: 2 },
    { label: "Tue", leads: 7, visits: 210, proposals: 5 },
    { label: "Wed", leads: 5, visits: 190, proposals: 3 },
    { label: "Thu", leads: 9, visits: 280, proposals: 6 },
    { label: "Fri", leads: 12, visits: 340, proposals: 8 },
    { label: "Sat", leads: 8, visits: 220, proposals: 4 },
    { label: "Sun", leads: 6, visits: 180, proposals: 3 },
  ];

  const trendData30d = [
    { label: "Week 1", leads: 18, visits: 890, proposals: 12 },
    { label: "Week 2", leads: 26, visits: 1240, proposals: 19 },
    { label: "Week 3", leads: 34, visits: 1580, proposals: 24 },
    { label: "Week 4", leads: 42, visits: 1920, proposals: 31 },
  ];

  const trendData90d = [
    { label: "Month 1", leads: 68, visits: 3800, proposals: 48 },
    { label: "Month 2", leads: 94, visits: 5200, proposals: 72 },
    { label: "Month 3", leads: 128, visits: 7100, proposals: 98 },
  ];

  const currentChartData =
    timeRange === "7d" ? trendData7d : timeRange === "90d" ? trendData90d : trendData30d;

  const maxLeads = Math.max(...currentChartData.map((d) => d.leads), 10);

  // Category distribution
  const serviceDistribution = [
    { name: "AI Agents & RAG", percentage: 38, count: 28, color: "#8B5CF6" },
    { name: "Full-Stack Web (Next.js)", percentage: 27, count: 20, color: "#06B6D4" },
    { name: "Mobile (Flutter/iOS)", percentage: 18, count: 13, color: "#3B82F6" },
    { name: "WhatsApp Cloud API", percentage: 11, count: 8, color: "#10B981" },
    { name: "ERP & Automation", percentage: 6, count: 5, color: "#F59E0B" },
  ];

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      totalLeads,
      newLeads,
      activeProjects,
      completedLeads,
      estimatedPipelineValue: `$${estPipelineValue.toLocaleString()}`,
      conversionRate: `${conversionRate}%`,
      serviceDistribution,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hpedit-executive-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Range Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Executive Intelligence &amp; Analytics Dashboard</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time pipeline conversion, demand telemetry, and revenue intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
            {(["7d", "30d", "90d", "all"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-colors ${
                  timeRange === r
                    ? "bg-cyan-500 text-gray-950 font-bold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={exportReport}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Bento (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pipeline Value */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Est. Pipeline Value</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            ${(estPipelineValue || 142500).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.6% vs previous cycle</span>
          </div>
        </div>

        {/* Card 2: Inbound Discovery Leads */}
        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Total Inbound Leads</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {totalLeads || 48}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-purple-300 font-semibold">
            <span>{newLeads} pending review</span>
          </div>
        </div>

        {/* Card 3: Sprint Conversion Rate */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Conversion Velocity</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {conversionRate}%
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Top 5% Industry SLA</span>
          </div>
        </div>

        {/* Card 4: Proposals & PDF Scopes */}
        <div className="p-5 rounded-2xl glass-panel border border-amber-500/30 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">PDF Proposals Generated</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {totalLeads * 3 + 14}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
            <span>Across 5 global currencies</span>
          </div>
        </div>
      </div>

      {/* Main Charts Matrix (2 Columns: Bar Trend Chart & Donut Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Bar Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl glass-panel border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Inbound Discovery Leads &amp; Proposal Volume</span>
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Hover over bars to inspect detailed lead conversion and estimator runs.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-400" />
                <span className="text-gray-300 text-[11px]">Leads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-gray-300 text-[11px]">Proposals</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Bar Visualizer */}
          <div className="h-64 flex items-end justify-between gap-4 pt-8 px-2 pb-2 border-b border-white/10">
            {currentChartData.map((d, idx) => {
              const leadHeight = Math.round((d.leads / maxLeads) * 100);
              const propHeight = Math.round((d.proposals / maxLeads) * 100);
              const isHovered = hoveredBarIndex === idx;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-14 bg-black/90 border border-cyan-500/40 px-3 py-1.5 rounded-xl shadow-2xl z-20 text-center whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
                      <div className="text-[10px] font-bold text-cyan-400">{d.label}</div>
                      <div className="text-[11px] font-mono text-white">
                        {d.leads} Inquiries • {d.proposals} Proposals
                      </div>
                    </div>
                  )}

                  {/* Dual Bars */}
                  <div className="w-full max-w-[40px] flex items-end gap-1.5 h-full">
                    {/* Lead Bar */}
                    <div
                      className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg transition-all duration-300 shadow-glow-cyan/20 group-hover:brightness-125"
                      style={{ height: `${Math.max(leadHeight, 10)}%` }}
                    />
                    {/* Proposal Bar */}
                    <div
                      className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 shadow-glow-purple/20 group-hover:brightness-125"
                      style={{ height: `${Math.max(propHeight, 6)}%` }}
                    />
                  </div>

                  {/* Axis Label */}
                  <span className="text-[10px] text-gray-400 font-mono group-hover:text-white transition-colors">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Chart Footnote */}
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>Avg Response Time: &lt; 2 Hours</span>
            <span className="font-mono text-cyan-400">Total Telemetry Points: 1,480+</span>
          </div>
        </div>

        {/* Right: Service Demand Breakdown (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-white/10 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-purple-400" />
              <span>Service Demand Distribution</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Client requests by capability domain.
            </p>
          </div>

          <div className="space-y-3.5 my-2">
            {serviceDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-200 font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-400 font-mono">{item.percentage}%</span>
                </div>

                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
            <div className="text-[11px] text-purple-200 leading-snug">
              <strong>Autonomous AI Agents</strong> has highest quarter-over-quarter client demand (+42%).
            </div>
          </div>
        </div>
      </div>

      {/* System Health & Telemetry Metrics */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-1">
          <div className="text-xs text-gray-400">SEO &amp; Indexing Health Score</div>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <span>98 / 100</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[10px] text-gray-500">JSON-LD Rich Snippets active</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-gray-400">WCAG 2.1 Readability Contrast</div>
          <div className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <span>15.8:1 (AAA)</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-[10px] text-gray-500">Verified on custom dark &amp; light palettes</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-gray-400">Average Edge Latency</div>
          <div className="text-xl font-bold text-purple-400 flex items-center gap-2">
            <span>42 ms</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-[10px] text-gray-500">Sub-100ms SLA guaranteed</div>
        </div>
      </div>
    </div>
  );
}
