import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import TiltCard from "@/components/TiltCard";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import { Briefcase, Sparkles, ArrowRight, CheckCircle2, Zap, Globe, Laptop } from "lucide-react";
import { OrganizationData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers & Open Engineering Roles | HP Edit Enterprise",
  description:
    "Join the top 1% engineering guild at HP Edit Enterprise. We are hiring elite AI engineers, Next.js architects, and mobile developers.",
};

const openRoles = [
  {
    title: "Lead AI & Autonomous Agent Architect",
    type: "Full-Time • Remote / Hybrid",
    experience: "3+ Years Frontier LLMs",
    description: "Design autonomous multi-agent pipelines, LangChain/LlamaIndex RAG topologies, and fine-tuned enterprise models.",
    skills: ["Python", "FastAPI", "Claude 3.7 / Gemini", "Pinecone", "Multi-Agent Systems"],
  },
  {
    title: "Senior Next.js 15 Full-Stack Engineer",
    type: "Full-Time • Remote",
    experience: "4+ Years React / Node",
    description: "Architect sub-100ms web applications, edge compute pipelines, complex glassmorphism UI, and PostgreSQL/Prisma backends.",
    skills: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "PostgreSQL"],
  },
  {
    title: "Principal Mobile Architect (Flutter / iOS / Android)",
    type: "Full-Time • Remote",
    experience: "3+ Years Native / Flutter",
    description: "Build 120Hz smooth cross-platform mobile apps with offline-first sync and deep native OS hardware integrations.",
    skills: ["Flutter", "Dart", "Swift / Kotlin Interop", "State Management", "REST / GraphQL"],
  },
  {
    title: "WhatsApp Cloud API & Growth Engineer",
    type: "Full-Time • Remote",
    experience: "2+ Years API Integrations",
    description: "Build high-throughput automated WhatsApp conversational sales funnels, Webhook workers, and CRM data bridges.",
    skills: ["Meta Graph API", "Node.js", "Redis Queues", "Webhook Workers", "CRM Sync"],
  },
];

export default async function CareersPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  const waNumber = org?.whatsappNumber?.replace(/[^0-9]/g, "") || "919876543210";
  const waMsg = encodeURIComponent(
    "Hello HP Edit Enterprise! I am interested in applying for an engineering role at your studio."
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Join The Top 1% Guild</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                Build The <span className="text-gradient-cyan">Next Era of Software</span>
              </h1>
              <p className="mt-4 text-gray-300 text-sm sm:text-lg leading-relaxed">
                We are looking for engineers, AI practitioners, and design obsessives who want to build high-stakes software that matters.
              </p>
            </div>

            {/* Open Roles List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Current Open Positions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {openRoles.map((role, idx) => (
                  <TiltCard key={idx} glowColor="rgba(6, 182, 212, 0.25)">
                    <div className="h-full rounded-2xl glass-panel p-8 border border-white/10 flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            {role.type}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">{role.experience}</span>
                        </div>

                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {role.title}
                        </h3>

                        <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                          {role.description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {role.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] px-2.5 py-1 rounded bg-white/5 border border-white/5 text-gray-300 font-mono"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-gray-400">Direct Founder Interview</span>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <span>Apply via WhatsApp / Email</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </TiltCard>
                ))}
              </div>
            </div>

            {/* Studio Culture Bento */}
            <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <Globe className="w-6 h-6 text-cyan-400 mb-2" />
                <h3 className="font-bold text-white">100% Async &amp; Remote</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Work from anywhere with deep focus time and zero unnecessary corporate meetings.</p>
              </div>
              <div className="space-y-2">
                <Laptop className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-bold text-white">Frontier AI Compute Stipend</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Unlimited access to Claude 3.7, Gemini 2.0, high-end GPU clusters, and premium dev tooling.</p>
              </div>
              <div className="space-y-2">
                <Zap className="w-6 h-6 text-emerald-400 mb-2" />
                <h3 className="font-bold text-white">Top 5% Compensation</h3>
                <p className="text-xs text-gray-400 leading-relaxed">Competitive retainers, performance bonuses, and direct profit sharing on enterprise milestones.</p>
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
