"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sliders,
  Compass,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  RotateCcw
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";
import { OrganizationData } from "@/types";

// Import the 10 Story Acts
import Act01Interruption from "./Act01Interruption";
import Act02TheLeak from "./Act02TheLeak";
import Act03RealityFlipCards from "./Act03RealityFlipCards";
import Act04TurningPoint from "./Act04TurningPoint";
import Act05BusinessOperatingSystem from "./Act05BusinessOperatingSystem";
import Act06TransformationMatrix from "./Act06TransformationMatrix";
import Act07Outcomes from "./Act07Outcomes";
import Act08BottleneckDiagnostic from "./Act08BottleneckDiagnostic";
import Act09ProofStories from "./Act09ProofStories";
import Act10FinalConversation from "./Act10FinalConversation";

interface HorizontalStoryTrackProps {
  organization: OrganizationData | null;
}

const ACT_META = [
  { id: "act-01", num: "01", title: "The Interruption", subtitle: "Operational Friction Reality", component: Act01Interruption },
  { id: "act-02", num: "02", title: "The Silent Leak", subtitle: "Dynamic Annual Revenue Loss", component: Act02TheLeak },
  { id: "act-03", num: "03", title: "Reality Check", subtitle: "3D Perspective Flip Diagnosis", component: Act03RealityFlipCards },
  { id: "act-04", num: "04", title: "The Turning Point", subtitle: "1.8s Autonomous Conduit Flow", component: Act04TurningPoint },
  { id: "act-05", num: "05", title: "The Operating System", subtitle: "6 Unified Machinery Pillars", component: Act05BusinessOperatingSystem },
  { id: "act-06", num: "06", title: "Transformation Matrix", subtitle: "Before vs. After Comparison", component: Act06TransformationMatrix },
  { id: "act-07", num: "07", title: "Business Outcomes", subtitle: "Velocity & Conversion Benchmarks", component: Act07Outcomes },
  { id: "act-08", num: "08", title: "Diagnostic Blueprint", subtitle: "Self-Selection & Solution Spec", component: Act08BottleneckDiagnostic },
  { id: "act-09", num: "09", title: "Proof Transformations", subtitle: "Verified Architecture Case Studies", component: Act09ProofStories },
  { id: "act-10", num: "10", title: "The First Step", subtitle: "Conversational Architecture Intake", component: Act10FinalConversation },
];

