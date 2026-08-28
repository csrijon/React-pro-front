"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { soundFX } from "@/components/CyberAudioFx";
import { OrganizationData } from "@/types";
import { downloadProposalPdf } from "@/lib/proposalGenerator";
import {
  CurrencyOption,
  EstimatorEngine,
  EstimatorState,
} from "@/lib/estimator/EstimatorEngine";

import EstimatorCurrencyBar from "./Estimator/EstimatorCurrencyBar";
import EstimatorPlatformGrid from "./Estimator/EstimatorPlatformGrid";
import EstimatorComplexityGrid from "./Estimator/EstimatorComplexityGrid";
import EstimatorSuperpowersGrid from "./Estimator/EstimatorSuperpowersGrid";
import EstimatorSummaryCard from "./Estimator/EstimatorSummaryCard";
import EstimatorMobileDock from "./Estimator/EstimatorMobileDock";

interface CostEstimatorProps {
  organization: OrganizationData | null;
  initialService?: string;
  onSendToContactForm?: (summaryText: string, budgetRange: string, timeline: string) => void;
}

/**
 * Unified Single Source of Truth for Project Estimations.
 * Uses Object-Oriented EstimatorEngine for pricing logic and composed modular UI tiers.
 */
export default function CostEstimator({
  organization,
  initialService,
  onSendToContactForm,
}: CostEstimatorProps) {
  const [state, setState] = useState<EstimatorState>(() => EstimatorEngine.getDefaultState());

  // Real-time calculation from domain engine
  const calculationResult = EstimatorEngine.calculate(state);

  // Currency switch handler
  const handleSelectCurrency = (currency: CurrencyOption) => {
    setState((prev) => ({ ...prev, currency }));
  };

  // Platform toggle handler
  const handleTogglePlatform = (id: string) => {
    setState((prev) => {
      if (prev.selectedPlatforms.includes(id)) {
        if (prev.selectedPlatforms.length > 1) {
          return {
            ...prev,
            selectedPlatforms: prev.selectedPlatforms.filter((p) => p !== id),
          };
        }
        return prev;
      }
      return {
        ...prev,
        selectedPlatforms: [...prev.selectedPlatforms, id],
      };
    });
  };

  // Complexity switch handler
  const handleSelectComplexity = (selectedComplexity: string) => {
    setState((prev) => ({ ...prev, selectedComplexity }));
  };

  // Superpower toggle handler
  const handleToggleSuperpower = (id: string) => {
    setState((prev) => {
      if (prev.selectedSuperpowers.includes(id)) {
        return {
          ...prev,
          selectedSuperpowers: prev.selectedSuperpowers.filter((s) => s !== id),
        };
      }
      return {
        ...prev,
        selectedSuperpowers: [...prev.selectedSuperpowers, id],
      };
    });
  };

  // Reset to defaults
  const handleReset = () => {
    soundFX.click();
    setState(EstimatorEngine.getDefaultState());
  };

  // WhatsApp Dispatch Handler
  const handleSendWhatsApp = () => {
    soundFX.success();
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });

    const waUrl = EstimatorEngine.buildWhatsAppUrl(
      state,
      calculationResult,
      organization?.whatsappNumber
    );
    window.open(waUrl, "_blank");
  };

  // Official PDF Generator Handler
  const handleDownloadPdf = () => {
    soundFX.success();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });

    const spec = EstimatorEngine.buildProposalSpec(state, calculationResult);
    downloadProposalPdf(spec);
  };

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        {/* Left Configurator Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <EstimatorCurrencyBar
            selectedCurrency={state.currency}
            onSelectCurrency={handleSelectCurrency}
          />

          <EstimatorPlatformGrid
            selectedCurrency={state.currency}
            selectedPlatforms={state.selectedPlatforms}
            onTogglePlatform={handleTogglePlatform}
          />

          <EstimatorComplexityGrid
            selectedComplexity={state.selectedComplexity}
            onSelectComplexity={handleSelectComplexity}
          />

          <EstimatorSuperpowersGrid
            selectedCurrency={state.currency}
            selectedSuperpowers={state.selectedSuperpowers}
            onToggleSuperpower={handleToggleSuperpower}
          />
        </div>

        {/* Right Sticky Summary Sidebar (4 cols) */}
        <div className="lg:col-span-4 h-full relative">
          <EstimatorSummaryCard
            currency={state.currency}
            result={calculationResult}
            onReset={handleReset}
            onSendWhatsApp={handleSendWhatsApp}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>
      </div>

      {/* Mobile Floating Drawer */}
      <EstimatorMobileDock
        currency={state.currency}
        result={calculationResult}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </div>
  );
}
