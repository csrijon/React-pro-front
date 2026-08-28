"use client";

import { EstimatorEngine } from "@/lib/estimator/EstimatorEngine";
import { soundFX } from "@/components/CyberAudioFx";

interface EstimatorComplexityGridProps {
  selectedComplexity: string;
  onSelectComplexity: (id: string) => void;
}

export default function EstimatorComplexityGrid({
  selectedComplexity,
  onSelectComplexity,
}: EstimatorComplexityGridProps) {
  return (
    <div className="p-6 sm:p-7 rounded-3xl luxury-card border border-white/10 space-y-4">
      <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">
          2
        </span>
        <span>Scale &amp; Concurrency Requirement</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {EstimatorEngine.COMPLEXITY_TIERS.map((tier) => {
          const isSelected = selectedComplexity === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              onClick={() => {
                soundFX.click();
                onSelectComplexity(tier.id);
              }}
              className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between h-full ${
                isSelected
                  ? "bg-purple-500/20 border-purple-400 text-white shadow-glow-purple/20 scale-[1.01]"
                  : "bg-white/3 border-white/5 text-gray-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              <div>
                <div className="text-sm font-bold text-white">{tier.label}</div>
                <div className="text-xs text-gray-200 mt-1.5 leading-relaxed">
                  {tier.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
