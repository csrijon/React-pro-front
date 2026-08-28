"use client";

import { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Zap,
  Phone,
  Mail,
  User,
  ShieldCheck
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";
import { submitInquiry } from "@/lib/actions";
import { OrganizationData } from "@/types";
import WhatsAppIcon from "../WhatsAppIcon";
import Link from "next/link";

interface Act10FinalConversationProps {
  organization: OrganizationData | null;
}

export default function Act10FinalConversation({ organization }: Act10FinalConversationProps) {
  const [step, setStep] = useState(1);
  const [bottleneckChoice, setBottleneckChoice] = useState("");
  const [timelineChoice, setTimelineChoice] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleBottleneckSelect = (choice: string) => {
    soundFX.click();
    setBottleneckChoice(choice);
    setStep(2);
  };

  const handleTimelineSelect = (choice: string) => {
    soundFX.click();
    setTimelineChoice(choice);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const messagePayload = `
DIAGNOSTIC BLUEPRINT REQUEST:
- Primary Friction: ${bottleneckChoice}
- Target Timeline: ${timelineChoice}
- Additional Notes: ${formData.notes || "None provided"}
      `.trim();

      const res = await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceType: bottleneckChoice || "Digital Architecture Consultation",
        projectBudget: "$5,000 - $25,000+",
        timeline: timelineChoice || "Immediate Sprint",
        message: messagePayload,
      });

      if (res.success) {
        soundFX.success();
        setIsCompleted(true);
      } else {
        setErrorMsg(res.error || "Failed to submit request.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const waNumber = organization?.whatsappNumber?.replace(/[^0-9]/g, "") || "919876543210";
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hello HP Edit Enterprise! I completed the business diagnostic for: ${bottleneckChoice || "Custom Software & AI Architecture"}. Let's discuss recommendations.`
  )}`;

  return (
    <section id="contact" className="py-28 px-4 sm:px-6 lg:px-8 relative bg-cyber-950/90 border-t border-cyan-500/20 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Narrative Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Act 10: The Strategic First Step</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Your business already tells us where the opportunities are.{" "}
            <span className="text-gradient-cyan">Let's find them.</span>
          </h2>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Start with our 3-step diagnostic to receive a tailored architecture roadmap and sprint feasibility plan.
          </p>
        </div>

        {/* Conversational Diagnostic Container */}
        <div className="p-6 sm:p-10 rounded-3xl luxury-card border border-cyan-500/30 shadow-2xl space-y-8">
          {!isCompleted ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-gray-300 font-bold pb-4 border-b border-white/10">
                <span className="text-cyan-300 font-bold">Step {step} of 3</span>
                <span>{step === 1 ? "Identify Friction" : step === 2 ? "Target Timeline" : "Blueprint Delivery"}</span>
              </div>

              {/* STEP 1: Identify Friction */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    What is the biggest operational friction in your business right now?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Losing leads before our team can reply",
                      "Too much repetitive manual data work",
                      "Website gets traffic but doesn't convert",
                      "Software tools don't communicate with each other",
                      "Need an autonomous AI agent companion",
                      "Need to build a custom mobile app or SaaS product",
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleBottleneckSelect(item)}
                        className="p-4 rounded-2xl text-left border bg-white/3 border-white/10 hover:bg-cyan-500/15 hover:border-cyan-400 text-sm font-bold text-gray-100 hover:text-white transition-all flex items-center justify-between group"
                      >
                        <span>{item}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Target Timeline */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      When would you like this solution operational?
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-cyan-300 underline font-mono font-bold"
                    >
                      ← Back
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Immediate Sprint (2-3 Weeks)", desc: "Priority deployment" },
                      { label: "Next 1-2 Months", desc: "Planned growth initiative" },
                      { label: "Exploring Roadmap", desc: "Evaluating architecture options" },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleTimelineSelect(item.label)}
                        className="p-5 rounded-2xl text-left border bg-white/3 border-white/10 hover:bg-cyan-500/15 hover:border-cyan-400 text-xs font-bold text-gray-200 hover:text-white transition-all space-y-1 group"
                      >
                        <div className="text-sm sm:text-base font-bold text-white">{item.label}</div>
                        <div className="text-xs text-gray-300">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Blueprint Delivery Form */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Where should we send your custom architecture blueprint?
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-cyan-400 underline font-mono"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Work Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">WhatsApp / Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 font-semibold block mb-1">Additional Project Context (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Existing tools used: HubSpot, Stripe..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span className="text-[11px] font-mono text-gray-500">
                      🔒 Zero spam guarantee • 100% confidential NDA protected
                    </span>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black text-xs shadow-glow-emerald/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <span>{isSubmitting ? "Generating Blueprint..." : "Request Architecture Blueprint"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* COMPLETED STATE */
            <div className="text-center space-y-6 py-8 animate-in zoom-in-95">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl font-black text-white">
                  Blueprint Request Dispatched!
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Our principal engineering lead will review your operational friction (<span className="text-cyan-300 font-bold">{bottleneckChoice}</span>) and send a tailored architecture specification within 4 business hours.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-glow-emerald/20 transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                </a>

                <Link
                  href="/book"
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Book 15-Min Discovery Call</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
