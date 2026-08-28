"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Calendar, ChevronRight, Play, ShieldCheck, Activity, Cpu, Bot } from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import { OrganizationData } from "@/types";
import WhatsAppIcon from "./WhatsAppIcon";
import Hero3DVisualizer from "./Hero3DVisualizer";

interface HeroSectionProps {
  organization: OrganizationData | null;
  onOpenGuidedSession?: () => void;
}

export default function HeroSection({ organization, onOpenGuidedSession }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = Math.min(width > 768 ? 40 : 15, 45);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const colors = ["#06B6D4", "#3B82F6", "#8B5CF6", "#10B981"];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        const mdx = p1.x - mouseX;
        const mdy = p1.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 80) {
          p1.x += (mdx / mdist) * 1.1;
          p1.y += (mdy / mdist) * 1.1;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const waNumber = organization?.whatsappNumber?.replace(/[^0-9]/g, "") || "919876543210";
  const defaultMsg = encodeURIComponent(
    organization?.whatsappDefaultMessage ||
      "Hello HP Edit Enterprise! I want to consult on an upcoming software / AI project."
  );
  const whatsappUrl = `https://wa.me/${waNumber}?text=${defaultMsg}`;

  return (
    <section className="relative min-h-[92vh] pt-32 pb-16 px-3 sm:px-6 lg:px-8 bg-cyber-950 flex items-center justify-center overflow-hidden">
      {/* Dynamic Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
      />

      {/* Radial Spotlights with Scroll Parallax */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[700px] h-[500px] bg-radial-gradient rounded-full blur-[180px] pointer-events-none scroll-parallax-mesh" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[450px] bg-radial-gradient-purple rounded-full blur-[180px] pointer-events-none" />

      {/* Hero Cocoon Card */}
      <div className="relative z-10 w-full max-w-7xl mx-auto rounded-[2.5rem] sm:rounded-[3.5rem] luxury-card border border-white/[0.12] p-6 sm:p-12 lg:p-16 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
          {/* Left Column: Authoritative Copy & Conversion CTAs (7 Cols) */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Top Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-glow-cyan/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Software &amp; Autonomous AI Swarms</span>
              <ChevronRight className="w-3 h-3 text-cyan-400/70" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              We Architect{" "}
              <span className="text-gradient-cyan">Superfast Software</span>,{" "}
              <span className="text-gradient-purple">AI Agents</span> &amp; High-Impact Systems.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl leading-relaxed">
              {organization?.description ||
                "Elite digital engineering studio building sub-100ms web platforms, 120Hz native mobile apps, autonomous AI agent swarms, and official Meta WhatsApp Cloud API growth engines."}
            </p>

            {/* High-Converting CTA Suite */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* 1. Schedule Video Discovery Call */}
              <Link
                href="/book"
                onClick={() => soundFX.click()}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/30 hover:scale-[1.02] transition-all group"
              >
                <Calendar className="w-4 h-4 text-cyan-200" />
                <span>Book Discovery Call</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {/* 2. WhatsApp Direct Chat */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.success()}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Chat On WhatsApp</span>
              </a>

              {/* 3. Live AI Sandbox */}
              <Link
                href="#ai-demo"
                onClick={() => soundFX.click()}
                className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Sandbox</span>
              </Link>
            </div>

            {/* Performance Metrics Row */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="luxury-card h-full p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                <div className="text-lg sm:text-xl font-bold text-cyan-400">&lt; 80ms</div>
                <div className="text-[10px] text-gray-400 font-medium">Edge &amp; API Latency</div>
              </div>
              <div className="luxury-card h-full p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                <div className="text-lg sm:text-xl font-bold text-purple-400">Autonomous</div>
                <div className="text-[10px] text-gray-400 font-medium">Multi-Agent Swarms</div>
              </div>
              <div className="luxury-card h-full p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                <div className="text-lg sm:text-xl font-bold text-emerald-400">Official API</div>
                <div className="text-[10px] text-gray-400 font-medium">Meta WhatsApp Cloud</div>
              </div>
              <div className="luxury-card h-full p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                <div className="text-lg sm:text-xl font-bold text-amber-400">100% IP</div>
                <div className="text-[10px] text-gray-400 font-medium">Source &amp; Schema Handover</div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive WebGL Quantum Neural Core (5 Cols) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <Hero3DVisualizer />
          </div>
        </div>
      </div>
    </section>
  );
}
