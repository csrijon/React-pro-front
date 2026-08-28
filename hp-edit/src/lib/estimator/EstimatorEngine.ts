import { ProposalSpec } from "@/lib/proposalGenerator";

export interface CurrencyOption {
  code: string;
  symbol: string;
  rate: number;
  label: string;
}

export interface PlatformOption {
  id: string;
  label: string;
  baseCost: number;
  timeWeeks: number;
}

export interface ComplexityTier {
  id: string;
  label: string;
  multiplier: number;
  timeMultiplier: number;
  desc: string;
}

export interface SuperpowerOption {
  id: string;
  label: string;
  cost: number;
  timeDays: number;
}

export interface EstimatorState {
  currency: CurrencyOption;
  selectedPlatforms: string[];
  selectedComplexity: string;
  selectedSuperpowers: string[];
}

export interface EstimatorCalculationResult {
  rawUsdCost: number;
  minCostUsd: number;
  maxCostUsd: number;
  minConverted: number;
  maxConverted: number;
  formattedCost: string;
  baseWeeks: number;
  estimatedWeeks: number;
  timelineFormatted: string;
  selectedPlatformObjects: PlatformOption[];
  selectedComplexityObject: ComplexityTier;
  selectedSuperpowerObjects: SuperpowerOption[];
}

/**
 * Object-Oriented Domain Engine for Project Scope & Pricing Estimation.
 * Encapsulates pricing models, currency conversions, timeline projections,
 * and external export generators (WhatsApp & PDF).
 */
export class EstimatorEngine {
  public static readonly CURRENCIES: CurrencyOption[] = [
    { code: "USD", symbol: "$", rate: 1.0, label: "USD ($)" },
    { code: "INR", symbol: "₹", rate: 86.5, label: "INR (₹)" },
    { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€)" },
    { code: "GBP", symbol: "£", rate: 0.79, label: "GBP (£)" },
    { code: "AED", symbol: "AED ", rate: 3.67, label: "AED (د.إ)" },
  ];

  public static readonly PLATFORMS: PlatformOption[] = [
    { id: "web_fullstack", label: "Full-Stack Web (Next.js 15)", baseCost: 1500, timeWeeks: 2 },
    { id: "mobile_flutter", label: "Native Mobile (iOS & Android)", baseCost: 2000, timeWeeks: 3 },
    { id: "ai_agent_rag", label: "Autonomous AI Agent Cluster", baseCost: 2500, timeWeeks: 3 },
    { id: "whatsapp_bot", label: "WhatsApp Cloud API Funnel", baseCost: 1200, timeWeeks: 2 },
    { id: "desktop_app", label: "Custom Desktop Tool (Tauri/Electron)", baseCost: 1800, timeWeeks: 2 },
    { id: "enterprise_auto", label: "ERP/CRM Automation Engine", baseCost: 1600, timeWeeks: 2 },
  ];

  public static readonly COMPLEXITY_TIERS: ComplexityTier[] = [
    {
      id: "mvp",
      label: "0-to-1 Rapid Prototype / MVP",
      multiplier: 1.0,
      timeMultiplier: 1.0,
      desc: "Fast validation with production polish",
    },
    {
      id: "growth",
      label: "Growth-Scale Production Platform",
      multiplier: 1.6,
      timeMultiplier: 1.3,
      desc: "High concurrency, payment bridges, robust analytics",
    },
    {
      id: "enterprise",
      label: "Enterprise Multi-Tenant Cluster",
      multiplier: 2.4,
      timeMultiplier: 1.6,
      desc: "Sub-50ms latency, high security, 24/7 SLA & multi-region",
    },
  ];

  public static readonly SUPERPOWERS: SuperpowerOption[] = [
    { id: "rag_docs", label: "Private Enterprise RAG (Vector Search)", cost: 600, timeDays: 4 },
    { id: "voice_ai", label: "Real-Time Voice AI / Whisper Integration", cost: 800, timeDays: 5 },
    { id: "stripe_crypto", label: "Global Stripe & Multi-Currency Checkout", cost: 400, timeDays: 3 },
    { id: "crm_sync", label: "Two-Way Hubspot / Salesforce Sync", cost: 500, timeDays: 3 },
    { id: "perf_seo", label: "Sub-100ms Edge CDN & Automated SEO", cost: 400, timeDays: 2 },
  ];

  public static getDefaultState(): EstimatorState {
    return {
      currency: EstimatorEngine.detectUserCurrency(),
      selectedPlatforms: ["web_fullstack"],
      selectedComplexity: "growth",
      selectedSuperpowers: ["stripe_payments", "ai_llm_integration"],
    };
  }

