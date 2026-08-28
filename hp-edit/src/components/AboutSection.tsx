"use client";

import { Building2, Compass, ShieldCheck, Zap, Sparkles, CheckCircle2, TrendingUp, Users } from "lucide-react";
import { OrganizationData, AboutStatItem } from "@/types";

interface AboutSectionProps {
  organization: OrganizationData | null;
}

export default function AboutSection({ organization }: AboutSectionProps) {
  let stats: AboutStatItem[] = [
    { label: "Production Systems Deployed", value: "120+" },
    { label: "Average Performance Boost", value: "340%" },
    { label: "Enterprise API Uptime", value: "99.99%" },
    { label: "Happy Global Clients", value: "50+" },
  ];

  if (organization?.aboutStats) {
    try {
      const parsed = JSON.parse(organization.aboutStats);
      if (Array.isArray(parsed) && parsed.length > 0) {
        stats = parsed;
      }
    } catch {
      // Fallback
    }
  }

  const values = [
    {
      title: "Speed is the Feature",
      desc: "Sub-100ms load times, rapid sprint deliveries, and instant real-time sync. We engineer latency out of existence.",
      icon: Zap,
    },
    {
      title: "Autonomous-First Architecture",
      desc: "We build systems that work for you 24/7—from AI lead triaging to automated ERP reconciliations.",
      icon: Sparkles,
    },
    {
      title: "Ironclad Security & IP",
      desc: "Zero data leakage, bank-grade encryption, and mutual non-disclosure agreements before we write a single line of code.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="about" className="py-24 relative bg-cyber-900 border-t border-white/10 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>About HP Edit Enterprise</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {organization?.aboutHeading || "Forging Digital Supremacy for Modern Enterprises"}
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg">
            We are not an ordinary outsourcer. We are your elite technical co-engineers.
          </p>
        </div>

        {/* Story & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          <div className="lg:col-span-7 rounded-2xl glass-panel p-8 sm:p-10 border border-white/10 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                <Building2 className="w-4 h-4" />
                <span>Our Founding Story</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Engineered for High-Stakes Complexity
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {organization?.aboutStory ||
                  "Founded with a mission to bridge high-level computer science, frontier artificial intelligence, and pragmatic business engineering, HP Edit Enterprise has engineered mission-critical software for global logistics, hyper-scale retail brands, and venture-backed tech startups."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">Our Core Mission</div>
              <p className="text-xs text-gray-200 leading-relaxed">
                {organization?.aboutMission ||
                  "To empower visionary organizations with autonomous AI agents, frictionless workflows, and sub-100ms software architectures that scale effortlessly."}
              </p>
            </div>
          </div>

          {/* Right Core Values (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl glass-panel border border-white/5 flex-1 flex flex-col justify-center"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-white text-sm">{v.title}</h4>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Metric Stats Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((st, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-panel border border-white/10 text-center relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 group-hover:scale-105 transition-transform">
                {st.value}
              </div>
              <div className="text-xs font-medium text-gray-400 mt-2">{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
