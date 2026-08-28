"use client";

import { RotateCcw, Download } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { CurrencyOption, EstimatorCalculationResult } from "@/lib/estimator/EstimatorEngine";

interface EstimatorSummaryCardProps {
  currency: CurrencyOption;
  result: EstimatorCalculationResult;
  onReset: () => void;
  onSendWhatsApp: () => void;
  onDownloadPdf: () => void;
}

export default function EstimatorSummaryCard({
  currency,
  result,
  onReset,
  onSendWhatsApp,
  onDownloadPdf,
}: EstimatorSummaryCardProps) {
  return (
    <aside className="w-full lg:sticky lg:top-28 self-start space-y-4 z-20 transition-all duration-300">
      <div className="rounded-3xl glass-dropdown border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Block */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Ballpark Estimate
            </span>
            <h4 className="text-xs text-gray-300 font-mono mt-0.5 font-semibold">
              Currency: {currency.code}
            </h4>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
            title="Reset to default estimate"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Dynamic Pricing & Timeline Projection */}
        <div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {result.formattedCost}
          </div>
          <div className="text-xs text-cyan-300 mt-1 font-semibold flex items-center gap-1.5">
            <span>Estimated Delivery:</span>
            <span className="font-mono text-cyan-200">{result.timelineFormatted}</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* WhatsApp Direct Dispatch */}
          <button
            type="button"
            onClick={onSendWhatsApp}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Send Specification on WhatsApp</span>
          </button>

          {/* Official Branded PDF Download */}
          <button
            type="button"
            onClick={onDownloadPdf}
            className="w-full py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Proposal Asset</span>
          </button>
        </div>

        {/* Legal Disclaimer & Copyright Notice */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-gray-300 leading-relaxed">
          <p>
            <strong className="text-white">Disclaimer:</strong> Initial scoping estimate. Final deliverables, milestone schedules, and SLAs formalized in technical MSA contract.
          </p>
          <p className="text-gray-400 font-mono text-xs">
            &copy; 2026 HP Edit Enterprise (www.hpedit.com). All rights reserved.
          </p>
        </div>
      </div>
    </aside>
  );
}