export default function HorizontalStoryTrack({ organization }: HorizontalStoryTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeActIndex, setActiveActIndex] = useState(0);
  const [isHorizontalMode, setIsHorizontalMode] = useState(true);

  // Calculate smooth scroll translation based on vertical page scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current || !trackRef.current || !isHorizontalMode) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalHeight = containerRef.current.offsetHeight - windowHeight;

    if (totalHeight <= 0) return;

    // Relative scroll within this section
    const currentScroll = -rect.top;
    const progress = Math.min(Math.max(currentScroll / totalHeight, 0), 1);

    setScrollProgress(progress);

    // Active Act Index (0 to 9)
    const actIndex = Math.min(
      Math.floor(progress * ACT_META.length),
      ACT_META.length - 1
    );
    setActiveActIndex(actIndex);

    // Apply hardware-accelerated horizontal transform to the inner track
    const trackWidth = trackRef.current.scrollWidth;
    const maxTranslate = trackWidth - window.innerWidth;
    const translateX = progress * maxTranslate;

    trackRef.current.style.transform = `translate3d(-${translateX}px, 0, 0)`;
  }, [isHorizontalMode]);

  useEffect(() => {
    if (!isHorizontalMode) {
      if (trackRef.current) {
        trackRef.current.style.transform = "none";
      }
      return;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll, isHorizontalMode]);

  // Jump to specific Act
  const jumpToAct = (index: number) => {
    soundFX.click();
    if (!containerRef.current) return;

    if (!isHorizontalMode) {
      const el = document.getElementById(`vertical-${ACT_META[index].id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    const containerTop = containerRef.current.offsetTop;
    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + (index / (ACT_META.length - 1)) * totalHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  // Previous Act / Next Act navigation
  const prevAct = () => {
    if (activeActIndex > 0) {
      jumpToAct(activeActIndex - 1);
    }
  };

  const nextAct = () => {
    if (activeActIndex < ACT_META.length - 1) {
      jumpToAct(activeActIndex + 1);
    }
  };

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextAct();
      } else if (e.key === "ArrowLeft") {
        prevAct();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeActIndex]);

  // If user switches to Vertical mode, render as standard vertical stack
  if (!isHorizontalMode) {
    return (
      <div className="space-y-16 py-12 relative">
        {/* Floating View Mode Switcher Header */}
        <div className="sticky top-20 z-30 flex justify-center px-4">
          <div className="luxury-glass-pill px-4 py-2 rounded-full border border-cyan-500/30 flex items-center gap-3 shadow-2xl">
            <span className="text-xs font-mono text-cyan-300 font-bold">
              View Mode: Continuous Vertical Flow
            </span>
            <button
              type="button"
              onClick={() => {
                soundFX.click();
                setIsHorizontalMode(true);
              }}
              className="px-3 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-cyan/20"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Switch to Horizontal Cinematic Mode</span>
            </button>
          </div>
        </div>

        {ACT_META.map((act) => {
          const Component = act.component;
          return (
            <div key={act.id} id={`vertical-${act.id}`} className="scroll-reveal">
              <Component organization={organization} />
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal Pinned Experience
  return (
    <div
      ref={containerRef}
      className="relative bg-cyber-950 w-full"
      style={{
        // 10 acts = 750vh vertical scroll track for ultra-smooth pacing
        height: `${ACT_META.length * 75}vh`,
      }}
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        {/* Top Connecting Power Grid Laser Conduit */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 pointer-events-none z-30 shadow-[0_0_15px_rgba(6,182,212,0.9)]" />

        {/* Ambient Floating Grid Backdrop */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

        {/* TOP FLOATING HUD — Act Counter & Mode Toggle */}
        <div className="relative z-30 pt-20 px-4 sm:px-8 max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto">
          {/* Act Badge & Chapter Indicator */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1 rounded-full luxury-glass-pill border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-glow-cyan/15">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>
                Act {ACT_META[activeActIndex].num} / 10
              </span>
              <span className="text-gray-400 font-normal">|</span>
              <span className="text-white hidden sm:inline font-sans font-bold">
                {ACT_META[activeActIndex].title}
              </span>
            </div>
            <span className="text-xs text-gray-300 font-mono hidden md:inline">
              ({ACT_META[activeActIndex].subtitle})
            </span>
          </div>

          {/* Right Action Suite: Mode Switcher & Progress % */}
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 font-bold hidden sm:flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{Math.round(scrollProgress * 100)}% JOURNEY</span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundFX.click();
                setIsHorizontalMode(false);
              }}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Switch to vertical page flow"
            >
              <Minimize2 className="w-3.5 h-3.5 text-gray-300" />
              <span className="hidden sm:inline">Vertical Mode</span>
            </button>
          </div>
        </div>

        {/* HORIZONTAL TRANSLATING TRACK */}
        <div
          ref={trackRef}
          className="flex flex-row items-center h-full will-change-transform transition-transform duration-75 ease-out select-none"
          style={{ width: `${ACT_META.length * 100}vw` }}
        >
          {ACT_META.map((act, index) => {
            const Component = act.component;
            const isActive = activeActIndex === index;

            return (
              <div
                key={act.id}
                className="w-screen h-full flex-shrink-0 flex items-center justify-center px-4 sm:px-8 lg:px-12 py-10 relative overflow-y-auto"
              >
                {/* Horizontal Flow Connecting Node Card */}
                <div
                  className={`w-full max-w-6xl mx-auto transition-all duration-700 ${
                    isActive
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-40 scale-95 translate-y-4"
                  }`}
                >
                  <Component organization={organization} />
                </div>

                {/* Right Edge Inter-Act Cyber Gateway Marker */}
                {index < ACT_META.length - 1 && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-2 opacity-30 pointer-events-none">
                    <span className="w-px h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
                    <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="w-px h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* BOTTOM FLOATING CINEMATIC NAVIGATION BAR & TIMELINE SCRUBBER */}
        <div className="relative z-30 pb-6 px-4 sm:px-8 max-w-5xl mx-auto w-full pointer-events-auto">
          <div className="luxury-glass-pill p-3 sm:p-4 rounded-3xl border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Quick Act Steppers (Prev / Next) */}
            <div className="flex items-center gap-1.5 order-2 sm:order-1">
              <button
                type="button"
                onClick={prevAct}
                disabled={activeActIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev Act</span>
              </button>

              <button
                type="button"
                onClick={nextAct}
                disabled={activeActIndex === ACT_META.length - 1}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next Act</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive 10-Node Timeline Scrubber */}
            <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
              {ACT_META.map((act, idx) => {
                const isCurrent = activeActIndex === idx;
                const isPast = idx < activeActIndex;

                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => jumpToAct(idx)}
                    className={`group relative p-1 transition-all ${
                      isCurrent ? "scale-125" : "hover:scale-110"
                    }`}
                    title={`Jump to Act ${act.num}: ${act.title}`}
                  >
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? "w-7 sm:w-8 bg-cyan-400 shadow-glow-cyan"
                          : isPast
                          ? "w-2.5 sm:w-3 bg-cyan-500/50"
                          : "w-2.5 sm:w-3 bg-white/20 hover:bg-white/40"
                      }`}
                    />

                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-cyber-900 border border-cyan-500/40 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-xl z-40">
                      Act {act.num}: {act.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Hint for wheel scroll */}
            <div className="text-[11px] font-mono text-gray-400 hidden lg:flex items-center gap-1.5 order-3 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Scroll down or use ← → keys</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
