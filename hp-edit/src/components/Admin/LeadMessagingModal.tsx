"use client";

import { useState } from "react";
import {
  Send,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import WhatsAppIcon from "../WhatsAppIcon";
import { InquiryData, LeadCommunicationData } from "@/types";
import { sendLeadMessage } from "@/lib/actions";
import { soundFX } from "../CyberAudioFx";

interface LeadMessagingModalProps {
  inquiry: InquiryData;
  onClose: () => void;
}

const templates = [
  {
    id: "intro",
    label: "🚀 Initial Discovery & Scoping Intro",
    subject: "HP Edit Enterprise — Next Steps on your Software Project",
    content: (name: string, service: string) =>
      `Hello ${name}! Thank you for reaching out to HP Edit Enterprise regarding your ${service} requirements.\n\nOur principal architecture team has reviewed your brief. We would love to schedule a 15-minute technical sprint consultation to finalize your deliverables, milestone schedule, and architecture blueprint.\n\nAre you available for a brief call today or tomorrow?`,
  },
  {
    id: "proposal",
    label: "📄 Architecture Scope & Proposal Attached",
    subject: "HP Edit Enterprise — Architecture Specification & Proposal Ready",
    content: (name: string, service: string) =>
      `Hello ${name},\n\nWe have finalized the technical scope and sprint estimate for your ${service} platform.\n\nOur proposal guarantees 100% source code ownership handover, sub-100ms SLA, and weekly staging deployments.\n\nPlease review and let us know if you'd like any refinements.`,
  },
  {
    id: "followup",
    label: "⚡ Milestone & Staging Follow-up",
    subject: "HP Edit Enterprise — Project Update",
    content: (name: string) =>
      `Hi ${name},\n\nFollowing up on our previous technical consultation. Let us know if you're ready to proceed with Phase 1 sprint kickoff.\n\nBest regards,\nHP Edit Engineering Lead`,
  },
];

export default function LeadMessagingModal({ inquiry, onClose }: LeadMessagingModalProps) {
  const [channel, setChannel] = useState<"WHATSAPP" | "EMAIL" | "PHONE">("WHATSAPP");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("intro");
  const [subject, setSubject] = useState<string>(templates[0].subject);
  const [message, setMessage] = useState<string>(templates[0].content(inquiry.name, inquiry.serviceType));
  const [comms, setComms] = useState<LeadCommunicationData[]>(inquiry.communications || []);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleTemplateChange = (tempId: string) => {
    soundFX.click();
    setSelectedTemplate(tempId);
    const tmpl = templates.find((t) => t.id === tempId);
    if (tmpl) {
      setSubject(tmpl.subject);
      setMessage(tmpl.content(inquiry.name, inquiry.serviceType));
    }
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      // 1. Record in database
      const res = await sendLeadMessage({
        inquiryId: inquiry.id,
        channel,
        subject: channel === "EMAIL" ? subject : undefined,
        messageContent: message,
      });

      if (res.success && res.communication) {
        soundFX.success();
        setComms((prev) => [res.communication as unknown as LeadCommunicationData, ...prev]);
        setSentSuccess(true);

        // 2. Open native channel
        if (channel === "WHATSAPP") {
          const rawPhone = inquiry.phone?.replace(/[^0-9]/g, "") || "";
          const encoded = encodeURIComponent(message);
          const url = rawPhone ? `https://wa.me/${rawPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
          window.open(url, "_blank");
        } else if (channel === "EMAIL") {
          const mailto = `mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
          window.location.href = mailto;
        } else if (channel === "PHONE") {
          if (inquiry.phone) {
            window.location.href = `tel:${inquiry.phone}`;
          }
        }
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl glass-dropdown border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Multi-Channel Communication Bridge</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Client: <strong className="text-white">{inquiry.name}</strong> • Service:{" "}
              <span className="text-cyan-400 font-mono">{inquiry.serviceType}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>

        {/* Channel Selector Pills */}
        <div className="grid grid-cols-3 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              soundFX.click();
              setChannel("WHATSAPP");
            }}
            className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              channel === "WHATSAPP"
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.click();
              setChannel("EMAIL");
            }}
            className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              channel === "EMAIL"
                ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-glow-purple/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.click();
              setChannel("PHONE");
            }}
            className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
              channel === "PHONE"
                ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-glow-cyan/20"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Phone Call</span>
          </button>
        </div>

        {/* Template Quick Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Select Preset Template
          </label>
          <div className="flex flex-wrap gap-2">
            {templates.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleTemplateChange(tmpl.id)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  selectedTemplate === tmpl.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleDispatch} className="space-y-4 text-xs">
          {channel === "EMAIL" && (
            <div>
              <label className="text-gray-300 font-semibold block mb-1">Subject Line</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-gray-300 font-semibold">Message Body</label>
              <span className="text-[10px] text-gray-500 font-mono">
                {channel === "WHATSAPP" ? `To: ${inquiry.phone || "Direct WhatsApp"}` : `To: ${inquiry.email}`}
              </span>
            </div>
            <textarea
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-gray-400">
              Dispatches directly &amp; records in client communication audit history.
            </span>

            <button
              type="submit"
              disabled={isSending}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                channel === "WHATSAPP"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-gray-950 shadow-emerald-500/25"
                  : channel === "EMAIL"
                  ? "bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/25"
                  : "bg-cyan-500 hover:bg-cyan-400 text-gray-950 shadow-cyan-500/25"
              }`}
            >
              {isSending ? (
                <span>Dispatching...</span>
              ) : (
                <>
                  <span>Send &amp; Launch {channel}</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Communication History Feed */}
        {comms.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Communication History for this Lead ({comms.length})
            </h4>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {comms.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-white/3 border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 font-mono text-[10px]">
                      {c.channel} • by @{c.sentByAdmin}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(c.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>
                  {c.subject && <div className="text-gray-300 font-semibold text-[11px]">{c.subject}</div>}
                  <p className="text-gray-400 text-[11px] line-clamp-2">{c.messageContent}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
