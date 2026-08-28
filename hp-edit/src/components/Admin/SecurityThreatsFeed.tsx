"use client";

import { useState, useMemo } from "react";
import { SecurityEventData } from "@/types";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Bot,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Cpu,
  Eye,
  Server,
  Download,
  Search,
  Archive,
  ArchiveRestore,
  FileSpreadsheet,
  FileCode,
  Filter
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";
import { archiveSecurityEventAction, unarchiveSecurityEventAction } from "@/lib/actions";

interface SecurityThreatsFeedProps {
  initialThreats: SecurityEventData[];
}

export default function SecurityThreatsFeed({ initialThreats }: SecurityThreatsFeedProps) {
  const [threats, setThreats] = useState<SecurityEventData[]>(initialThreats);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "ARCHIVED" | "ALL">("ACTIVE");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST">("NEWEST");
  const [archivingId, setArchivingId] = useState<string | null>(null);

  const filteredThreats = useMemo(() => {
    return threats
      .filter((t) => {
        if (statusFilter === "ACTIVE" && t.isArchived) return false;
        if (statusFilter === "ARCHIVED" && !t.isArchived) return false;

        if (typeFilter !== "ALL" && t.type !== typeFilter) return false;

        if (search.trim()) {
          const q = search.toLowerCase();
          const matchesType = t.type.toLowerCase().includes(q);
          const matchesDetails = t.details.toLowerCase().includes(q);
          const matchesIp = (t.ipHash || "").toLowerCase().includes(q);
          if (!matchesType && !matchesDetails && !matchesIp) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }, [threats, search, typeFilter, statusFilter, sortBy]);

  const handleToggleArchive = async (id: string, isCurrentlyArchived: boolean) => {
    soundFX.click();
    setArchivingId(id);

    try {
      if (isCurrentlyArchived) {
        await unarchiveSecurityEventAction(id);
        setThreats((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isArchived: false } : t))
        );
      } else {
        await archiveSecurityEventAction(id);
        setThreats((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isArchived: true } : t))
        );
      }
    } catch {
      alert("Failed to toggle threat archival.");
    } finally {
      setArchivingId(null);
    }
  };

  const handleExportCsv = () => {
    soundFX.success();
    const headers = ["Timestamp", "Threat Type", "Details", "IP Hash", "Status"];
    const rows = filteredThreats.map((t) => [
      `"${new Date(t.createdAt).toISOString()}"`,
      `"${t.type}"`,
      `"${t.details.replace(/"/g, '""')}"`,
      `"${t.ipHash || "N/A"}"`,
      `"${t.isArchived ? "ARCHIVED" : "ACTIVE"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `security_threats_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    soundFX.success();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredThreats, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `security_threats_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Threat Shield Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Bot Shield, Spam Traps &amp; Cyber Defense Center</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Active telemetry against automated scrapers, form spammers, XSS injections, and brute-force bots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Security Defense Grid (4 Bento Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Invisible Bot Honeypot</span>
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white">Zero-Friction Trap</div>
          <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Spam bots auto-defused</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">IP Sliding Rate Limiter</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white">Adaptive Firewall</div>
          <div className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>DDoS &amp; flood throttling active</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">XSS &amp; Injection Sanitizer</span>
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold text-white">Zero-Trust I/O</div>
          <div className="text-[10px] text-purple-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>HTML &amp; SQL injection stripped</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Stealth Cloaking</span>
            <Server className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-white">No-Index Armor</div>
          <div className="text-[10px] text-rose-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Crawlers &amp; bots blocked</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search threats by type, IP hash, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-cyber-900 border border-white/10 text-xs text-gray-200 font-semibold focus:border-cyan-400 focus:outline-none"
          >
            <option value="ALL">All Threat Types</option>
            <option value="HONEYPOT_TRIGGER">Honeypot Trigger</option>
            <option value="RATE_LIMIT_BLOCKED">Rate Limit Blocked</option>
            <option value="XSS_ATTEMPT_BLOCKED">XSS Attempt Blocked</option>
            <option value="BOT_REJECTED">Bot Scraper Blocked</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ACTIVE" | "ARCHIVED" | "ALL")}
            className="w-full px-3 py-2 rounded-xl bg-cyber-900 border border-white/10 text-xs text-gray-200 font-semibold focus:border-cyan-400 focus:outline-none"
          >
            <option value="ACTIVE">Active Threat Logs</option>
            <option value="ARCHIVED">Archived Logs</option>
            <option value="ALL">All Records</option>
          </select>
        </div>
      </div>

      {/* Live Threat Incident Feed */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Cyber Threat Defense Feed ({filteredThreats.length})</span>
          </h3>
          <span className="text-xs text-gray-300 font-mono font-medium">
            Immutable Security Telemetry
          </span>
        </div>

        <div className="divide-y divide-white/5 text-xs">
          {filteredThreats.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs font-semibold">
              No threat incidents found matching the selected filter.
            </div>
          ) : (
            filteredThreats.map((t) => (
              <div
                key={t.id}
                className={`py-3.5 flex items-center justify-between gap-4 transition-colors ${
                  t.isArchived ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      t.type.includes("HONEYPOT")
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        : t.type.includes("RATE_LIMIT")
                        ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                        : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono text-sm">{t.type}</span>
                      {t.isArchived && (
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="text-gray-200 text-xs mt-0.5 leading-relaxed">{t.details}</p>
                    <div className="flex items-center gap-3 text-xs font-mono text-gray-400 mt-1">
                      <span>IP Hash: {t.ipHash || "Masked"}</span>
                      <span>•</span>
                      <span>{new Date(t.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={archivingId === t.id}
                    onClick={() => handleToggleArchive(t.id, !!t.isArchived)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      t.isArchived
                        ? "bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30"
                        : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/10"
                    }`}
                    title={t.isArchived ? "Unarchive Threat Record" : "Archive Threat Record"}
                  >
                    {t.isArchived ? (
                      <ArchiveRestore className="w-3.5 h-3.5" />
                    ) : (
                      <Archive className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
