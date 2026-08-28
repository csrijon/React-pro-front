"use client";

import { Check } from "lucide-react";
import { CurrencyOption, EstimatorEngine } from "@/lib/estimator/EstimatorEngine";
import { soundFX } from "@/components/CyberAudioFx";

interface EstimatorSuperpowersGridProps {
  selectedCurrency: CurrencyOption;
  selectedSuperpowers: string[];
  onToggleSuperpower: (id: string) => void;
}

export default function EstimatorSuperpowersGrid({
  selectedCurrency,
  selectedSuperpowers,
  onToggleSuperpower,
}: EstimatorSuperpowersGridProps) {
  return (
    <div className="p-6 sm:p-7 rounded-3xl luxury-card border border-white/10 space-y-4">
      <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
          3
        </span>
        <span>Enterprise Add-Ons &amp; Superpowers</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {EstimatorEngine.SUPERPOWERS.map((sp) => {
          const isSelected = selectedSuperpowers.includes(sp.id);
          const costConverted = Math.round(sp.cost * selectedCurrency.rate);
          return (
            <button
              key={sp.id}
              type="button"
              onClick={() => {
                soundFX.click();
                onToggleSuperpower(sp.id);
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between h-full ${
                isSelected
                  ? "bg-emerald-500/15 border-emerald-400 text-white shadow-glow-emerald/20 scale-[1.01]"
                  : "bg-white/3 border-white/5 text-gray-300 hover:bg-white/8 hover:text-white"
              }`}
            >
              <div>
                <div className="text-xs sm:text-sm font-semibold text-white">{sp.label}</div>
                <div className="text-xs text-gray-300 mt-0.5 font-mono">
                  +{selectedCurrency.symbol}
                  {costConverted.toLocaleString()}
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                  isSelected
                    ? "bg-emerald-500 border-emerald-400 text-gray-950"
                    : "border-white/20 bg-transparent"
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
