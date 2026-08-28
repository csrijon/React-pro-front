"use client";

import React, { useState, useEffect } from "react";
import {
  Columns,
  Search,
  User,
  Mail,
  Phone,
  DollarSign,
  Clock,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Maximize2
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";
import { InquiryData } from "@/types";
import { updateInquiryPipelineStageAction } from "@/lib/actions";

import LeadMessagingModal from "./LeadMessagingModal";
import InquiryDetailModal from "./InquiryDetailModal";

interface CrmKanbanBoardProps {
  inquiries: InquiryData[];
  onOpenOutreachModal?: (inquiry: InquiryData) => void;
}

const PIPELINE_STAGES = [
  { id: "NEW", title: "1. Inbound Leads", color: "border-cyan-500/40 text-cyan-300 bg-cyan-500/10" },
  { id: "CONTACTED", title: "2. In Discovery", color: "border-purple-500/40 text-purple-300 bg-purple-500/10" },
  { id: "SCOPING", title: "3. Tech Scoping", color: "border-amber-500/40 text-amber-300 bg-amber-500/10" },
  { id: "PROPOSAL_SENT", title: "4. Proposal Sent", color: "border-blue-500/40 text-blue-300 bg-blue-500/10" },
  { id: "CLOSED_WON", title: "5. Closed / Won", color: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10" },
];

export default function CrmKanbanBoard({ inquiries, onOpenOutreachModal }: CrmKanbanBoardProps) {
  const [localInquiries, setLocalInquiries] = useState<InquiryData[]>(inquiries);
  const [search, setSearch] = useState("");
  const [movingId, setMovingId] = useState<string | null>(null);
  const [activeOutreachInquiry, setActiveOutreachInquiry] = useState<InquiryData | null>(null);
  const [selectedInquiryForDetails, setSelectedInquiryForDetails] = useState<InquiryData | null>(null);

  // Sync with prop updates
  useEffect(() => {
    setLocalInquiries(inquiries);
  }, [inquiries]);

  const handleStageChange = async (inquiryId: string, newStage: string) => {
    setMovingId(inquiryId);
    // Optimistic update
    setLocalInquiries((prev) =>
      prev.map((i) => (i.id === inquiryId ? { ...i, pipelineStage: newStage } : i))
    );
    try {
      soundFX.click();
      await updateInquiryPipelineStageAction(inquiryId, newStage);
      soundFX.success();
    } catch (err) {
      console.error("Failed to move inquiry stage:", err);
      soundFX.error();
      // Revert if error
      setLocalInquiries(inquiries);
    } finally {
      setMovingId(null);
    }
  };

  const filteredInquiries = localInquiries.filter((inq) => {
    const query = search.toLowerCase();
    return (
      inq.name.toLowerCase().includes(query) ||
      inq.email.toLowerCase().includes(query) ||
      (inq.serviceType && inq.serviceType.toLowerCase().includes(query)) ||
      (inq.projectBudget && inq.projectBudget.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Instant Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Columns className="w-5 h-5 text-cyan-400" />
            <span>Interactive Lead Pipeline Kanban</span>
          </h2>
          <p className="text-xs text-gray-300 font-medium mt-1">
            Click any lead card to open the full enquiry details modal, inspect scoping, and manage outreach.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads, budget, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 5-Column Kanban Track */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start">
        {PIPELINE_STAGES.map((stage, stageIdx) => {
          const stageInquiries = filteredInquiries.filter(
            (inq) => (inq.pipelineStage || inq.status || "NEW") === stage.id
          );

          return (
            <div
              key={stage.id}
              className="rounded-3xl glass-panel border border-white/10 p-3.5 flex flex-col min-h-[520px] shadow-xl"
            >
              {/* Column Header - Guaranteed Fixed Single Line Alignment */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 h-9 shrink-0">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border truncate max-w-[140px] ${stage.color}`}>
                  {stage.title}
                </span>
                <span className="text-xs font-mono font-bold text-gray-300 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10 shrink-0">
                  {stageInquiries.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-grow overflow-y-auto max-h-[680px] pr-1">
                {stageInquiries.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-center p-4 border border-dashed border-white/5 rounded-2xl text-xs text-gray-500">
                    No leads in this stage
                  </div>
                ) : (
                  stageInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      onClick={() => {
                        soundFX.click();
                        setSelectedInquiryForDetails(inq);
                      }}
                      className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 hover:shadow-glow-cyan/10 transition-all space-y-2.5 shadow-lg group flex flex-col justify-between cursor-pointer relative"
                    >
                      {/* Lead Identity */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5 truncate group-hover:text-cyan-300 transition-colors">
                            <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate">{inq.name}</span>
                          </h4>
                          <Maximize2 className="w-3 h-3 text-gray-500 group-hover:text-cyan-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] text-gray-400 truncate font-mono block">
                            {inq.email}
                          </span>
                          {inq.projectBudget && (
                            <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                              {inq.projectBudget}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Service Badge & Summary */}
                      <div className="text-[11px] text-gray-300 bg-black/30 p-2.5 rounded-xl border border-white/5 space-y-1">
                        <span className="text-cyan-300 font-semibold block text-[10px] font-mono truncate">
                          {inq.serviceType || "Custom Software"}
                        </span>
                        <p className="line-clamp-2 text-gray-300 text-[11px] leading-relaxed">
                          {inq.message}
                        </p>
                      </div>

                      {/* Card Action Suite */}
                      <div
                        className="flex items-center justify-between pt-2.5 border-t border-white/5 mt-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenOutreachModal) {
                              onOpenOutreachModal(inq);
                            } else {
                              soundFX.click();
                              setActiveOutreachInquiry(inq);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
                          title="Send direct email / WhatsApp message"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Outreach</span>
                        </button>

                        {/* Stage Mover Steppers */}
                        <div className="flex items-center gap-1">
                          {stageIdx > 0 && (
                            <button
                              type="button"
                              disabled={movingId === inq.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageChange(inq.id, PIPELINE_STAGES[stageIdx - 1].id);
                              }}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors disabled:opacity-30"
                              title="Move back a stage"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}

                          {stageIdx < PIPELINE_STAGES.length - 1 && (
                            <button
                              type="button"
                              disabled={movingId === inq.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStageChange(inq.id, PIPELINE_STAGES[stageIdx + 1].id);
                              }}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-cyan-200 border border-white/5 transition-colors disabled:opacity-30"
                              title="Advance to next stage"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inquiry Lightbox / Details Modal */}
      {selectedInquiryForDetails && (
        <InquiryDetailModal
          inquiry={selectedInquiryForDetails}
          onClose={() => setSelectedInquiryForDetails(null)}
          onOpenOutreach={(inq) => {
            setSelectedInquiryForDetails(null);
            if (onOpenOutreachModal) {
              onOpenOutreachModal(inq);
            } else {
              setActiveOutreachInquiry(inq);
            }
          }}
          onStageUpdated={(inqId, newStage) => {
            setLocalInquiries((prev) =>
              prev.map((i) => (i.id === inqId ? { ...i, pipelineStage: newStage } : i))
            );
            if (selectedInquiryForDetails && selectedInquiryForDetails.id === inqId) {
              setSelectedInquiryForDetails((prev) => (prev ? { ...prev, pipelineStage: newStage } : null));
            }
          }}
        />
      )}

      {/* Internal Lead Messaging Modal */}
      {activeOutreachInquiry && (
        <LeadMessagingModal
          inquiry={activeOutreachInquiry}
          onClose={() => setActiveOutreachInquiry(null)}
        />
      )}
    </div>
  );
}
