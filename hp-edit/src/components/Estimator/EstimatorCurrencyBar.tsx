"use client";

import { Globe } from "lucide-react";
import { CurrencyOption, EstimatorEngine } from "@/lib/estimator/EstimatorEngine";
import { soundFX } from "@/components/CyberAudioFx";

interface EstimatorCurrencyBarProps {
  selectedCurrency: CurrencyOption;
  onSelectCurrency: (currency: CurrencyOption) => void;
}

export default function EstimatorCurrencyBar({
  selectedCurrency,
  onSelectCurrency,
}: EstimatorCurrencyBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl luxury-card border border-cyan-500/20">
      <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
        <Globe className="w-4 h-4 text-cyan-400" />
        <span>Select Local Currency:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {EstimatorEngine.CURRENCIES.map((curr) => {
          const isSelected = selectedCurrency.code === curr.code;
          return (
            <button
              key={curr.code}
              type="button"
              onClick={() => {
                soundFX.click();
                onSelectCurrency(curr);
              }}
              className={`min-h-[44px] px-4 py-2.5 sm:min-h-0 sm:px-3 sm:py-1.5 rounded-xl text-xs font-mono transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? "bg-cyan-500 text-gray-950 shadow-glow-cyan/20 font-extrabold"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {curr.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
