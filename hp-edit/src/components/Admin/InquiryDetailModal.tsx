"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Calendar,
  Layers,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Printer,
  ChevronDown,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { InquiryData } from "@/types";
import { updateInquiryPipelineStageAction } from "@/lib/actions";
import { soundFX } from "../CyberAudioFx";
import WhatsAppIcon from "../WhatsAppIcon";

interface InquiryDetailModalProps {
  inquiry: InquiryData;
  onClose: () => void;
  onOpenOutreach?: (inquiry: InquiryData) => void;
  onStageUpdated?: (inquiryId: string, newStage: string) => void;
}

const STAGES = [
  { id: "NEW", label: "1. Inbound Leads", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  { id: "CONTACTED", label: "2. In Discovery", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  { id: "SCOPING", label: "3. Tech Scoping", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { id: "PROPOSAL_SENT", label: "4. Proposal Sent", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  { id: "CLOSED_WON", label: "5. Closed / Won", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { id: "ARCHIVED", label: "Archived", color: "bg-gray-500/20 text-gray-300 border-gray-500/40" },
];

export default function InquiryDetailModal({
  inquiry,
  onClose,
  onOpenOutreach,
  onStageUpdated,
}: InquiryDetailModalProps) {
  const [currentStage, setCurrentStage] = useState(inquiry.pipelineStage || inquiry.status || "NEW");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    soundFX.click();
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleStageChange = async (newStage: string) => {
    setIsUpdatingStage(true);
    try {
      soundFX.click();
      await updateInquiryPipelineStageAction(inquiry.id, newStage);
      setCurrentStage(newStage);
      soundFX.success();
      if (onStageUpdated) {
        onStageUpdated(inquiry.id, newStage);
      }
    } catch (err) {
      console.error("Failed to update stage:", err);
      soundFX.error();
    } finally {
      setIsUpdatingStage(false);
    }
  };

  const currentStageIndex = STAGES.findIndex((s) => s.id === currentStage);
  const rawPhone = inquiry.phone ? inquiry.phone.replace(/[^0-9]/g, "") : "";
  const waUrl = rawPhone
    ? `https://wa.me/${rawPhone}?text=${encodeURIComponent(
        `Hello ${inquiry.name}! Reaching out from HP Edit Enterprise regarding your project inquiry for "${inquiry.serviceType}".`
      )}`
    : null;

  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [generatedProposalText, setGeneratedProposalText] = useState("");

  const handleGenerateAiProposal = async () => {
    setIsGeneratingProposal(true);
    soundFX.click();

    // Parse pain points from inquiry message
    const hasStructured = inquiry.message.includes("🎯 IDENTIFIED OPERATIONAL PAIN POINTS") || inquiry.message.includes("• [Point ");
    const pointsList: string[] = [];
    let addNotes = "";

    if (hasStructured) {
      const parts = inquiry.message.split("📝 ADDITIONAL SCOPE & CONTEXT:");
      const painPointsBlock = parts[0] || "";
      addNotes = parts[1]?.trim() || "";

      const lines = painPointsBlock.split("\n");
      for (const line of lines) {
        const match = line.match(/^•\s*\[Point\s*\d+\]\s*(.*)$/);
        if (match && match[1]) {
          pointsList.push(match[1].trim());
        }
      }
    }

    try {
      const { generateAiProposalDraft } = await import("@/lib/actions");
      const res = await generateAiProposalDraft({
        inquiryId: inquiry.id,
        name: inquiry.name,
        serviceType: inquiry.serviceType,
        painPoints: pointsList,
        message: addNotes || inquiry.message,
        budget: inquiry.projectBudget || undefined,
        timeline: inquiry.timeline || undefined,
      });

      if (res.success && res.proposalMarkdown) {
        soundFX.success();
        setGeneratedProposalText(res.proposalMarkdown);
        setProposalModalOpen(true);
      } else {
        alert("Failed to generate AI proposal draft.");
      }
    } catch {
      alert("Error contacting proposal generator.");
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const handleDownloadProposal = () => {
    soundFX.click();
    const blob = new Blob([generatedProposalText], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HP_Edit_Proposal_${inquiry.name.replace(/\s+/g, "_")}_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-cyber-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl luxury-card border border-cyan-500/30 bg-cyber-900/95 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ENQUIRY #{inquiry.id.slice(-6).toUpperCase()}</span>
            </div>

            {/* Pipeline Stage Selector Dropdown */}
            <div className="relative">
              <select
                disabled={isUpdatingStage}
                value={currentStage}
                onChange={(e) => handleStageChange(e.target.value)}
                className={`text-xs font-mono font-bold px-3 py-1 pr-7 rounded-xl border focus:outline-none cursor-pointer transition-colors ${
                  STAGES.find((s) => s.id === currentStage)?.color || "bg-white/10 text-white border-white/20"
                }`}
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id} className="bg-cyber-950 text-white font-sans">
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-current absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Lead Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-extrabold text-lg flex items-center justify-center shadow-glow-cyan/20 shrink-0">
                {inquiry.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>{inquiry.name}</span>
                  <span title="Verified Inquiry Submission" className="inline-flex">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </span>
                </h3>
                <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5 font-mono">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span>Received: {new Date(inquiry.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Direct Channel Action Pills */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(inquiry.email, "email")}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
                title="Copy Email Address"
              >
                {copiedField === "email" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{inquiry.email}</span>
                  </>
                )}
              </button>

              {inquiry.phone && (
                <button
                  type="button"
                  onClick={() => handleCopy(inquiry.phone || "", "phone")}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  title="Copy Phone Number"
                >
                  {copiedField === "phone" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{inquiry.phone}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Project Scoping & Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-mono text-gray-400 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>Requested Service</span>
              </div>
              <div className="font-bold text-white text-sm">
                {inquiry.serviceType || "Custom Software"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-mono text-gray-400 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                <span>Budget Tier</span>
              </div>
              <div className="font-bold text-emerald-300 text-sm font-mono">
                {inquiry.projectBudget || "Standard Tier"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[10px] uppercase font-mono text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Target Horizon</span>
              </div>
              <div className="font-bold text-purple-300 text-sm font-mono">
                {inquiry.timeline || "2-4 Weeks"}
              </div>
            </div>
          </div>

          {/* Pain Points & Narrative Breakdown */}
          {(() => {
            const hasStructuredPainPoints = inquiry.message.includes("🎯 IDENTIFIED OPERATIONAL PAIN POINTS") || inquiry.message.includes("• [Point ");
            let painPointsList: string[] = [];
            let additionalNotes = "";

            if (hasStructuredPainPoints) {
              const parts = inquiry.message.split("📝 ADDITIONAL SCOPE & CONTEXT:");
              const painPointsBlock = parts[0] || "";
              additionalNotes = parts[1]?.trim() || "";

              const lines = painPointsBlock.split("\n");
              for (const line of lines) {
                const match = line.match(/^•\s*\[Point\s*\d+\]\s*(.*)$/);
                if (match && match[1]) {
                  painPointsList.push(match[1].trim());
                }
              }
            }

            if (painPointsList.length > 0) {
              return (
                <div className="space-y-4">
                  {/* Pain Points List Card */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                      <span className="font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Diagnosed Operational Pain Points ({painPointsList.length})</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleCopy(painPointsList.map((p, i) => `${i + 1}. ${p}`).join("\n"), "all_pain_points")}
                        className="text-gray-400 hover:text-white flex items-center gap-1 text-xs transition-colors"
                        title="Copy all pain points"
                      >
                        {copiedField === "all_pain_points" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied All</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy List</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 p-3 rounded-2xl bg-black/40 border border-white/10 max-h-[300px] overflow-y-auto">
                      {painPointsList.map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors group"
                        >
                          <div className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/20">
                            {String(idx + 1).padStart(2, "0")}
                          </div>

                          <div className="flex-1 min-w-0 text-xs text-gray-200 leading-relaxed font-sans select-text">
                            {point}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopy(point, `point_${idx}`)}
                            className="p-1 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            title="Copy single pain point"
                          >
                            {copiedField === `point_${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Context Box if present */}
                  {additionalNotes && (
                    <div className="space-y-1.5">
                      <span className="font-bold uppercase tracking-wider text-gray-400 text-xs flex items-center gap-1.5 font-mono px-1">
                        <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                        <span>Additional Technical Context &amp; Notes</span>
                      </span>
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {additionalNotes}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 px-1">
                  <span className="font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Client Project Description &amp; Requirements</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy(inquiry.message, "message")}
                    className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    title="Copy entire message text"
                  >
                    {copiedField === "message" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-200 leading-relaxed font-sans whitespace-pre-wrap selection:bg-cyan-500 selection:text-black">
                  {inquiry.message}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Modal Footer / Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-white/3 shrink-0">
          {/* Stage Mover Steppers */}
          <div className="flex items-center gap-2">
            {currentStageIndex > 0 && (
              <button
                type="button"
                disabled={isUpdatingStage}
                onClick={() => handleStageChange(STAGES[currentStageIndex - 1].id)}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Stage</span>
              </button>
            )}

            {currentStageIndex < STAGES.length - 2 && (
              <button
                type="button"
                disabled={isUpdatingStage}
                onClick={() => handleStageChange(STAGES[currentStageIndex + 1].id)}
                className="px-3 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <span>Advance Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Outreach CTAs */}
          <div className="flex items-center gap-2">
            {/* 1-Click AI Proposal Generator Button */}
            <button
              type="button"
              disabled={isGeneratingProposal}
              onClick={handleGenerateAiProposal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition-all disabled:opacity-50"
            >
              {isGeneratingProposal ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Drafting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Draft AI Proposal</span>
                </>
              )}
            </button>

            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                if (onOpenOutreach) {
                  onOpenOutreach(inquiry);
                }
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Compose Outreach</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Proposal Drawer / Modal */}
      {proposalModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl glass-dropdown border border-purple-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] space-y-5 bg-cyber-950">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Generated Architectural Solution Proposal
                  </h3>
                  <p className="text-xs text-gray-400">
                    Prepared for <span className="text-white font-semibold">{inquiry.name}</span> ({inquiry.serviceType})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProposalModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Proposal Content */}
            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-gray-200 font-mono whitespace-pre-wrap leading-relaxed select-text">
              {generatedProposalText}
            </div>

            {/* Proposal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ready for Client Transmission &amp; Scoping</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(generatedProposalText, "proposal_all")}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  {copiedField === "proposal_all" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadProposal}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
