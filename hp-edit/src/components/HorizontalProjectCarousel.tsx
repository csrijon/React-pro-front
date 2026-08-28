"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ProjectData } from "@/types";
import { Award, TrendingUp, ChevronLeft, ChevronRight, ExternalLink, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import TiltCard from "./TiltCard";
import { soundFX } from "./CyberAudioFx";

interface HorizontalProjectCarouselProps {
  projects: ProjectData[];
}

export default function HorizontalProjectCarousel({ projects }: HorizontalProjectCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    soundFX.click();
    if (!scrollContainerRef.current) return;
    const offset = direction === "left" ? -440 : 440;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section id="showcase" className="py-24 relative bg-cyber-900/60 overflow-hidden border-t border-white/5 scroll-reveal">
      {/* Radial Ambient Lighting */}
      <div className="absolute top-1/2 left-1/3 w-[650px] h-[500px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header & Horizontal Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Award className="w-3.5 h-3.5" />
              <span>Completed Enterprise Deployments</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Battle-Tested <span className="text-gradient-emerald">Systems in Production</span>
            </h2>
            <p className="mt-3 text-gray-400 text-sm sm:text-base max-w-xl leading-relaxed">
              Explore live mission-critical architectures, autonomous multi-agent pipelines, and high-velocity commerce systems.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/case-studies"
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 hidden sm:inline-flex items-center gap-1.5"
            >
              <span>View All Case Studies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center transition-colors active:scale-95"
              aria-label="Previous Project"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-gray-950 flex items-center justify-center transition-all shadow-lg shadow-emerald-500/25 active:scale-95 font-bold"
              aria-label="Next Project"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory"
        >
          {projects.map((proj) => {
            let techList: string[] = [];
            try {
              techList = JSON.parse(proj.techStack);
            } catch {
              techList = [proj.category];
            }

            return (
              <div
                key={proj.id}
                className="w-[85vw] sm:w-[420px] shrink-0 snap-start h-full flex flex-col"
              >
                <TiltCard className="h-full" glowColor="rgba(16, 185, 129, 0.25)">
                  <div className="h-full min-h-[440px] rounded-3xl luxury-card p-7 sm:p-8 border border-white/10 flex flex-col justify-between group">
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          {proj.category}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">{proj.client}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors min-h-[56px] flex items-center">
                        {proj.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 min-h-[60px] flex items-center">
                        {proj.description}
                      </p>

                      {/* Impact Highlight Badge */}
                      <div className="mt-5 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2.5 min-h-[46px]">
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="text-xs font-bold text-emerald-300 truncate">
                          {proj.metrics}
                        </div>
                      </div>

                      {/* Tech Chips */}
                      <div className="mt-4 flex flex-wrap gap-1.5 min-h-[32px] items-center">
                        {techList.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-gray-300 font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Production Verified</span>
                      </span>

                      <Link
                        href="/case-studies"
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Case Study</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
