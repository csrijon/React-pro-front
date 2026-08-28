"use client";

import WhatsAppIcon from "@/components/WhatsAppIcon";
import { CurrencyOption, EstimatorCalculationResult } from "@/lib/estimator/EstimatorEngine";

interface EstimatorMobileDockProps {
  currency: CurrencyOption;
  result: EstimatorCalculationResult;
  onSendWhatsApp: () => void;
}

export default function EstimatorMobileDock({
  currency,
  result,
  onSendWhatsApp,
}: EstimatorMobileDockProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3.5 bg-cyber-950/95 backdrop-blur-xl border-t border-cyan-500/30 shadow-2xl flex items-center justify-between gap-3 safe-area-bottom">
      <div>
        <div className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
          Live Estimate ({currency.code}):
        </div>
        <div className="text-base font-extrabold text-white">
          {result.formattedCost}
        </div>
        <div className="text-[10px] text-gray-400 font-mono">
          {result.timelineFormatted}
        </div>
      </div>

      <button
        type="button"
        onClick={onSendWhatsApp}
        className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform shrink-0"
      >
        <WhatsAppIcon className="w-4 h-4" />
        <span>WhatsApp Proposal</span>
      </button>
    </div>
  );
}
