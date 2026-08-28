import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import TiltCard from "@/components/TiltCard";
import { Compass, Sparkles, ShieldCheck, Zap, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { OrganizationData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us & Engineering Philosophy | HP Edit Enterprise",
  description:
    "Learn about HP Edit Enterprise: Our mission to bridge high-level computer science, frontier artificial intelligence, and pragmatic business software architecture.",
  keywords: ["about HP Edit", "software studio philosophy", "AI engineering team", "enterprise technology partner", "Next.js architects", "Bengaluru software studio"],
  alternates: {
    canonical: "https://www.hpedit.com/about",
  },
  openGraph: {
    title: "About Us & Engineering Philosophy | HP Edit Enterprise",
    description: "Forging digital supremacy for modern enterprises through high-velocity software engineering and autonomous AI agent architectures.",
    url: "https://www.hpedit.com/about",
    siteName: "HP Edit Enterprise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About HP Edit Enterprise",
    description: "Our engineering philosophy and enterprise software mission.",
  },
};

export default async function AboutPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  let statsList: Array<{ label: string; value: string }> = [
    { label: "Production Systems Deployed", value: "120+" },
    { label: "Average Performance Boost", value: "340%" },
    { label: "Enterprise API Uptime", value: "99.99%" },
    { label: "Happy Global Clients", value: "50+" },
  ];

  try {
    if (org?.aboutStats) {
      const parsed = JSON.parse(org.aboutStats);
      if (Array.isArray(parsed) && parsed.length > 0) statsList = parsed;
    }
  } catch {
    // Keep default
  }

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-20">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Compass className="w-3.5 h-3.5" />
                <span>Our Story &amp; Philosophy</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                {org?.aboutHeading || "Forging Digital Supremacy for Modern Enterprises"}
              </h1>
            </div>

            {/* Narrative Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between space-y-6">
                <div className="space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed">
                  <p>
                    {org?.aboutStory ||
                      "Founded with a mission to bridge high-level computer science, frontier artificial intelligence, and pragmatic business engineering, HP Edit Enterprise has engineered mission-critical software for global logistics, hyper-scale retail brands, and venture-backed tech startups."}
                  </p>
                  <p className="text-sm text-gray-400">
                    We discard bloated corporate agency bureaucracy in favor of rapid, 2-to-3 week production sprints with weekly working staging releases and 100% full source code ownership.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Sub-100ms Edge Latency SLA</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Day-1 Bilateral Mutual NDA</span>
                  </div>
                </div>
              </div>

              {/* Mission Statement Card */}
              <div className="lg:col-span-5 p-8 sm:p-12 rounded-3xl glass-dropdown border border-cyan-500/30 flex flex-col justify-between space-y-6 bg-gradient-to-br from-cyan-950/40 via-cyber-900 to-purple-950/40">
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 inline-block">
                    Core Mission
                  </span>
                  <h3 className="text-2xl font-bold text-white leading-snug">
                    {org?.aboutMission ||
                      "To empower visionary organizations with autonomous AI agents, frictionless workflows, and sub-100ms software architectures that scale effortlessly."}
                  </h3>
                </div>

                <Link
                  href="/estimator"
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-300 hover:text-cyan-200"
                >
                  <span>Launch Interactive Scope Estimator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Impact Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statsList.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl glass-panel border border-white/10 text-center space-y-2 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 font-mono">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
