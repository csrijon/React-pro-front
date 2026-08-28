"use client";

import { useState } from "react";
import { FaqData } from "@/types";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { soundFX } from "./CyberAudioFx";

interface FaqSectionProps {
  faqs: FaqData[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  const toggleFaq = (idx: number) => {
    soundFX.click();
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 relative bg-cyber-950 overflow-hidden scroll-reveal">
      {/* Ambient background spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Clear Answers, <span className="text-gradient-amber">Zero Ambiguity</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed">
            Everything you need to know about our engagement model, intellectual property handover, and engineering standards.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl luxury-card border transition-all duration-200 overflow-hidden ${
                  isOpen ? "border-amber-500/40 shadow-lg shadow-amber-500/5" : "border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/3 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-white flex items-center gap-3">
                    <span className="text-xs font-mono text-cyan-400">0{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-amber-500/10 text-amber-400" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-300 border-t border-white/5 leading-relaxed animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
