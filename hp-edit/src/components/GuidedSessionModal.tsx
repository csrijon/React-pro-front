"use client";

import { useState } from "react";
import {
  Sparkles,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Send,
  MessageSquare,
  Compass,
  Zap,
  Bot,
  Globe,
  Smartphone
} from "lucide-react";
import confetti from "canvas-confetti";
import { soundFX } from "./CyberAudioFx";
import { OrganizationData } from "@/types";
import { submitInquiry } from "@/lib/actions";

interface GuidedSessionModalProps {
  organization: OrganizationData | null;
  isOpen: boolean;
  onClose: () => void;
}

const goals = [
  { id: "launch_mvp", title: "Launch High-Speed MVP", desc: "Fast-track 0-to-1 prototype in 2-3 weeks", icon: Zap },
  { id: "ai_automation", title: "Autonomous AI Agents & Bots", desc: "Automate manual operations & ERP data", icon: Bot },
  { id: "scale_platform", title: "Enterprise Web / Mobile SaaS", desc: "Scale architecture to millions of users", icon: Globe },
  { id: "whatsapp_growth", title: "WhatsApp API & Funnels", desc: "Turn WhatsApp into #1 conversion channel", icon: MessageSquare },
];

const budgetTiers = [
  "\$1,500 - \$3,500 (Rapid MVP)",
  "\$3,500 - \$8,000 (Growth Grade)",
  "\$8,000 - \$20,000+ (Enterprise Multi-Tenant)",
  "Flexible / Custom Retainer",
];

const timelines = [
  "Immediate (2-3 Weeks)",
  "Standard Sprint (4-6 Weeks)",
  "Quarterly Strategic Rollout (2-3 Months)",
];

export default function GuidedSessionModal({
  organization,
  isOpen,
  onClose,
}: GuidedSessionModalProps) {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("launch_mvp");
  const [selectedBudget, setSelectedBudget] = useState(budgetTiers[0]);
  const [selectedTimeline, setSelectedTimeline] = useState(timelines[0]);
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [projectNotes, setProjectNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const waNumber = organization?.whatsappNumber?.replace(/[^0-9]/g, "") || "919876543210";

  const handleFinish = async () => {
    soundFX.click();
    setIsSubmitting(true);

    try {
      const goalObj = goals.find((g) => g.id === selectedGoal);
      const summary = `[Guided Discovery Brief] Goal: ${goalObj?.title} | Timeline: ${selectedTimeline} | Budget: ${selectedBudget} | Notes: ${projectNotes}`;

      await submitInquiry({
        name: clientName || "Guided Discovery Client",
        email: clientContact.includes("@") ? clientContact : `${clientName.replace(/\s+/g, "").toLowerCase() || "client"}@discovery.com`,
        phone: !clientContact.includes("@") ? clientContact : undefined,
        serviceType: goalObj?.title || "Guided Sprint",
        projectBudget: selectedBudget,
        timeline: selectedTimeline,
        message: summary,
      });

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsDone(true);
    } catch {
      setIsDone(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLaunchWhatsApp = () => {
    soundFX.success();
    const goalObj = goals.find((g) => g.id === selectedGoal);
    const msg = encodeURIComponent(
      `Hello HP Edit Enterprise! I just completed the Guided Project Sprint on your website:
- Name: ${clientName || "Prospective Client"}
- Goal: ${goalObj?.title}
- Budget Tier: ${selectedBudget}
- Target Timeline: ${selectedTimeline}
- Details: ${projectNotes || "Looking forward to discovery call"}

Let's discuss next steps.`
    );
    window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl glass-dropdown border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Guided Project Sprint Wizard</h3>
              <p className="text-[10px] text-gray-400">Step {step} of 4 • 2 Minute Fast Discovery</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex gap-1.5 my-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step >= i ? "bg-gradient-to-r from-cyan-400 to-purple-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Modal Body */}
        {isDone ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white">Discovery Blueprint Transmitted!</h4>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
              Our principal engineering architect has received your specifications. Speed up the process by connecting directly on WhatsApp:
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleLaunchWhatsApp}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Instant WhatsApp Chat</span>
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step 1: Goal */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-sm font-bold text-white">What is your primary product objective?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goals.map((g) => {
                    const isSel = selectedGoal === g.id;
                    const Icon = g.icon;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setSelectedGoal(g.id);
                          soundFX.click();
                        }}
                        className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                          isSel
                            ? "bg-cyan-500/15 border-cyan-400 text-white shadow-glow-cyan/20"
                            : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5 text-cyan-400 mb-2" />
                        <div className="text-xs font-bold text-white">{g.title}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{g.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Budget & Timeline */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-sm font-bold text-white">Target Investment &amp; Delivery Window</h4>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">Estimated Budget Range</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {budgetTiers.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBudget(b)}
                        className={`p-3 rounded-xl text-xs font-bold text-left border transition-colors ${
                          selectedBudget === b
                            ? "bg-purple-500/20 text-white border-purple-400"
                            : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">Target Timeline</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {timelines.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTimeline(t)}
                        className={`p-2.5 rounded-xl text-[11px] font-bold text-center border transition-colors ${
                          selectedTimeline === t
                            ? "bg-cyan-500/20 text-white border-cyan-400"
                            : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Project Notes & Requirements */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-sm font-bold text-white">Tell us about your requirements</h4>
                <div>
                  <label className="text-xs text-gray-400 block mb-1.5">Key features or integrations</label>
                  <textarea
                    rows={4}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="e.g. Needs WhatsApp login, AI document parsing, Next.js 15 dashboard, Stripe payments..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Contact Details */}
            {step === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <h4 className="text-sm font-bold text-white">Where should we deliver the technical proposal?</h4>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Email or WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    placeholder="alex@company.com or +1 555-0192"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            {/* Modal Bottom Navigation */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setStep((s) => s + 1);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting || !clientContact}
                  onClick={handleFinish}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Blueprint &amp; Connect</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
