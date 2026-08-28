import { FeatureToggles } from "@/types";

export const DEFAULT_FEATURE_TOGGLES: FeatureToggles = {
  // Homepage Story Acts (1-10)
  homeAct01Interruption: true,
  homeAct02TheLeak: true,
  homeAct03RealityFlipCards: true,
  homeAct04TurningPoint: true,
  homeAct05OperatingSystem: true,
  homeAct06TransformationMatrix: true,
  homeAct07Outcomes: true,
  homeAct08BottleneckDiagnostic: true,
  homeAct09ProofStories: true,
  homeCostEstimator: true,
  homeFaqSection: true,
  homeAct10FinalConversation: true,

  // Interactive Lab & Tech Modules
  moduleSystemTopology: true,
  moduleAiAgentSandbox: true,
  moduleMaturityScorecard: true,
  moduleRoiCalculator: true,
  moduleClientPortal: true,
  moduleCaseStudies: true,
  moduleDedicatedEstimator: true,

  // Global Experience & Floating Widgets
  widgetPreloader: true,
  widgetFuturisticChatbot: true,
  widgetCommandPalette: true,
  widgetWhatsappPopup: true,
  widgetSoundFX: true,
  widgetComplianceBadges: true,
};

/**
 * Parse raw JSON string from organization.featureToggles and merge with default values
 */
export function parseFeatureToggles(rawJson?: string | null): FeatureToggles {
  if (!rawJson) return { ...DEFAULT_FEATURE_TOGGLES };

  try {
    const parsed = JSON.parse(rawJson);
    return {
      ...DEFAULT_FEATURE_TOGGLES,
      ...parsed,
    };
  } catch (err) {
    console.error("Error parsing feature toggles JSON:", err);
    return { ...DEFAULT_FEATURE_TOGGLES };
  }
}
