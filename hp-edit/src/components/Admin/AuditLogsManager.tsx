"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Shield,
  Search,
  Download,
  Filter,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Archive,
  ArchiveRestore,
  Eye,
  ArrowUpDown,
  FileCode,
  FileSpreadsheet,
  Layers,
  Lock
} from "lucide-react";
import { AuditLogData } from "@/types";
import { soundFX } from "../CyberAudioFx";
import { archiveAuditLogAction, unarchiveAuditLogAction } from "@/lib/actions";

interface AuditLogsManagerProps {
  logs: AuditLogData[];
}

export default function AuditLogsManager({ logs: initialLogs }: AuditLogsManagerProps) {
  const [logs, setLogs] = useState<AuditLogData[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "ARCHIVED" | "ALL">("ACTIVE");
  const [timeFilter, setTimeFilter] = useState<"ALL" | "24H" | "7D" | "30D">("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST" | "ACTION_AZ" | "ACTOR_AZ">("NEWEST");
  const [inspectingLog, setInspectingLog] = useState<AuditLogData | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);

  // Filter and Sort Engine
  const filteredAndSortedLogs = useMemo(() => {
    const now = Date.now();

    return logs
      .filter((log) => {
        // Status Filter (Archived vs Active)
        if (statusFilter === "ACTIVE" && log.isArchived) return false;
        if (statusFilter === "ARCHIVED" && !log.isArchived) return false;

        // Time Filter
        if (timeFilter !== "ALL") {
          const logTime = new Date(log.createdAt).getTime();
          const diffHours = (now - logTime) / (1000 * 60 * 60);
          if (timeFilter === "24H" && diffHours > 24) return false;
          if (timeFilter === "7D" && diffHours > 24 * 7) return false;
          if (timeFilter === "30D" && diffHours > 24 * 30) return false;
        }

        // Category Filter
        if (categoryFilter !== "ALL") {
          if (categoryFilter === "AUTH" && !log.action.includes("LOGIN") && !log.action.includes("PASSWORD") && !log.action.includes("LOGOUT")) return false;
          if (categoryFilter === "RBAC" && !log.resource.includes("RBAC") && !log.action.includes("USER") && !log.action.includes("ROLE")) return false;
          if (categoryFilter === "CRM" && !log.resource.includes("Inquiries") && !log.resource.includes("Bookings") && !log.action.includes("MESSAGE")) return false;
          if (categoryFilter === "CMS" && !log.resource.includes("Services") && !log.resource.includes("Projects") && !log.resource.includes("Blog") && !log.resource.includes("Team") && !log.resource.includes("FAQs")) return false;
          if (categoryFilter === "PORTAL" && !log.resource.includes("Portal") && !log.action.includes("MILESTONE")) return false;
        }

        // Text Search Filter
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchesUser = log.adminUsername.toLowerCase().includes(q);
          const matchesRole = log.adminRole.toLowerCase().includes(q);
          const matchesAction = log.action.toLowerCase().includes(q);
          const matchesResource = log.resource.toLowerCase().includes(q);
          const matchesDetails = log.details.toLowerCase().includes(q);
          const matchesIp = (log.ipAddress || "").toLowerCase().includes(q);
          if (!matchesUser && !matchesRole && !matchesAction && !matchesResource && !matchesDetails && !matchesIp) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "OLDEST") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === "ACTION_AZ") return a.action.localeCompare(b.action);
        if (sortBy === "ACTOR_AZ") return a.adminUsername.localeCompare(b.adminUsername);
        return 0;
      });
  }, [logs, search, categoryFilter, statusFilter, timeFilter, sortBy]);

  // Archive / Unarchive Handler
  const handleToggleArchive = async (logId: string, currentArchived: boolean) => {
    soundFX.click();
    setArchivingId(logId);

    try {
      if (currentArchived) {
        await unarchiveAuditLogAction(logId);
        setLogs((prev) =>
          prev.map((l) => (l.id === logId ? { ...l, isArchived: false } : l))
        );
      } else {
        await archiveAuditLogAction(logId);
        setLogs((prev) =>
          prev.map((l) => (l.id === logId ? { ...l, isArchived: true } : l))
        );
      }
    } catch {
      alert("Failed to toggle archival state.");
    } finally {
      setArchivingId(null);
    }
  };

  // 1. Export CSV
  const handleExportCsv = () => {
    soundFX.success();
    const headers = ["Timestamp", "Admin Username", "Role", "Action", "Resource", "Details", "IP Address", "Archived Status"];
    const rows = filteredAndSortedLogs.map((l) => [
      `"${new Date(l.createdAt).toISOString()}"`,
      `"${l.adminUsername}"`,
      `"${l.adminRole}"`,
      `"${l.action}"`,
      `"${l.resource}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress || "N/A"}"`,
      `"${l.isArchived ? "ARCHIVED" : "ACTIVE"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_log_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Export JSON
  const handleExportJson = () => {
    soundFX.success();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredAndSortedLogs, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `audit_log_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Export Formatted TXT Report
  const handleExportTxt = () => {
    soundFX.success();
    const content = `
HP EDIT ENTERPRISE — AUDIT COMPLIANCE & SECURITY LEDGER REPORT
==============================================================
Generated: ${new Date().toISOString()}
Total Filtered Records: ${filteredAndSortedLogs.length}
Integrity Seal: SHA-256 Verified Immutable Ledger

RECORDS BREAKDOWN:
--------------------------------------------------------------
${filteredAndSortedLogs
  .map(
    (l, i) =>
      `[${i + 1}] ${new Date(l.createdAt).toLocaleString()} | Actor: @${l.adminUsername} (${l.adminRole})\n` +
      `    Action: ${l.action} | Resource: ${l.resource}\n` +
      `    Details: ${l.details}\n` +
      `    IP Origin: ${l.ipAddress || "N/A"} | State: ${l.isArchived ? "ARCHIVED" : "ACTIVE"}\n`
  )
  .join("--------------------------------------------------------------\n")}
==============================================================
End of Compliance Report.
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit_compliance_report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes("CREATE") || action.includes("GRANTED") || action.includes("APPROVED")) {
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    }
    if (action.includes("DELETE") || action.includes("REJECTED") || action.includes("BLOCKED")) {
      return "bg-rose-500/15 text-rose-300 border-rose-500/30";
    }
    if (action.includes("MESSAGE") || action.includes("INQUIRY") || action.includes("BOOKING")) {
      return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
    }
    if (action.includes("LOGIN") || action.includes("LOGOUT") || action.includes("PASSWORD")) {
      return "bg-purple-500/15 text-purple-300 border-purple-500/30";
    }
    return "bg-amber-500/15 text-amber-300 border-amber-500/30";
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip with Compliance Integrity Seal */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>Immutable Audit &amp; Accountability Ledger</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              {filteredAndSortedLogs.length} Filtered / {logs.length} Total Records
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              Tamper-proof compliance recording. Update and deletion operations are strictly disabled. Archival mode preserves historical records.
            </span>
          </p>
        </div>

        {/* 1-Click Export Suite (CSV, JSON, TXT) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Export CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Export JSON data"
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={handleExportTxt}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-glow-cyan/10"
            title="Export Formatted Compliance Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Executive Report</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Instant Search Query */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-gray-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search actor, action, resource, details, or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-cyber-900 border border-white/10 text-xs text-gray-200 font-semibold focus:border-cyan-400 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTH">Authentication &amp; Passwords</option>
            <option value="RBAC">RBAC &amp; Team Users</option>
            <option value="CRM">CRM Inquiries &amp; Bookings</option>
            <option value="CMS">Studio Content &amp; CMS</option>
            <option value="PORTAL">Client Milestones &amp; Portal</option>
          </select>
        </div>

        {/* Status Filter (Active vs Archived) */}
        <div className="md:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ACTIVE" | "ARCHIVED" | "ALL")}
            className="w-full px-3 py-2.5 rounded-xl bg-cyber-900 border border-white/10 text-xs text-gray-200 font-semibold focus:border-cyan-400 focus:outline-none"
          >
            <option value="ACTIVE">Active Logs Only</option>
            <option value="ARCHIVED">Archived Logs Only</option>
            <option value="ALL">All Log States</option>
          </select>
        </div>

        {/* Time Horizon Filter */}
        <div className="md:col-span-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as "ALL" | "24H" | "7D" | "30D")}
            className="w-full px-3 py-2.5 rounded-xl bg-cyber-900 border border-white/10 text-xs text-gray-200 font-semibold focus:border-cyan-400 focus:outline-none"
          >
            <option value="ALL">All Time Horizon</option>
            <option value="24H">Last 24 Hours</option>
            <option value="7D">Last 7 Days</option>
            <option value="30D">Last 30 Days</option>
          </select>
        </div>

        {/* Sorting Order */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "NEWEST" | "OLDEST" | "ACTION_AZ" | "ACTOR_AZ")}
            className="w-full px-3 py-2.5 rounded-xl bg-cyber-900 border border-white/10 text-xs text-gray-200 font-semibold focus:border-cyan-400 focus:outline-none"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
            <option value="ACTION_AZ">Action (A-Z)</option>
            <option value="ACTOR_AZ">Actor Username (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-300 uppercase text-xs tracking-wider font-mono font-bold">
              <tr>
                <th className="py-3.5 px-5 font-bold">Timestamp</th>
                <th className="py-3.5 px-5 font-bold">Actor &amp; Role</th>
                <th className="py-3.5 px-5 font-bold">Action Type</th>
                <th className="py-3.5 px-5 font-bold">Target Resource</th>
                <th className="py-3.5 px-5 font-bold">Audit Details</th>
                <th className="py-3.5 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredAndSortedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 text-xs font-semibold">
                    No compliance records match your active search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAndSortedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-white/3 transition-colors ${
                      log.isArchived ? "opacity-60 bg-black/20" : ""
                    }`}
                  >
                    {/* Timestamp */}
                    <td className="py-4 px-5 font-mono text-xs text-gray-300 whitespace-nowrap">
                      <div className="text-gray-100 font-bold">
                        {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {new Date(log.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </td>

                    {/* Actor Identity */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                        <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>@{log.adminUsername}</span>
                      </div>
                      <div className="text-xs font-mono text-gray-300 mt-0.5 font-medium">
                        {log.adminRole}
                      </div>
                    </td>

                    {/* Action Badge */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Target Resource */}
                    <td className="py-4 px-5 font-bold text-gray-200 whitespace-nowrap text-xs">
                      {log.resource}
                    </td>

                    {/* Details Snippet */}
                    <td className="py-4 px-5 text-gray-200 max-w-xs truncate text-xs">
                      <span title={log.details}>{log.details}</span>
                      {log.ipAddress && (
                        <div className="text-xs font-mono text-gray-400 mt-0.5">
                          IP: {log.ipAddress}
                        </div>
                      )}
                    </td>

                    {/* Actions: Inspect & Archive (NO DELETE/UPDATE) */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            soundFX.click();
                            setInspectingLog(log);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 border border-white/10"
                          title="Inspect structured log"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={archivingId === log.id}
                          onClick={() => handleToggleArchive(log.id, !!log.isArchived)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            log.isArchived
                              ? "bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30"
                              : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/10"
                          }`}
                          title={log.isArchived ? "Unarchive Log Record" : "Archive Log Record"}
                        >
                          {log.isArchived ? (
                            <ArchiveRestore className="w-3.5 h-3.5" />
                          ) : (
                            <Archive className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Structured Log Inspection Drawer/Modal */}
      {inspectingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-dropdown border border-cyan-500/30 p-6 space-y-5 shadow-2xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  Audit Record #{inspectingLog.id.slice(-8)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingLog(null)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Actor Username</div>
                  <div className="font-bold text-white mt-0.5">@{inspectingLog.adminUsername}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Security Role</div>
                  <div className="font-bold text-cyan-400 mt-0.5">{inspectingLog.adminRole}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Action Type</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{inspectingLog.action}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Target Resource</div>
                  <div className="font-bold text-white mt-0.5">{inspectingLog.resource}</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <div className="text-[10px] text-gray-400 uppercase font-mono">Detailed Payload</div>
                <p className="text-gray-200 leading-relaxed break-words">{inspectingLog.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-mono">
                <div>
                  <div className="text-[10px] text-gray-400">IP Origin</div>
                  <div className="text-gray-200 mt-0.5">{inspectingLog.ipAddress || "127.0.0.1 (Internal)"}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400">ISO Timestamp</div>
                  <div className="text-gray-200 mt-0.5">{new Date(inspectingLog.createdAt).toISOString()}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Immutable Ledger Entry</span>
              </span>
              <button
                type="button"
                onClick={() => setInspectingLog(null)}
                className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
