"use client";

import { useState } from "react";
import { ProjectData } from "@/types";
import { ExternalLink, Sparkles, TrendingUp, Cpu, Award } from "lucide-react";

interface ShowcaseSectionProps {
  projects: ProjectData[];
}

export default function ShowcaseSection({ projects }: ShowcaseSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filterOptions = ["All", "AI Agents", "Web & Cloud", "Mobile", "WhatsApp"];

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter((p) =>
        p.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
        p.title.toLowerCase().includes(activeFilter.toLowerCase())
      );

  return (
    <section id="showcase" className="py-24 relative bg-cyber-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Proven Enterprise Impact</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered Systems, <br />
            <span className="text-gradient-emerald">Measurable Business Outcomes</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg">
            Explore high-performance solutions we have engineered across artificial intelligence, web platforms, and mobile apps.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeFilter === f
                  ? "bg-emerald-500 text-gray-950 font-bold shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => {
            let techList: string[] = [];
            try {
              techList = JSON.parse(proj.techStack);
            } catch {
              techList = [proj.category];
            }

            return (
              <div
                key={proj.id}
                className="group relative rounded-2xl glass-panel-interactive p-8 border border-white/10 flex flex-col justify-between overflow-hidden"
              >
                {/* Glow */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      {proj.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{proj.client}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {proj.title}
                  </h3>

                  <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Impact Metric Callout */}
                  <div className="mt-6 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Verified Result</div>
                      <div className="text-xs sm:text-sm font-extrabold text-emerald-300">{proj.metrics}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  {/* Tech stack pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {techList.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {proj.demoUrl && (
                    <div className="flex items-center justify-end">
                      <span className="text-xs font-medium text-emerald-400 group-hover:underline flex items-center gap-1">
                        <span>Architecture Case Study</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
