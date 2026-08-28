"use client";

import { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Clock,
  Zap,
  Shield,
  Download,
  Users,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Percent,
  Calculator
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import Link from "next/link";

interface RegionOption {
  id: string;
  name: string;
  currency: string;
  symbol: string;
  avgSeniorSalary: number; // Annual
  benefitsPercent: number; // 25%
  recruitingFee: number;
}

const REGIONS: RegionOption[] = [
  {
    id: "us",
    name: "United States / North America",
    currency: "USD",
    symbol: "$",
    avgSeniorSalary: 165000,
    benefitsPercent: 0.28,
    recruitingFee: 22000,
  },
  {
    id: "uk_eu",
    name: "UK & Western Europe",
    currency: "EUR",
    symbol: "€",
    avgSeniorSalary: 110000,
    benefitsPercent: 0.25,
    recruitingFee: 16000,
  },
  {
    id: "global",
    name: "APAC / India / Global",
    currency: "USD",
    symbol: "$",
    avgSeniorSalary: 55000,
    benefitsPercent: 0.20,
    recruitingFee: 8000,
  },
];

export default function RoiCalculator() {
  const [selectedRegion, setSelectedRegion] = useState<RegionOption>(REGIONS[0]);
  const [teamSize, setTeamSize] = useState<number>(2);
  const [projectMonths, setProjectMonths] = useState<number>(6);
  const [sprintComplexity, setSprintComplexity] = useState<"mvp" | "growth" | "enterprise">("growth");

  // In-House Calculations
  const salaryCost = (selectedRegion.avgSeniorSalary / 12) * projectMonths * teamSize;
  const benefitsCost = salaryCost * selectedRegion.benefitsPercent;
  const recruitingCost = selectedRegion.recruitingFee * teamSize;
  const onboardingLagCost = (selectedRegion.avgSeniorSalary / 12) * 2.5 * teamSize; // 2.5 months ramp-up
  const toolingOverhead = 600 * projectMonths * teamSize;

  const totalInHouseCost = Math.round(
    salaryCost + benefitsCost + recruitingCost + onboardingLagCost + toolingOverhead
  );

  // HP Edit Sprint Calculations
  const hpMonthlyRate =
    sprintComplexity === "mvp"
      ? 5800
      : sprintComplexity === "growth"
      ? 9200
      : 14500;

  // HP Edit delivers typically in 40% of the in-house time due to zero onboarding + pre-built architectural assets
  const hpDurationMonths = Math.max(1.5, Math.round(projectMonths * 0.45 * 10) / 10);
  const totalHpEditCost = Math.round(hpMonthlyRate * hpDurationMonths);

  // Savings & Velocity
  const netSavings = Math.max(0, totalInHouseCost - totalHpEditCost);
  const savingsPercent = Math.round((netSavings / totalInHouseCost) * 100);
  const timeSavedWeeks = Math.round((projectMonths - hpDurationMonths) * 4.3);

  const downloadRoiSummary = () => {
    soundFX.success();
    const content = `
HP EDIT ENTERPRISE — EXECUTIVE ROI & COST-SAVINGS REPORT
=========================================================
Generated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
Target Geography: ${selectedRegion.name} (${selectedRegion.currency})
Team Size Comparison: ${teamSize} Senior In-House Engineers vs. HP Edit Dedicated Sprint Cluster
Scope Horizon: ${projectMonths} Months

FINANCIAL METRIC BREAKDOWN:
---------------------------------------------------------
1. Traditional In-House Team Cost:
   - Base Salaries: ${selectedRegion.symbol}${Math.round(salaryCost).toLocaleString()}
   - Healthcare, Taxes & Benefits (28%): ${selectedRegion.symbol}${Math.round(benefitsCost).toLocaleString()}
   - Recruitment / Agency Headhunter Fees: ${selectedRegion.symbol}${Math.round(recruitingCost).toLocaleString()}
   - 2.5-Month Onboarding Lag Cost: ${selectedRegion.symbol}${Math.round(onboardingLagCost).toLocaleString()}
   - Tooling & Software Seats: ${selectedRegion.symbol}${Math.round(toolingOverhead).toLocaleString()}
   TOTAL IN-HOUSE EXPENDITURE: ${selectedRegion.symbol}${totalInHouseCost.toLocaleString()}

2. HP Edit Enterprise Sprint Execution:
   - Zero Recruitment Fees
   - Zero Healthcare / Benefits Liabilities
   - Day-1 Sprint Execution Velocity
   - Delivery Timeline: ${hpDurationMonths} Months (${timeSavedWeeks} Weeks Faster)
   TOTAL HP EDIT SPRINT INVESTMENT: ${selectedRegion.symbol}${totalHpEditCost.toLocaleString()}

=========================================================
EXECUTIVE SUMMARY:
- TOTAL NET SAVINGS: ${selectedRegion.symbol}${netSavings.toLocaleString()} (${savingsPercent}% Cost Reduction)
- TIME-TO-MARKET ACCELERATION: ${timeSavedWeeks} Weeks Ahead of Traditional Schedule
- IP & SOURCE CODE: 100% Perpetual Ownership Transfer on Day of Handover
=========================================================
Contact HP Edit Enterprise: contact@hpedit.com | https://www.hpedit.com
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HP_Edit_Executive_ROI_Report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      {/* Interactive Controls & Live Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Parameters Configurator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl luxury-card border border-cyan-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  Configure In-House Comparison
                </h3>
              </div>
              <span className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider">
                Live Cost Model
              </span>
            </div>

            {/* 1. Region Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-200 block font-mono">
                1. Target Hiring Geography &amp; Market
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      soundFX.click();
                      setSelectedRegion(r);
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all text-xs font-bold ${
                      selectedRegion.id === r.id
                        ? "bg-cyan-500 text-gray-950 border-cyan-400 shadow-glow-cyan/20 font-black"
                        : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <div>{r.name.split("/")[0]}</div>
                    <div className={`text-xs font-mono mt-0.5 ${selectedRegion.id === r.id ? "text-gray-950 font-bold" : "text-gray-400"}`}>
                      Avg. {r.symbol}{(r.avgSeniorSalary / 1000).toFixed(0)}k/yr
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Team Size Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-200 font-mono">2. In-House Engineering Headcount</span>
                <span className="text-cyan-300 font-mono text-sm font-black">
                  {teamSize} Senior Engineer{teamSize > 1 ? "s" : ""}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={teamSize}
                onChange={(e) => {
                  soundFX.click();
                  setTeamSize(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-gray-300 font-mono">
                <span>1 Lead Engineer</span>
                <span>2 Engineers (Standard)</span>
                <span>5 Full Swarm</span>
              </div>
            </div>

            {/* 3. Project Duration Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-200 font-mono">3. Traditional Project Scope Horizon</span>
                <span className="text-cyan-300 font-mono text-sm font-black">
                  {projectMonths} Months
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={projectMonths}
                onChange={(e) => {
                  soundFX.click();
                  setProjectMonths(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-xs text-gray-300 font-mono">
                <span>2 Months (Fast MVP)</span>
                <span>6 Months (Platform)</span>
                <span>12 Months (Enterprise)</span>
              </div>
            </div>

            {/* 4. Complexity Tier */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-200 block font-mono">
                4. HP Edit Architecture Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "mvp", label: "0-to-1 MVP Sprint", price: "$5.8k/mo" },
                  { id: "growth", label: "Growth Scale Engine", price: "$9.2k/mo" },
                  { id: "enterprise", label: "Enterprise AI Swarm", price: "$14.5k/mo" },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      soundFX.click();
                      setSprintComplexity(tier.id as "mvp" | "growth" | "enterprise");
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all text-xs font-bold ${
                      sprintComplexity === tier.id
                        ? "bg-purple-500/20 text-purple-200 border-purple-400 shadow-glow-purple/20 font-black"
                        : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <div>{tier.label}</div>
                    <div className="text-xs text-purple-300 font-mono mt-0.5 font-bold">{tier.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Line-item Comparison Breakdown */}
          <div className="p-6 rounded-3xl bg-cyber-900 border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
              In-House Hidden Hiring Surcharges (Calculated)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-1">
                <div className="text-xs text-gray-300">Base Salary</div>
                <div className="font-bold text-white font-mono">
                  {selectedRegion.symbol}{Math.round(salaryCost).toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-1">
                <div className="text-xs text-gray-300">Benefits / Taxes</div>
                <div className="font-bold text-amber-300 font-mono">
                  +{selectedRegion.symbol}{Math.round(benefitsCost).toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-1">
                <div className="text-xs text-gray-300">Recruiter Fees</div>
                <div className="font-bold text-rose-400 font-mono">
                  +{selectedRegion.symbol}{Math.round(recruitingCost).toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/3 border border-white/5 space-y-1">
                <div className="text-xs text-gray-300">2.5-Mo Onboarding Lag</div>
                <div className="font-bold text-rose-400 font-mono">
                  +{selectedRegion.symbol}{Math.round(onboardingLagCost).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparison Card & ROI Verdict (5 cols) */}
        <div className="lg:col-span-5 sticky top-28 self-start space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl luxury-card border border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                Verified ROI Verdict
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                {savingsPercent}% Cost Reduction
              </span>
            </div>

            {/* Big Headline Savings */}
            <div>
              <div className="text-xs text-gray-300 font-medium">Estimated Net Capital Saved:</div>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 text-gradient-emerald">
                {selectedRegion.symbol}{netSavings.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-300 mt-2 font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Delivered {timeSavedWeeks} Weeks Faster</span>
              </div>
            </div>

            {/* Side-by-Side Visual Comparison Bars */}
            <div className="space-y-4 pt-2 border-t border-white/10">
              {/* In House Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-200">Traditional In-House Hiring ({projectMonths} mos)</span>
                  <span className="text-rose-400 font-mono">{selectedRegion.symbol}{totalInHouseCost.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full w-full" />
                </div>
              </div>

              {/* HP Edit Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-cyan-300 font-extrabold">HP Edit Enterprise Sprint ({hpDurationMonths} mos)</span>
                  <span className="text-emerald-300 font-mono font-extrabold">{selectedRegion.symbol}{totalHpEditCost.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(15, (totalHpEditCost / totalInHouseCost) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Strategic Value Propositions */}
            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero equity dilution &amp; 0% recruiter commissions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% full source code ownership on day of handover</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sub-100ms enterprise architectures &amp; SOC2 compliance ready</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-2.5 pt-2">
              <Link
                href="/book"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black text-sm shadow-glow-emerald/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Book 15-Min Sprint Discovery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={downloadRoiSummary}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Executive Board Report (TXT/PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
