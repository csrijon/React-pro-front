"use client";

import { Check } from "lucide-react";
import { CurrencyOption, EstimatorEngine } from "@/lib/estimator/EstimatorEngine";
import { soundFX } from "@/components/CyberAudioFx";

interface EstimatorPlatformGridProps {
  selectedCurrency: CurrencyOption;
  selectedPlatforms: string[];
  onTogglePlatform: (id: string) => void;
}

export default function EstimatorPlatformGrid({
  selectedCurrency,
  selectedPlatforms,
  onTogglePlatform,
}: EstimatorPlatformGridProps) {
  return (
    <div className="p-6 sm:p-7 rounded-3xl luxury-card border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
            1
          </span>
          <span>Target Platforms &amp; Architecture (Multi-Select)</span>
        </h3>
        <span className="text-xs text-cyan-400 font-mono">
          {selectedPlatforms.length} Selected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EstimatorEngine.PLATFORMS.map((opt) => {
          const isSelected = selectedPlatforms.includes(opt.id);
          const costConverted = Math.round(opt.baseCost * selectedCurrency.rate);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                soundFX.click();
                onTogglePlatform(opt.id);
              }}
              className={`p-4 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between h-full ${
                isSelected
                  ? "bg-cyan-500/15 border-cyan-400 text-white shadow-glow-cyan/20 scale-[1.01]"
                  : "bg-white/3 border-white/5 text-gray-400 hover:bg-white/8 hover:text-white"
              }`}
            >
              <div className="pr-2">
                <div className="text-sm font-bold text-white">{opt.label}</div>
                <div className="text-xs text-gray-300 mt-1 font-mono">
                  From {selectedCurrency.symbol}
                  {costConverted.toLocaleString()} • ~{opt.timeWeeks} wks
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                  isSelected
                    ? "bg-cyan-500 border-cyan-400 text-gray-950"
                    : "border-white/20 bg-transparent"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
