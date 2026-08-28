import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import ServicesSection from "@/components/ServicesSection";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import { Layers, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { OrganizationData, ServiceData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Full-Spectrum Software & AI Engineering Services | HP Edit Enterprise",
  description:
    "Explore our 8 dedicated enterprise capabilities: Next.js Web Platforms, Flutter Mobile Apps, Autonomous AI Agent Swarms, WhatsApp Cloud API funnels, and ERP Automations.",
  keywords: ["software development services", "AI agent agency", "Next.js 15 studio", "Flutter app development", "WhatsApp Cloud API integration", "HP Edit Enterprise"],
  alternates: {
    canonical: "https://www.hpedit.com/services",
  },
  openGraph: {
    title: "Full-Spectrum Software & AI Engineering Services | HP Edit Enterprise",
    description: "Architecting high-speed web apps, mobile apps, autonomous AI agents, enterprise automation systems, and WhatsApp integrations.",
    url: "https://www.hpedit.com/services",
    siteName: "HP Edit Enterprise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Services | HP Edit Enterprise",
    description: "Enterprise software, mobile, and autonomous AI capabilities.",
  },
};

export default async function ServicesPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  const services = await prisma.serviceOffering.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar
          organization={org as unknown as OrganizationData}
          services={services as unknown as ServiceData[]}
        />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Layers className="w-3.5 h-3.5" />
                <span>Full-Spectrum Capabilities</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                Enterprise <span className="text-gradient-cyan">Engineering Arsenal</span>
              </h1>
              <p className="mt-4 text-gray-300 text-sm sm:text-lg leading-relaxed">
                From sub-100ms edge web platforms to autonomous multi-agent swarms and official Meta WhatsApp Cloud API funnels.
              </p>
            </div>

            <ServicesSection services={services as unknown as ServiceData[]} />

            {/* Sprint Guarantees Bento */}
            <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Code IP Transfer</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Full Git repositories, deployment scripts, and credentials assigned unconditionally on completion.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sub-100ms Core Web Vitals</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Engineered with edge caching, streaming SSR, and optimized bundle footprints for peak conversion.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mutual NDA on Day One</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Air-gapped data security guarantee. Your proprietary knowledge is never used for public model training.
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