  public static detectUserCurrency(): CurrencyOption {
    try {
      if (typeof window !== "undefined") {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        const language = navigator.language || "";

        if (
          timeZone.includes("Calcutta") ||
          timeZone.includes("Kolkata") ||
          timeZone.includes("Asia/Colombo") ||
          language.includes("en-IN") ||
          language.includes("hi")
        ) {
          return EstimatorEngine.CURRENCIES.find((c) => c.code === "INR") || EstimatorEngine.CURRENCIES[0];
        }
        if (timeZone.includes("London") || language.includes("en-GB")) {
          return EstimatorEngine.CURRENCIES.find((c) => c.code === "GBP") || EstimatorEngine.CURRENCIES[0];
        }
        if (
          timeZone.includes("Europe") ||
          timeZone.includes("Paris") ||
          timeZone.includes("Berlin") ||
          language.includes("de") ||
          language.includes("fr") ||
          language.includes("es") ||
          language.includes("it")
        ) {
          return EstimatorEngine.CURRENCIES.find((c) => c.code === "EUR") || EstimatorEngine.CURRENCIES[0];
        }
        if (
          timeZone.includes("Dubai") ||
          timeZone.includes("Asia/Muscat") ||
          timeZone.includes("Asia/Riyadh") ||
          language.includes("ar")
        ) {
          return EstimatorEngine.CURRENCIES.find((c) => c.code === "AED") || EstimatorEngine.CURRENCIES[0];
        }
      }
    } catch {
      // Default to USD
    }
    return EstimatorEngine.CURRENCIES[0]; // USD
  }

  /**
   * Calculates real-time cost ranges and timelines based on current configuration.
   */
  public static calculate(state: EstimatorState): EstimatorCalculationResult {
    const selectedPlatformObjects = state.selectedPlatforms
      .map((pId) => this.PLATFORMS.find((p) => p.id === pId))
      .filter((p): p is PlatformOption => !!p);

    const basePlatformCost = selectedPlatformObjects.reduce((acc, p) => acc + p.baseCost, 0);

    const selectedComplexityObject =
      this.COMPLEXITY_TIERS.find((c) => c.id === state.selectedComplexity) ||
      this.COMPLEXITY_TIERS[0];

    const selectedSuperpowerObjects = state.selectedSuperpowers
      .map((sId) => this.SUPERPOWERS.find((s) => s.id === sId))
      .filter((s): s is SuperpowerOption => !!s);

    const superpowersCost = selectedSuperpowerObjects.reduce((acc, s) => acc + s.cost, 0);

    const rawUsdCost = Math.round(
      basePlatformCost * selectedComplexityObject.multiplier + superpowersCost
    );
    const minCostUsd = Math.round(rawUsdCost * 0.9);
    const maxCostUsd = Math.round(rawUsdCost * 1.15);

    const rate = state.currency.rate;
    const minConverted = Math.round(minCostUsd * rate);
    const maxConverted = Math.round(maxCostUsd * rate);

    const baseWeeks =
      selectedPlatformObjects.length > 0
        ? Math.max(...selectedPlatformObjects.map((p) => p.timeWeeks))
        : 2;
    const estimatedWeeks = Math.round(baseWeeks * selectedComplexityObject.timeMultiplier);
    const timelineFormatted = `${estimatedWeeks} - ${estimatedWeeks + 2} Weeks`;

    const formattedCost = `${state.currency.symbol}${minConverted.toLocaleString()} - ${
      state.currency.symbol
    }${maxConverted.toLocaleString()}`;

    return {
      rawUsdCost,
      minCostUsd,
      maxCostUsd,
      minConverted,
      maxConverted,
      formattedCost,
      baseWeeks,
      estimatedWeeks,
      timelineFormatted,
      selectedPlatformObjects,
      selectedComplexityObject,
      selectedSuperpowerObjects,
    };
  }

  /**
   * Generates a pre-formatted WhatsApp message payload with full scoping parameters.
   */
  public static buildWhatsAppUrl(
    state: EstimatorState,
    result: EstimatorCalculationResult,
    phone?: string
  ): string {
    const platformNames = result.selectedPlatformObjects.map((p) => p.label).join(", ");
    const superpowerNames =
      result.selectedSuperpowerObjects.map((s) => s.label).join(", ") || "None";

    const message =
      `*HP EDIT ENTERPRISE — PROJECT ESTIMATE REQUEST*\n\n` +
      `*Platforms & Tech:* ${platformNames}\n` +
      `*Complexity Tier:* ${result.selectedComplexityObject.label}\n` +
      `*Add-ons & Superpowers:* ${superpowerNames}\n` +
      `*Ballpark Budget:* ${result.formattedCost} (${state.currency.code})\n` +
      `*Target Timeline:* ${result.timelineFormatted}\n\n` +
      `Hello HP Edit Engineering Team! I have finalized my project specification using your interactive estimator. Let's schedule Phase 1 sprint kickoff!`;

    const cleanPhone = (phone || "919836847984").replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Builds an official ProposalSpec object for PDF printing and contract drafting.
   */
  public static buildProposalSpec(
    state: EstimatorState,
    result: EstimatorCalculationResult
  ): ProposalSpec {
    return {
      refId: "HPE-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
      clientName: "Prospective Enterprise Client",
      platforms: result.selectedPlatformObjects.map((p) => p.label),
      scaleComplexity: result.selectedComplexityObject.label,
      aiSuperpowers: result.selectedSuperpowerObjects.map((s) => s.label),
      currencySymbol: state.currency.symbol,
      currencyCode: state.currency.code,
      totalCostFormatted: result.formattedCost,
      timelineWeeks: result.timelineFormatted,
      generatedDate: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    };
  }
}
