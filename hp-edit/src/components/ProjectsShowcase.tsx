"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  X,
  Code2,
  Clock,
  Terminal,
  Cpu,
  Smartphone,
  Globe,
  Zap,
  MessageSquare
} from "lucide-react";
import { ProjectData } from "@/types";
import { soundFX } from "./CyberAudioFx";
import TiltCard from "./TiltCard";

interface ProjectsShowcaseProps {
  projects: ProjectData[];
  title?: string;
  subtitle?: string;
  limit?: number;
  showFilters?: boolean;
}

const CATEGORIES = [
  { id: "all", label: "All Engineering Projects" },
  { id: "ai", label: "AI Agents & RAG" },
  { id: "web", label: "Full-Stack Web & Cloud" },
  { id: "mobile", label: "Mobile Apps (iOS/Android)" },
  { id: "automation", label: "Enterprise Automation & ERP" },
  { id: "whatsapp", label: "WhatsApp Growth Funnels" },
];

export default function ProjectsShowcase({
  projects,
  title = "Engineered Platforms & Previous Work",
  subtitle = "Explore verified enterprise architectures, hyper-scale web applications, and autonomous AI systems built by HP Edit Enterprise.",
  limit,
  showFilters = true,
}: ProjectsShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "all") return true;
    const cat = p.category.toLowerCase();
    if (activeCategory === "ai" && (cat.includes("ai") || cat.includes("agent") || cat.includes("rag"))) return true;
    if (activeCategory === "web" && (cat.includes("web") || cat.includes("cloud") || cat.includes("saas") || cat.includes("full-stack"))) return true;
    if (activeCategory === "mobile" && (cat.includes("mobile") || cat.includes("flutter") || cat.includes("ios") || cat.includes("android"))) return true;
    if (activeCategory === "automation" && (cat.includes("auto") || cat.includes("erp") || cat.includes("bot"))) return true;
    if (activeCategory === "whatsapp" && (cat.includes("whatsapp") || cat.includes("chat") || cat.includes("funnel"))) return true;
    return false;
  });

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  const parseTech = (tech: string): string[] => {
    try {
      const parsed = JSON.parse(tech);
      return Array.isArray(parsed) ? parsed : tech.split(",");
    } catch {
      return tech ? tech.split(",") : ["Next.js 15", "TypeScript", "PostgreSQL"];
    }
  };

  return (
    <section id="projects" className="py-24 relative bg-cyber-950/90 border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Featured Engineering Portfolio</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            {title}
          </h2>

          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  soundFX.click();
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-cyan-500 text-gray-950 shadow-lg shadow-cyan-500/25 scale-105"
                    : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, idx) => {
            const techList = parseTech(project.techStack);

            return (
              <TiltCard key={project.id || idx} glowColor="rgba(6, 182, 212, 0.25)">
                <div
                  onClick={() => {
                    soundFX.click();
                    setSelectedProject(project);
                  }}
                  className="h-full rounded-3xl glass-panel p-6 sm:p-7 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group cursor-pointer shadow-xl relative overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Header Row: Category Badge & Client */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
                        {project.category}
                      </span>
                      <span className="text-xs font-mono text-gray-400 font-medium truncate max-w-[140px]">
                        {project.client}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    {/* High-Impact Metric Badge */}
                    {project.metrics && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2.5 text-xs text-emerald-300 font-bold">
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate">{project.metrics}</span>
                      </div>
                    )}

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {techList.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                      {techList.length > 4 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 text-cyan-400 font-semibold">
                          +{techList.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-mono text-[11px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>100% IP Handover</span>
                    </span>

                    <span className="font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>View Blueprint</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* View All / Case Studies CTA */}
        {limit && (
          <div className="text-center pt-4">
            <Link
              href="/case-studies"
              onClick={() => soundFX.click()}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors"
            >
              <span>Explore All Verified Case Studies &amp; Architecture Logs</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        )}
      </div>

      {/* Interactive Project Deep-Dive Lightbox Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl glass-dropdown border border-cyan-500/40 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs font-mono text-gray-400 font-semibold">
                    Client: {selectedProject.client}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {selectedProject.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundFX.click();
                  setSelectedProject(null);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quantifiable Result Banner */}
            {selectedProject.metrics && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-transparent border border-emerald-500/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Primary Verified Business Metric
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-white">
                    {selectedProject.metrics}
                  </div>
                </div>
              </div>
            )}

            {/* Architecture & Scope Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Technical Architecture &amp; Execution Narrative</span>
              </h4>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-200 leading-relaxed space-y-3 font-sans">
                <p>{selectedProject.description}</p>
                <p className="text-gray-400 text-xs">
                  Delivered with automated CI/CD deployment pipelines, zero-downtime database migrations, and 100% intellectual property ownership transfer upon milestone sign-off.
                </p>
              </div>
            </div>

            {/* Tech Stack Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Production Stack &amp; Protocols</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {parseTech(selectedProject.techStack).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-200 font-medium"
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>NDA &amp; Bilateral Compliance Protected</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Open Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  </a>
                )}
                <Link
                  href="/contact"
                  onClick={() => {
                    soundFX.click();
                    setSelectedProject(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <span>Build Similar System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
