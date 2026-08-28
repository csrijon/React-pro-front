"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Globe,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  CalendarPlus,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import confetti from "canvas-confetti";
import { OrganizationData } from "@/types";
import { createBooking } from "@/lib/actions";
import CyberCaptcha from "./CyberCaptcha";
import WhatsAppIcon from "./WhatsAppIcon";
import { soundFX } from "./CyberAudioFx";

interface BookingExperienceProps {
  organization: OrganizationData | null;
}

const timeSlots = [
  "10:00 AM",
  "11:30 AM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
  "06:30 PM",
  "08:00 PM",
];

const timezones = [
  { id: "IST", label: "IST (India Standard Time - UTC+5:30)" },
  { id: "UTC", label: "UTC (Coordinated Universal Time)" },
  { id: "EST", label: "EST (US Eastern Time - UTC-5)" },
  { id: "PST", label: "PST (US Pacific Time - UTC-8)" },
  { id: "GMT", label: "GMT / BST (London Time)" },
  { id: "CET", label: "CET (Central European Time)" },
  { id: "AEDT", label: "AEDT (Sydney, Australia Time)" },
];

export default function BookingExperience({ organization }: BookingExperienceProps) {
  const [meetingType, setMeetingType] = useState<"15-min Sprint Discovery" | "30-min Architecture Consultation">("15-min Sprint Discovery");
  const [platform, setPlatform] = useState<"Google Meet" | "Zoom" | "Phone">("Google Meet");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [selectedTime, setSelectedTime] = useState<string>(timeSlots[0]);
  const [selectedTz, setSelectedTz] = useState<string>("IST");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    botTrap: "",
  });

  const [captchaToken, setCaptchaToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmedMeetUrl, setConfirmedMeetUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setErrorMsg("Please complete the anti-bot verification challenge below.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await createBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        meetingType,
        platform,
        bookingDate: selectedDate,
        bookingTime: selectedTime,
        timezone: selectedTz,
        topic: formData.topic || "General Architecture Consultation",
        botTrap: formData.botTrap,
      });

      if (res.success) {
        soundFX.success();
        setConfirmedMeetUrl(res.meetUrl || "https://meet.google.com");
        setBookingSuccess(true);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
        });
      } else {
        setErrorMsg(res.error || "Failed to reserve appointment.");
      }
    } catch {
      setErrorMsg("Something went wrong. Please connect with us directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`HP Edit Enterprise: ${meetingType}`);
    const details = encodeURIComponent(
      `1-on-1 Consultation with HP Edit Enterprise Architecture Lead.\nMeeting Link: ${confirmedMeetUrl}\nTopic: ${formData.topic || "Technical Scoping"}`
    );
    const location = encodeURIComponent(confirmedMeetUrl);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
          <Video className="w-3.5 h-3.5" />
          <span>Direct Founder &amp; Architect Consultation</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Schedule Your <span className="text-gradient-cyan">Video Discovery Call</span>
        </h1>
        <p className="mt-4 text-gray-300 text-sm sm:text-lg leading-relaxed">
          Book a 1-on-1 sprint session with our Principal Engineering Lead to map out your software architecture, timeline, and deliverables.
        </p>
      </div>

      {bookingSuccess ? (
        /* Booking Confirmation Screen */
        <div className="p-8 sm:p-14 rounded-3xl glass-dropdown border border-emerald-500/40 shadow-2xl text-center space-y-8 animate-in zoom-in-95 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Appointment Confirmed!
            </h2>
            <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{formData.name}</strong>. A calendar invite and meeting details have been prepared for:
            </p>
          </div>

          {/* Reserved Schedule Card */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-left space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-cyan-400 font-bold text-sm">
              <span>{meetingType}</span>
              <span className="text-emerald-400">{platform}</span>
            </div>
            <div className="text-gray-300">
              📅 Date: <strong className="text-white">{selectedDate}</strong> at <strong className="text-white">{selectedTime}</strong> ({selectedTz})
            </div>
            <div className="text-gray-300 flex items-center gap-2">
              <span>🔗 Link:</span>
              <a
                href={confirmedMeetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline break-all"
              >
                {confirmedMeetUrl}
              </a>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={generateGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              <CalendarPlus className="w-4 h-4" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setBookingSuccess(false);
                setCaptchaToken("");
                setFormData({ name: "", email: "", phone: "", topic: "", botTrap: "" });
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
            >
              Schedule Another Call
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Booking Form Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Meeting Type, Platform & Date/Time Selectors (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 1: Meeting Type */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px]">1</span>
                <span>Select Session Type</span>
              </h3>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setMeetingType("15-min Sprint Discovery");
                  }}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${
                    meetingType === "15-min Sprint Discovery"
                      ? "bg-cyan-500/15 border-cyan-400 shadow-glow-cyan/20"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">15-Minute Sprint Discovery</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Fast Scoping</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Quick alignment on project goals, MVP timeline, and ballpark budgeting.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setMeetingType("30-min Architecture Consultation");
                  }}
                  className={`w-full p-4 rounded-2xl text-left border transition-all ${
                    meetingType === "30-min Architecture Consultation"
                      ? "bg-purple-500/15 border-purple-400 shadow-glow-purple/20"
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">30-Minute Architecture Deep-Dive</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Technical</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Comprehensive technical blueprint, AI multi-agent orchestration, and vector RAG design.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Date & Timezone */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px]">2</span>
                <span>Choose Date &amp; Timezone</span>
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 block mb-1">Your Timezone</label>
                  <select
                    value={selectedTz}
                    onChange={(e) => setSelectedTz(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-900 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    {timezones.map((tz) => (
                      <option key={tz.id} value={tz.id}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Select Time Slot */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
                <span>Available Slots</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        soundFX.click();
                        setSelectedTime(slot);
                      }}
                      className={`p-2.5 rounded-xl text-center font-mono text-xs font-bold border transition-all ${
                        isSelected
                          ? "bg-emerald-500 text-gray-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                          : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Lead Contact Info & Cyber Captcha (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl glass-dropdown border border-cyan-500/30 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-bold text-lg text-white">Your Contact Details</h3>
                  <p className="text-xs text-gray-400">Meeting link and calendar invite will be delivered instantly.</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                  Instant Link
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Honeypot Trap */}
                <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                  <label htmlFor="_trap_company_fax">Leave blank</label>
                  <input
                    id="_trap_company_fax"
                    type="text"
                    tabIndex={-1}
                    value={formData.botTrap}
                    onChange={(e) => setFormData({ ...formData, botTrap: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1.5">Work Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="sarah@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 font-semibold block mb-1.5">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 font-semibold block mb-1.5">Meeting Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as typeof platform)}
                      className="w-full px-4 py-3 rounded-xl bg-cyber-900 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Google Meet">Google Meet (Recommended)</option>
                      <option value="Zoom">Zoom Video</option>
                      <option value="Phone">Direct Phone Call</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1.5">
                    What would you like to discuss? (Optional brief)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Next.js 15 migration, autonomous AI lead agent, or mobile Flutter app architecture..."
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                {/* Anti-Bot Cyber Captcha */}
                <CyberCaptcha onVerified={(token) => setCaptchaToken(token)} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Reserving Time Slot...</span>
                  ) : (
                    <>
                      <span>Confirm &amp; Generate Meeting Link</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
