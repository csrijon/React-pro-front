"use client";

import Link from "next/link";
import { ArrowRight, Calendar, MessageSquare, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { OrganizationData } from "@/types";
import { soundFX } from "./CyberAudioFx";
import WhatsAppIcon from "./WhatsAppIcon";

interface HomeClosingCtaProps {
  organization: OrganizationData | null;
}

export default function HomeClosingCta({ organization }: HomeClosingCtaProps) {
  const waNumber = organization?.whatsappNumber?.replace(/[^0-9]/g, "") || "919876543210";
  const defaultMsg = encodeURIComponent(
    organization?.whatsappDefaultMessage ||
      "Hello HP Edit Enterprise! Reaching out to discuss our upcoming software architecture & AI requirements."
  );
  const whatsappUrl = `https://wa.me/${waNumber}?text=${defaultMsg}`;

  return (
    <section className="py-24 relative bg-cyber-950 overflow-hidden scroll-reveal">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-[2.5rem] sm:rounded-[3.5rem] luxury-card border border-white/10 p-8 sm:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full luxury-glass-pill border border-cyan-500/30 text-xs sm:text-sm font-semibold text-cyan-300 mb-8 shadow-glow-cyan/20">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Ready to Build Next-Gen Digital Infrastructure?</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Let&apos;s Architect <span className="text-gradient-cyan">Your Vision</span> With Speed &amp; Precision.
          </h2>

          {/* Description */}
          <p className="mt-6 text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Whether you need a sub-100ms web app, 120Hz native mobile platform, autonomous AI agents, or Meta WhatsApp growth funnels — our principal engineering team is ready.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto">
            {/* 1. Video Discovery Booking */}
            <Link
              href="/book"
              onClick={() => soundFX.click()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/30 hover:scale-[1.02] transition-all group"
            >
              <Calendar className="w-4 h-4 text-cyan-200" />
              <span>Book Discovery Call</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* 2. WhatsApp Direct */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.success()}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 hover:scale-[1.02]"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chat On WhatsApp</span>
            </a>

            {/* 3. Dedicated Contact Page Hub */}
            <Link
              href="/contact"
              onClick={() => soundFX.click()}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Dedicated Contact &amp; NDA Hub</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Bilateral NDA Guarded</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400">
              <Terminal className="w-4 h-4" />
              <span>100% IP &amp; Source Code Handover</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Sparkles className="w-4 h-4" />
              <span>Sub-24hr Scoping Response</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
