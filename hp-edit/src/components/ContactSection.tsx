"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building,
  ArrowRight,
  Plus,
  Trash2,
  AlertCircle,
  Calendar,
  Layers,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { OrganizationData } from "@/types";
import { submitInquiry, trackClientEvent } from "@/lib/actions";
import { soundFX } from "./CyberAudioFx";
import WhatsAppIcon from "./WhatsAppIcon";
import CyberCaptcha from "./CyberCaptcha";

interface ContactSectionProps {
  organization: OrganizationData | null;
  initialMessage?: string;
  initialBudget?: string;
  initialTimeline?: string;
}

const PAIN_POINT_PRESETS = [
  "⚡ High API/Page Latency (> 3s drop-off)",
  "💬 WhatsApp Leads Dropping Off Unassisted",
  "🤖 Manual Repetitive Data Entry & CSV Sync",
  "🔄 Disconnected ERP, CRM & Billing Silos",
  "📱 Outdated or Missing Native Mobile App",
  "📉 Low Checkout Funnel Conversion Rate",
];

const MAX_PAIN_POINTS = 25;

export default function ContactSection({
  organization,
  initialMessage = "",
  initialBudget = "",
  initialTimeline = "",
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "Full-Stack Web & Cloud",
    projectBudget: initialBudget || "$2,000 - $5,000",
    timeline: initialTimeline || "1-2 Months",
    message: initialMessage,
    botTrap: "",
  });

  const [painPoints, setPainPoints] = useState<string[]>([""]);
  const [showEnterpriseModalCallout, setShowEnterpriseModalCallout] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const waNumber = organization?.whatsappNumber?.replace(/[^0-9]/g, "") || "919836847984";
  const defaultMsg = encodeURIComponent(
    organization?.whatsappDefaultMessage ||
      "Hello HP Edit Enterprise! I'd like to schedule an architecture discovery consultation for my software project."
  );
  const directWhatsAppUrl = `https://wa.me/${waNumber}?text=${defaultMsg}`;

  // Pain Points Dynamic Handlers
  const handleAddPainPoint = () => {
    if (painPoints.length >= MAX_PAIN_POINTS) {
      soundFX.error();
      setShowEnterpriseModalCallout(true);
      return;
    }
    soundFX.click();
    setPainPoints([...painPoints, ""]);
  };

  const handleRemovePainPoint = (index: number) => {
    if (painPoints.length <= 1) {
      setPainPoints([""]);
      return;
    }
    soundFX.click();
    setPainPoints(painPoints.filter((_, i) => i !== index));
  };

  const handlePainPointChange = (index: number, value: string) => {
    const updated = [...painPoints];
    updated[index] = value;
    setPainPoints(updated);
  };

  const handlePresetClick = (presetText: string) => {
    soundFX.click();
    // If the last pain point is empty, fill it
    const lastIdx = painPoints.length - 1;
    if (lastIdx >= 0 && painPoints[lastIdx].trim() === "") {
      const updated = [...painPoints];
      updated[lastIdx] = presetText;
      setPainPoints(updated);
    } else if (painPoints.length < MAX_PAIN_POINTS) {
      setPainPoints([...painPoints, presetText]);
    } else {
      setShowEnterpriseModalCallout(true);
    }
  };

  const validPainPointsCount = painPoints.filter((p) => p.trim().length > 0).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setErrorMessage("Please complete the anti-bot verification check below before submitting.");
      return;
    }

    const filledPainPoints = painPoints.filter((p) => p.trim().length > 0);
    if (filledPainPoints.length === 0 && !formData.message.trim()) {
      setErrorMessage("Please list at least one operational pain point or technical requirement.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await submitInquiry({
        ...formData,
        painPoints: filledPainPoints,
      });

      if (res.success) {
        soundFX.success();
        setSubmitSuccess(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else {
        soundFX.error();
        setErrorMessage(res.error || "Failed to submit. Please contact us via WhatsApp.");
      }
    } catch {
      soundFX.error();
      setErrorMessage("Something went wrong. Please connect with us directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-cyber-900 border-t border-white/10 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Diagnostic Discovery &amp; Scoping Channel</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Build? <br />
            <span className="text-gradient-cyan">Let&apos;s Diagnose &amp; Architect Your Vision</span>
          </h2>
          <p className="mt-4 text-gray-300 text-base sm:text-lg">
            List your operational friction points, bottlenecks, or technical specifications. Our principal engineering architects will prescribe the exact system solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Organization Details & Contact Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Org Card */}
            <div className="rounded-2xl glass-panel p-7 border border-white/10 space-y-6 shadow-xl">
              <div className="flex items-center gap-3 pb-5 border-b border-white/10">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    {organization?.name || "HP Edit Enterprise"}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {organization?.tagline || "Architecting Intelligent Digital Systems"}
                  </p>
                </div>
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-3.5 text-xs text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-[10px] tracking-wider text-gray-400">Headquarters Address</div>
                  <div className="mt-0.5 text-sm text-gray-100 font-medium">
                    {organization?.address || "ST 24, Awfis 4th Floor, Siddha Esplanade"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {organization?.city || "Kolkata"} - {organization?.postalCode || "700013"}, {organization?.country || "India"}
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start gap-3.5 text-xs text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-[10px] tracking-wider text-gray-400">Direct Telephones</div>
                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <a
                      href={`tel:${organization?.primaryPhone?.replace(/\s+/g, "") || "+919836847984"}`}
                      className="text-sm font-bold text-white hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>{organization?.primaryPhone || "+91 9836847984"}</span>
                      <span className="text-[9px] font-mono font-normal text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">Primary</span>
                    </a>
                    {organization?.secondaryPhone && (
                      <a
                        href={`tel:${organization.secondaryPhone.replace(/\s+/g, "")}`}
                        className="text-sm font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <span>{organization.secondaryPhone}</span>
                        <span className="text-[9px] font-mono font-normal text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">Direct</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Official Emails */}
              <div className="flex items-start gap-3.5 text-xs text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-[10px] tracking-wider text-gray-400">Official Inquiries &amp; Scoping</div>
                  <div className="mt-0.5">
                    <a
                      href={`mailto:${organization?.primaryEmail || "info@hpedit.com"}`}
                      className="text-sm font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      {organization?.primaryEmail || "info@hpedit.com"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours & Availability */}
              <div className="flex items-start gap-3.5 text-xs text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white uppercase text-[10px] tracking-wider text-gray-400">Operating Hours</div>
                  <div className="mt-0.5 text-xs text-gray-200">
                    {organization?.businessHours || "Mon - Sat: 9:00 AM - 8:30 PM (IST)"}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{organization?.availabilityStatus || "Accepting High-Impact Projects"}</span>
                  </div>
                </div>
              </div>

              {/* Fast Priority WhatsApp Button */}
              <div className="pt-2">
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackClientEvent({
                      eventType: "WHATSAPP_CLICK",
                      path: "/contact",
                      details: "Clicked direct WhatsApp button in contact section",
                    });
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly (+91 9836847984)</span>
                </a>
              </div>
            </div>

            {/* Google Maps Interactive Card */}
            {organization?.googleMapsEmbed && (
              <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-xl">
                <div className="p-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Campus &amp; Office Location</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">
                    {organization?.city || "Kolkata"}, {organization?.country || "IN"}
                  </span>
                </div>
                <div className="h-64 w-full relative">
                  <iframe
                    src={
                      organization.googleMapsEmbed.startsWith("<iframe")
                        ? organization.googleMapsEmbed.match(/src=["']([^"']+)["']/)?.[1] || organization.googleMapsEmbed
                        : organization.googleMapsEmbed
                    }
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="HP Edit Enterprise Kolkata Headquarters"
                  />
                </div>
                <div className="p-2.5 bg-cyber-950/80 border-t border-white/5 text-center">
                  <a
                    href="https://maps.google.com/?q=ST+24,+Awfis+4th+Floor,+Siddha+Esplanade,+Kolkata+-+700013"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open in Google Maps for Navigation</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Security Guarantee Box */}
            <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 flex items-start gap-3 text-xs text-gray-300">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Enterprise Confidentiality &amp; NDA</span>
                <span className="text-gray-400 text-[11px] mt-0.5 block leading-relaxed">
                  All consultations and architecture blueprints are safeguarded under our standard bilateral Mutual NDA. Zero client code or data is ever shared or used to train public AI models.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Proposal & Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl glass-dropdown border border-cyan-500/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
              {submitSuccess ? (
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto animate-in zoom-in">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-extrabold text-white">
                      Diagnostic Discovery Transmitted!
                    </h3>
                    <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="text-white font-semibold">{formData.name}</span>. Our principal engineering architect has received your <span className="text-cyan-300 font-bold">{validPainPointsCount} pain points</span> and technical brief. We will review and provide a structured blueprint within 2 hours.
                    </p>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>Priority WhatsApp Dispatch</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitSuccess(false);
                        setCaptchaToken("");
                        setPainPoints([""]);
                        setShowEnterpriseModalCallout(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          serviceType: "Full-Stack Web & Cloud",
                          projectBudget: "$2,000 - $5,000",
                          timeline: "1-2 Months",
                          message: "",
                          botTrap: "",
                        });
                      }}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                    >
                      Submit Another Project
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="font-bold text-xl text-white">Project Discovery Brief</h3>
                      <p className="text-xs text-gray-400">Granular diagnosis &amp; lead pipeline triage</p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                      Response: &lt; 2 Hrs
                    </span>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Invisible Honeypot Trap Field */}
                  <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                    <label htmlFor="_trap_company_fax">Leave this field blank</label>
                    <input
                      id="_trap_company_fax"
                      type="text"
                      name="_trap_company_fax"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.botTrap}
                      onChange={(e) => setFormData({ ...formData, botTrap: e.target.value })}
                    />
                  </div>

                  {/* Section 1: Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Johnathan Doe"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Official Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Section 2: Phone & Domain */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Phone / WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Primary Service Area *
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-cyber-900 border border-white/10 focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors"
                      >
                        <option value="Full-Stack Web & Cloud">Full-Stack Web &amp; Cloud Platform</option>
                        <option value="Mobile App Development">Mobile App (iOS / Android / Flutter)</option>
                        <option value="Autonomous AI Agents">Autonomous AI Agents &amp; RAG Systems</option>
                        <option value="Enterprise Automation">Enterprise Automation &amp; Bots</option>
                        <option value="WhatsApp Business API">WhatsApp API &amp; Funnel Automation</option>
                        <option value="Digital Growth & Marketing">Digital &amp; Influencer Marketing</option>
                        <option value="Desktop Software & IT">Desktop Software &amp; IT Consulting</option>
                      </select>
                    </div>
                  </div>

                  {/* Section 3: Budget & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Budget Expectation
                      </label>
                      <input
                        type="text"
                        value={formData.projectBudget}
                        onChange={(e) => setFormData({ ...formData, projectBudget: e.target.value })}
                        placeholder="e.g. $3,000 - $8,000"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-2">
                        Target Timeline
                      </label>
                      <input
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        placeholder="e.g. 3-4 Weeks"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Section 4: DYNAMIC MULTI-PAIN-POINT ENGINE (Max 25) */}
                  <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-white/3 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-white flex items-center gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                          <span>List Your Specific Operational Pain Points &amp; Bottlenecks *</span>
                        </label>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Add discrete issues one by one (e.g. high latency, manual data sync, customer drop-off).
                        </p>
                      </div>

                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shrink-0">
                        {painPoints.length} / {MAX_PAIN_POINTS} Max
                      </span>
                    </div>

                    {/* Quick Inspiration Chips */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block">
                        Quick-Add Common Problem Statements:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PAIN_POINT_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handlePresetClick(preset)}
                            className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/30 text-gray-300 hover:text-cyan-300 transition-colors flex items-center gap-1"
                          >
                            <span>+</span>
                            <span>{preset}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pain Points Textboxes List */}
                    <div className="space-y-2.5 pt-2 max-h-[380px] overflow-y-auto pr-1">
                      {painPoints.map((point, index) => (
                        <div key={index} className="flex items-center gap-2 group animate-in fade-in duration-150">
                          <div className="w-7 h-9 rounded-lg bg-white/5 border border-white/10 font-mono text-xs font-bold text-cyan-400 flex items-center justify-center shrink-0">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <input
                            type="text"
                            value={point}
                            onChange={(e) => handlePainPointChange(index, e.target.value)}
                            placeholder={`Pain Point #${index + 1}: e.g. Customer reply delay on WhatsApp takes 4+ hours...`}
                            className="flex-1 px-3.5 py-2 rounded-xl bg-cyber-950/80 border border-white/10 focus:border-cyan-400 text-white text-xs placeholder:text-gray-500 focus:outline-none transition-colors"
                          />

                          {painPoints.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePainPoint(index)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-white/5 transition-colors shrink-0"
                              title="Remove pain point"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add Button & Max Notification */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                      <button
                        type="button"
                        disabled={painPoints.length >= MAX_PAIN_POINTS}
                        onClick={handleAddPainPoint}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Another Pain Point ({painPoints.length + 1})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowEnterpriseModalCallout(!showEnterpriseModalCallout)}
                        className="text-[11px] text-gray-400 hover:text-cyan-300 transition-colors underline decoration-dotted"
                      >
                        Have 25+ complex enterprise bottlenecks?
                      </button>
                    </div>

                    {/* 25+ Pain Points Discovery Meeting Callout */}
                    {(painPoints.length >= MAX_PAIN_POINTS || showEnterpriseModalCallout) && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2 animate-in zoom-in-95 duration-200">
                        <div className="font-bold flex items-center gap-1.5 text-amber-300">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Complex Enterprise Architecture? (25+ Bottlenecks)</span>
                        </div>
                        <p className="text-gray-300 text-[11px] leading-relaxed">
                          For high-concurrency systems, legacy ERP modernizations, or 25+ multi-system bottlenecks, we recommend a dedicated 1-on-1 technical scoping session with our Principal Architect.
                        </p>
                        <div className="pt-1 flex flex-wrap items-center gap-2 font-semibold">
                          <Link
                            href="/book"
                            onClick={() => soundFX.click()}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Schedule 1-on-1 Video Session</span>
                          </Link>
                          <a
                            href={directWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                            <span>WhatsApp Technical Scoping</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 5: Additional Technical Context (Optional) */}
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-2">
                      Additional Technical Context, Goals or Repositories (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Mention existing tech stack, target user scale, GitHub / Figma links, or any non-functional requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none transition-colors resize-none placeholder:text-gray-500"
                    />
                  </div>

                  {/* Interactive Anti-Bot Cyber Captcha */}
                  <CyberCaptcha onVerified={(token) => setCaptchaToken(token)} />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Discovery Brief...</span>
                    ) : (
                      <>
                        <span>Submit Discovery Brief ({validPainPointsCount} Pain Points)</span>
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
