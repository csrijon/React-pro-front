"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Smartphone,
  Cpu,
  Zap,
  MessageSquare,
  TrendingUp,
  Monitor,
  Server,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { ServiceData } from "@/types";
import TiltCard from "./TiltCard";
import { soundFX } from "./CyberAudioFx";

interface ServicesSectionProps {
  services: ServiceData[];
  onSelectServiceForEstimate?: (serviceTitle: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Cpu,
  Zap,
  MessageSquare,
  TrendingUp,
  Monitor,
  Server,
};

export default function ServicesSection({ services, onSelectServiceForEstimate }: ServicesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceData | null>(null);

  const categories = ["All", "Web & Cloud", "Mobile", "AI & Intelligence", "Enterprise Automation", "Messaging & Conversions", "Growth & Marketing"];

  const filteredServices = activeCategory === "All"
    ? services
    : services.filter((s) => s.category.toLowerCase().includes(activeCategory.toLowerCase()) || activeCategory.toLowerCase().includes(s.category.toLowerCase()));

  const handleServiceClick = (service: ServiceData) => {
    soundFX.click();
    setSelectedServiceModal(service);
  };

  const handleEstimateClick = (serviceTitle: string) => {
    setSelectedServiceModal(null);
    if (onSelectServiceForEstimate) {
      onSelectServiceForEstimate(serviceTitle);
    }
    const element = document.getElementById("estimator");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-24 relative bg-cyber-950/80 overflow-hidden scroll-reveal">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Full-Spectrum Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered For Scale, <br />
            <span className="text-gradient-cyan">Built For Dominance</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg leading-relaxed">
            From zero to enterprise deployment. We architect, program, train, and scale mission-critical software systems.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFX.click();
                setActiveCategory(cat);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-cyan-500 text-gray-950 shadow-glow-cyan font-bold"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2 -m-2">
          {filteredServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Globe;
            const features = JSON.parse(service.features || "[]") as string[];

            return (
              <div
                key={service.id}
                className={`h-full scroll-reveal-stagger-${(index % 3) + 1}`}
              >
                <TiltCard className="h-full">
                  <div
                    onClick={() => handleServiceClick(service)}
                    className="luxury-card h-full p-7 rounded-3xl flex flex-col justify-between cursor-pointer group relative"
                  >
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all duration-300">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                          {service.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2.5 min-h-[56px] flex items-center">
                        {service.title}
                      </h3>

                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 min-h-[48px] flex-1">
                        {service.shortDescription}
                      </p>

                      {features.length > 0 && (
                        <div className="space-y-2 mb-6 border-t border-white/5 pt-4 min-h-[76px]">
                          {features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold text-cyan-400 pt-4 border-t border-white/5 group-hover:text-cyan-300 mt-auto">
                      <span>Explore Details &amp; Scope</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA to Explore All Services */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            onClick={() => soundFX.click()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors"
          >
            <span>Explore All 8 Dedicated Capabilities</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl glass-dropdown border border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  {selectedServiceModal.category}
                </span>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {selectedServiceModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedServiceModal(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              {selectedServiceModal.fullDescription || selectedServiceModal.shortDescription}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-3">
              <Link
                href={`/services/${selectedServiceModal.slug}`}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
              >
                Dedicated Blueprint Page
              </Link>

              <button
                type="button"
                onClick={() => handleEstimateClick(selectedServiceModal.title)}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25"
              >
                <span>Calculate Scope &amp; Cost</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
