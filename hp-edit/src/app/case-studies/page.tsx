import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import HorizontalProjectCarousel from "@/components/HorizontalProjectCarousel";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import TiltCard from "@/components/TiltCard";
import { Award, ArrowRight, ExternalLink, Zap, TrendingUp, CheckCircle2 } from "lucide-react";
import { OrganizationData, ProjectData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies & Client Impact Metrics | HP Edit Enterprise",
  description:
    "Explore verified client case studies: Hyper-scale Next.js platforms, Autonomous AI Logistics Agents, 120Hz Flutter apps, and WhatsApp enterprise funnels.",
  keywords: ["software case studies", "AI agent deployments", "Next.js 15 portfolio", "Flutter mobile apps", "client ROI metrics", "HP Edit Enterprise"],
  alternates: {
    canonical: "https://www.hpedit.com/case-studies",
  },
  openGraph: {
    title: "Case Studies & Client Impact Metrics | HP Edit Enterprise",
    description: "Explore verified enterprise case studies and quantifiable ROI achievements across global clients.",
    url: "https://www.hpedit.com/case-studies",
    siteName: "HP Edit Enterprise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Case Studies | HP Edit Enterprise",
    description: "Verified engineering case studies and performance metrics.",
  },
};

export default async function CaseStudiesPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  const projects = await prisma.projectShowcase.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Award className="w-3.5 h-3.5" />
                <span>Verified Impact</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                Engineered for <span className="text-gradient-cyan">Quantifiable Impact</span>
              </h1>
              <p className="mt-4 text-gray-300 text-sm sm:text-lg leading-relaxed">
                Real software platforms delivered with sub-100ms response times, automated intelligence, and rapid business velocity.
              </p>
            </div>

            <HorizontalProjectCarousel projects={projects as unknown as ProjectData[]} />

            {/* Case Studies Detailed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, idx) => {
                let techList: string[] = [];
                try {
                  techList = JSON.parse(project.techStack || "[]");
                } catch {
                  techList = project.techStack ? project.techStack.split(",") : [];
                }

                return (
                  <TiltCard key={project.id || idx} glowColor="rgba(6, 182, 212, 0.25)">
                    <div className="h-full rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            {project.category}
                          </span>
                          <span className="text-xs font-mono text-gray-400">{project.client}</span>
                        </div>

                        <h3 className="text-2xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                          {project.title}
                        </h3>

                        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Metrics Badge */}
                        <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                          <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div className="text-xs font-bold text-emerald-300">
                            {project.metrics}
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="mt-6 flex flex-wrap gap-2">
                          {techList.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[11px] font-mono px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-gray-400">100% Code IP Handover</span>
                        {project.demoUrl ? (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                          >
                            <span>Live System Preview</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <Link
                            href="/estimator"
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                          >
                            <span>Request Architecture Scope</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
