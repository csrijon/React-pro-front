"use client";

import { Star, Quote, CheckCircle, Volume2, ShieldCheck } from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import TiltCard from "./TiltCard";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  highlight: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "HP Edit Enterprise built our logistics AI extraction engine in 3 weeks. What previously took our team 8 hours a day now runs autonomously in under 2 seconds. The speed and polish exceeded all expectations.",
    author: "Vikram Malhotra",
    role: "Chief Technology Officer",
    company: "Apex Global Logistics",
    rating: 5,
    highlight: "94% Manual Time Saved",
  },
  {
    quote: "The WhatsApp automation pipeline they engineered scaled our sales funnel exponentially. Customers browse our catalog, receive instant AI quotations, and pay seamlessly. Our ROAS spiked 3.8x.",
    author: "Elena Rostova",
    role: "Head of Growth",
    company: "HyperScale Retail",
    rating: 5,
    highlight: "3.8x ROAS Multiplier",
  },
  {
    quote: "Finding an agency that truly excels in Next.js 15, mobile Flutter, and custom AI agents under one roof is rare. Their engineering discipline and 24/7 reliability makes them our permanent technical partner.",
    author: "Marcus Chen",
    role: "Co-Founder & VP Engineering",
    company: "Vanguard Systems",
    rating: 5,
    highlight: "Flawless Multi-Platform Delivery",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 relative bg-cyber-950 overflow-hidden scroll-reveal">
      {/* Radial Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Quote className="w-3.5 h-3.5" />
            <span>Verified Client Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Trusted By <span className="text-gradient-purple">Forward-Thinking Leaders</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed">
            Hear from founders, CTOs, and product directors who partnered with HP Edit Enterprise to scale their digital infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2 -m-2">
          {testimonials.map((t, idx) => (
            <TiltCard key={idx} className="h-full" glowColor="rgba(139, 92, 246, 0.25)">
              <div className="h-full p-8 rounded-3xl luxury-card border border-white/10 flex flex-col justify-between group">
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      {t.highlight}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 italic leading-relaxed min-h-[96px] flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{t.author}</div>
                    <div className="text-xs text-gray-400">
                      {t.role}, <span className="text-cyan-400">{t.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
