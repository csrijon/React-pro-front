"use client";

import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Eye,
  EyeOff,
  Layers,
  Activity,
  Cpu,
  Compass,
  FileCode,
  ShieldCheck,
  Save
} from "lucide-react";
import { soundFX } from "../CyberAudioFx";
import { OrganizationData, FeatureToggles } from "@/types";
import { DEFAULT_FEATURE_TOGGLES, parseFeatureToggles } from "@/lib/featureToggles";
import { updateFeatureTogglesAction } from "@/lib/actions";

interface SiteTogglesManagerProps {
  organization: OrganizationData | null;
}

export default function SiteTogglesManager({ organization }: SiteTogglesManagerProps) {
  const [toggles, setToggles] = useState<FeatureToggles>(() =>
    parseFeatureToggles(organization?.featureToggles)
  );
  const [activeCategory, setActiveCategory] = useState<"HOME" | "MODULES" | "WIDGETS">("HOME");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleToggle = (key: keyof FeatureToggles) => {
    soundFX.click();
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleApplyPreset = (preset: "ALL" | "MINIMAL" | "LEAD_GEN") => {
    soundFX.success();
    if (preset === "ALL") {
      setToggles({ ...DEFAULT_FEATURE_TOGGLES });
    } else if (preset === "MINIMAL") {
      setToggles({
        ...DEFAULT_FEATURE_TOGGLES,
        homeAct01Interruption: true,
        homeAct04TurningPoint: true,
        homeAct05OperatingSystem: true,
        homeAct07Outcomes: true,
        homeCostEstimator: true,
        homeFaqSection: true,
        homeAct10FinalConversation: true,
        homeAct02TheLeak: false,
        homeAct03RealityFlipCards: false,
        homeAct06TransformationMatrix: false,
        homeAct08BottleneckDiagnostic: false,
        homeAct09ProofStories: false,
        widgetPreloader: false,
      });
    } else if (preset === "LEAD_GEN") {
      setToggles({
        ...DEFAULT_FEATURE_TOGGLES,
        homeAct01Interruption: true,
        homeAct02TheLeak: true,
        homeAct07Outcomes: true,
        homeCostEstimator: true,
        homeAct10FinalConversation: true,
        moduleMaturityScorecard: true,
        moduleRoiCalculator: true,
        widgetWhatsappPopup: true,
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      soundFX.click();
      await updateFeatureTogglesAction(toggles as unknown as Record<string, boolean>);
      soundFX.success();
      setStatusMessage({ type: "success", text: "Site visibility & feature toggles saved and published live!" });
    } catch (err: unknown) {
      soundFX.error();
      const message = err instanceof Error ? err.message : "Failed to save feature toggles.";
      setStatusMessage({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  const activeCount = Object.values(toggles).filter(Boolean).length;
  const totalCount = Object.keys(toggles).length;

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>Granular Site Modules &amp; Section Toggles</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              {activeCount} of {totalCount} Modules Active
            </span>
          </div>
          <p className="text-xs text-gray-300 font-medium mt-1">
            Instantly show or hide any story act, laboratory tool, or floating widget on the live customer-facing platform.
          </p>
        </div>

        {/* Action Suite & Save Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => handleApplyPreset("ALL")}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold transition-colors"
            title="Enable all modules"
          >
            Enable All
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("MINIMAL")}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold transition-colors"
            title="Fast minimalist configuration"
          >
            Minimalist
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("LEAD_GEN")}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold transition-colors"
            title="High-conversion lead generation layout"
          >
            Lead-Gen Focus
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow-cyan/20 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Publishing Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save &amp; Publish Toggles</span>
              </>
            )}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            soundFX.click();
            setActiveCategory("HOME");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeCategory === "HOME"
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
              : "bg-white/5 text-gray-300 hover:text-white border border-transparent"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Homepage Story Acts (12)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.click();
            setActiveCategory("MODULES");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeCategory === "MODULES"
              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
              : "bg-white/5 text-gray-300 hover:text-white border border-transparent"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Interactive Labs &amp; Tools (7)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.click();
            setActiveCategory("WIDGETS");
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeCategory === "WIDGETS"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-white/5 text-gray-300 hover:text-white border border-transparent"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Global Experience &amp; Widgets (6)</span>
        </button>
      </div>

      {/* Category 1: Homepage Story Acts */}
      {activeCategory === "HOME" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
          {[
            { key: "homeAct01Interruption", num: "01", title: "The Interruption", desc: "Operational friction & unread leads simulation." },
            { key: "homeAct02TheLeak", num: "02", title: "The Silent Revenue Leak", desc: "Dynamic annual lost revenue interactive calculator." },
            { key: "homeAct03RealityFlipCards", num: "03", title: "Reality Check Flip Cards", desc: "3D perspective splitting & rotating bottleneck cards." },
            { key: "homeAct04TurningPoint", num: "04", title: "The Turning Point", desc: "1.8s live autonomous data flow simulation." },
            { key: "homeAct05OperatingSystem", num: "05", title: "Digital Operating System", desc: "6 Unified business machinery pillars." },
            { key: "homeAct06TransformationMatrix", num: "06", title: "Transformation Matrix", desc: "Interactive Before vs. After comparison." },
            { key: "homeAct07Outcomes", num: "07", title: "Tangible Business Outcomes", desc: "<60s speed, 3.5x conversion, 15+ hrs/wk saved." },
            { key: "homeAct08BottleneckDiagnostic", num: "08", title: "Bottleneck Diagnostic", desc: "Problem self-selection & tailored solution spec." },
            { key: "homeAct09ProofStories", num: "09", title: "Proof Transformations", desc: "Verified enterprise architecture case studies." },
            { key: "homeCostEstimator", num: "—", title: "Scope & Pricing Estimator", desc: "Transparent multi-currency scope estimator section." },
            { key: "homeFaqSection", num: "—", title: "Executive FAQ Accordion", desc: "Common executive & technical questions." },
            { key: "homeAct10FinalConversation", num: "10", title: "The Strategic First Step", desc: "3-step conversational intake & discovery booking." },
          ].map((item) => {
            const isEnabled = toggles[item.key as keyof FeatureToggles];
            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key as keyof FeatureToggles)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isEnabled
                    ? "bg-cyan-500/5 border-cyan-500/30 hover:border-cyan-400 shadow-glow-cyan/5"
                    : "bg-white/2 border-white/5 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono font-bold text-cyan-300 flex items-center justify-center">
                      {item.num}
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                      isEnabled ? "bg-cyan-400" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Category 2: Interactive Labs & Tech Modules */}
      {activeCategory === "MODULES" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
          {[
            { key: "moduleSystemTopology", icon: Compass, title: "System Topology Architect", route: "/architecture", desc: "Interactive node canvas calculating throughput & latency." },
            { key: "moduleAiAgentSandbox", icon: Cpu, title: "AI Agent Sandbox Lab", route: "/ai-lab", desc: "4 live simulated business AI agents with interactive chat." },
            { key: "moduleMaturityScorecard", icon: Activity, title: "Automation Maturity Scorecard", route: "/scorecard", desc: "60-second diagnostic generating customized AI blueprints." },
            { key: "moduleRoiCalculator", icon: Zap, title: "ROI & Capital Efficiency Calc", route: "/roi", desc: "In-house vs. HP Edit enterprise cost comparison." },
            { key: "moduleClientPortal", icon: ShieldCheck, title: "Client Project Tracking Vault", route: "/portal", desc: "Milestone approval, invoice hub, and deliverables." },
            { key: "moduleCaseStudies", icon: FileCode, title: "Case Studies Directory", route: "/case-studies", desc: "Deep-dive architectural transformation portfolio." },
            { key: "moduleDedicatedEstimator", icon: Sliders, title: "Full-Screen Scope Estimator", route: "/estimator", desc: "Dedicated standalone project pricing estimator." },
          ].map((item) => {
            const isEnabled = toggles[item.key as keyof FeatureToggles];
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key as keyof FeatureToggles)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isEnabled
                    ? "bg-purple-500/5 border-purple-500/30 hover:border-purple-400 shadow-glow-purple/5"
                    : "bg-white/2 border-white/5 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span className="text-[10px] font-mono text-purple-300 font-semibold">{item.route}</span>
                    </div>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                      isEnabled ? "bg-purple-400" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Category 3: Global Experience & Floating Widgets */}
      {activeCategory === "WIDGETS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in">
          {[
            { key: "widgetPreloader", title: "Cyberpunk Preloader", desc: "First-visit high-tech terminal boot animation sequence." },
            { key: "widgetFuturisticChatbot", title: "Futuristic AI Chatbot", desc: "Corner floating AI architectural assistant." },
            { key: "widgetCommandPalette", title: "Command Palette (Cmd + K)", desc: "Power-user keyboard search & navigation shortcut hub." },
            { key: "widgetWhatsappPopup", title: "WhatsApp Direct Connect", desc: "Floating WhatsApp booking and direct chat popover." },
            { key: "widgetSoundFX", title: "Cyber Audio Sound Engine", desc: "Futuristic synthesized click & hover audio effects." },
            { key: "widgetComplianceBadges", title: "Enterprise Compliance Seals", desc: "SOC-2, GDPR, ISO-27001, and 99.99% Uptime trust tags." },
          ].map((item) => {
            const isEnabled = toggles[item.key as keyof FeatureToggles];
            return (
              <div
                key={item.key}
                onClick={() => handleToggle(item.key as keyof FeatureToggles)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isEnabled
                    ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-400 shadow-glow-emerald/5"
                    : "bg-white/2 border-white/5 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                      isEnabled ? "bg-emerald-400" : "bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-medium leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
