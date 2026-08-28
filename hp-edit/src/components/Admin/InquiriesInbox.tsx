"use client";

import { useState, useMemo } from "react";
import { InquiryData } from "@/types";
import {
  Inbox,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  MessageSquare,
  Mail,
  Filter,
  DollarSign,
  Download,
  Calendar,
  Search,
  ArrowUpDown,
  Layers,
  ChevronDown,
  Phone
} from "lucide-react";
import { updateInquiryStatus, deleteInquiry } from "@/lib/actions";
import WhatsAppIcon from "../WhatsAppIcon";
import LeadMessagingModal from "./LeadMessagingModal";
import InquiryDetailModal from "./InquiryDetailModal";
import { soundFX } from "../CyberAudioFx";

interface InquiriesInboxProps {
  initialInquiries: InquiryData[];
}

export default function InquiriesInbox({ initialInquiries }: InquiriesInboxProps) {
  const [inquiries, setInquiries] = useState<InquiryData[]>(initialInquiries);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [serviceFilter, setServiceFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name_asc" | "name_desc">("newest");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMessagingInquiry, setActiveMessagingInquiry] = useState<InquiryData | null>(null);
  const [selectedInquiryForDetails, setSelectedInquiryForDetails] = useState<InquiryData | null>(null);

  // Filter & Sort Pipeline
  const filteredAndSorted = useMemo(() => {
    return inquiries
      .filter((item) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesEmail = item.email.toLowerCase().includes(q);
          const matchesPhone = (item.phone || "").toLowerCase().includes(q);
          const matchesMsg = item.message.toLowerCase().includes(q);
          const matchesService = item.serviceType.toLowerCase().includes(q);
          if (!matchesName && !matchesEmail && !matchesPhone && !matchesMsg && !matchesService) {
            return false;
          }
        }

        // Status Filter
        if (statusFilter !== "ALL" && item.status !== statusFilter) {
          return false;
        }

        // Service Filter
        if (serviceFilter !== "ALL" && !item.serviceType.toLowerCase().includes(serviceFilter.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "name_desc") {
          return b.name.localeCompare(a.name);
        }
        return 0;
      });
  }, [inquiries, searchQuery, statusFilter, serviceFilter, sortBy]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } catch {
      alert("Failed to delete inquiry.");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAndSorted.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSorted.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const exportToCsv = (itemsToExport = filteredAndSorted) => {
    if (itemsToExport.length === 0) {
      alert("No leads available to export.");
      return;
    }

    const headers = ["ID", "Date", "Name", "Email", "Phone", "Service Type", "Budget", "Timeline", "Status", "Message"];
    const rows = itemsToExport.map((i) => [
      `"${i.id}"`,
      `"${new Date(i.createdAt).toISOString()}"`,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.email.replace(/"/g, '""')}"`,
      `"${(i.phone || "").replace(/"/g, '""')}"`,
      `"${(i.serviceType || "").replace(/"/g, '""')}"`,
      `"${(i.projectBudget || "").replace(/"/g, '""')}"`,
      `"${(i.timeline || "").replace(/"/g, '""')}"`,
      `"${i.status}"`,
      `"${i.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hpedit-leads-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Inbox className="w-4 h-4 text-cyan-400" />
            <span>Discovery Leads &amp; Pipeline CRM</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage inquiries, project budgets, and communicate directly via WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => exportToCsv(inquiries.filter((i) => selectedIds.includes(i.id)))}
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={() => exportToCsv(filteredAndSorted)}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter, Search & Sort Panel */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Field */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
          >
            <option value="ALL" className="bg-cyber-950 text-white">Status: All Leads</option>
            <option value="NEW" className="bg-cyber-950 text-white">Status: New</option>
            <option value="ARCHITECTURE" className="bg-cyber-950 text-white">Status: Architecture Phase</option>
            <option value="IN_PROGRESS" className="bg-cyber-950 text-white">Status: In Progress</option>
            <option value="STAGING" className="bg-cyber-950 text-white">Status: Staging Review</option>
            <option value="COMPLETED" className="bg-cyber-950 text-white">Status: Completed</option>
            <option value="CLOSED" className="bg-cyber-950 text-white">Status: Closed</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Service Domain Filter */}
        <div className="relative">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
          >
            <option value="ALL" className="bg-cyber-950 text-white">Service: All Domains</option>
            <option value="AI" className="bg-cyber-950 text-white">Service: AI Agents &amp; RAG</option>
            <option value="Web" className="bg-cyber-950 text-white">Service: Next.js &amp; Web Apps</option>
            <option value="Mobile" className="bg-cyber-950 text-white">Service: Mobile &amp; Flutter</option>
            <option value="WhatsApp" className="bg-cyber-950 text-white">Service: WhatsApp Cloud API</option>
            <option value="Automation" className="bg-cyber-950 text-white">Service: Automation &amp; ERP</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sort Selector */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 appearance-none cursor-pointer"
          >
            <option value="newest" className="bg-cyber-950 text-white">Sort: Newest First</option>
            <option value="oldest" className="bg-cyber-950 text-white">Sort: Oldest First</option>
            <option value="name_asc" className="bg-cyber-950 text-white">Sort: Name (A-Z)</option>
            <option value="name_desc" className="bg-cyber-950 text-white">Sort: Name (Z-A)</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Leads Results Count & Select All Bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedIds.length > 0 && selectedIds.length === filteredAndSorted.length}
            onChange={toggleSelectAll}
            className="rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-0 cursor-pointer"
          />
          <span>Select All ({filteredAndSorted.length} Matching Leads)</span>
        </div>
        <span>Showing {filteredAndSorted.length} of {inquiries.length} Total</span>
      </div>

      {/* Leads List */}
      {filteredAndSorted.length === 0 ? (
        <div className="p-12 rounded-2xl glass-panel border border-white/10 text-center space-y-3">
          <Inbox className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-sm font-bold text-gray-400">No Inquiries Matching Filter</h3>
          <p className="text-xs text-gray-500">
            Adjust your search query, status, or domain filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSorted.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            const rawPhone = item.phone ? item.phone.replace(/[^0-9]/g, "") : "";
            const waReplyUrl = rawPhone
              ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(
                  `Hello ${item.name}! Reaching out from HP Edit Enterprise regarding your project inquiry for "${item.serviceType}".`
                )}`
              : null;

            return (
              <div
                key={item.id}
                className={`p-6 rounded-2xl glass-panel border space-y-4 transition-all duration-200 ${
                  isSelected ? "border-cyan-500 bg-cyan-500/5" : "border-white/10 hover:border-cyan-500/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(item.id)}
                      className="rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-0 cursor-pointer"
                    />

                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center text-sm border border-cyan-500/20">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        <span className="text-[10px] font-mono text-gray-500">#{item.id.slice(0, 8)}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span>{item.email}</span>
                        {item.phone && <span>• {item.phone}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none ${
                        item.status === "NEW"
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : item.status === "ARCHITECTURE"
                          ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                          : item.status === "IN_PROGRESS"
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                          : item.status === "STAGING"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      <option value="NEW" className="bg-cyber-950 text-white">NEW</option>
                      <option value="ARCHITECTURE" className="bg-cyber-950 text-white">ARCHITECTURE</option>
                      <option value="IN_PROGRESS" className="bg-cyber-950 text-white">IN PROGRESS</option>
                      <option value="STAGING" className="bg-cyber-950 text-white">STAGING REVIEW</option>
                      <option value="COMPLETED" className="bg-cyber-950 text-white">COMPLETED</option>
                      <option value="CLOSED" className="bg-cyber-950 text-white">CLOSED</option>
                    </select>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scope Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-gray-400 block uppercase">Requested Service</span>
                    <span className="font-semibold text-white">{item.serviceType || "Custom Software"}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-gray-400 block uppercase">Budget Tier</span>
                    <span className="font-semibold text-emerald-400">{item.projectBudget || "Standard Range"}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-[10px] text-gray-400 block uppercase">Target Horizon</span>
                    <span className="font-semibold text-cyan-400">{item.timeline || "2-4 Weeks"}</span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-xs text-gray-300 bg-black/30 p-3.5 rounded-xl border border-white/5 leading-relaxed">
                  {item.message}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-gray-400 font-mono">
                  <span>Received: {new Date(item.createdAt).toLocaleString()}</span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundFX.click();
                        setSelectedInquiryForDetails(item);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="View full enquiry dossier and scoping details"
                    >
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View Dossier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.click();
                        setActiveMessagingInquiry(item);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Message Lead</span>
                    </button>

                    {waReplyUrl && (
                      <a
                        href={waReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    <a
                      href={`mailto:${item.email}?subject=HP Edit Enterprise — Inquiry Response for ${item.serviceType}`}
                      className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold flex items-center gap-1.5 border border-white/10"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inquiry Full Details / Lightbox Modal */}
      {selectedInquiryForDetails && (
        <InquiryDetailModal
          inquiry={selectedInquiryForDetails}
          onClose={() => setSelectedInquiryForDetails(null)}
          onOpenOutreach={(inq) => {
            setSelectedInquiryForDetails(null);
            setActiveMessagingInquiry(inq);
          }}
          onStageUpdated={(inqId, newStage) => {
            setInquiries((prev) =>
              prev.map((i) => (i.id === inqId ? { ...i, pipelineStage: newStage } : i))
            );
          }}
        />
      )}

      {/* Multi-Channel Lead Messaging Modal */}
      {activeMessagingInquiry && (
        <LeadMessagingModal
          inquiry={activeMessagingInquiry}
          onClose={() => setActiveMessagingInquiry(null)}
        />
      )}
    </div>
  );
}
