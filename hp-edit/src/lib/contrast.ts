/**
 * WCAG 2.1 Color Contrast and Readability Calculator
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleanHex.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export interface ContrastResult {
  ratio: number;
  ratioFormatted: string;
  score: number; // 0 to 100
  wcagAA: boolean; // >= 4.5:1
  wcagAAA: boolean; // >= 7.0:1
  rating: "Excellent (AAA)" | "Good (AA)" | "Acceptable (Large Text)" | "Poor (Low Readability)";
  colorClass: string;
}

export function calculateContrast(textColor: string, bgColor: string): ContrastResult {
  try {
    const rgb1 = hexToRgb(textColor);
    const rgb2 = hexToRgb(bgColor);

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    const ratio = (brightest + 0.05) / (darkest + 0.05);

    const roundedRatio = Math.round(ratio * 100) / 100;
    const wcagAA = ratio >= 4.5;
    const wcagAAA = ratio >= 7.0;

    let score = Math.min(100, Math.round((ratio / 15) * 100));
    let rating: ContrastResult["rating"] = "Poor (Low Readability)";
    let colorClass = "text-rose-400 bg-rose-500/10 border-rose-500/30";

    if (wcagAAA) {
      rating = "Excellent (AAA)";
      score = Math.min(100, Math.max(90, Math.round((ratio / 21) * 100)));
      colorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    } else if (wcagAA) {
      rating = "Good (AA)";
      score = Math.round((ratio / 7) * 75);
      colorClass = "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    } else if (ratio >= 3.0) {
      rating = "Acceptable (Large Text)";
      score = 55;
      colorClass = "text-amber-400 bg-amber-500/10 border-amber-500/30";
    }

    return {
      ratio: roundedRatio,
      ratioFormatted: `${roundedRatio}:1`,
      score,
      wcagAA,
      wcagAAA,
      rating,
      colorClass,
    };
  } catch {
    return {
      ratio: 1,
      ratioFormatted: "1:1",
      score: 0,
      wcagAA: false,
      wcagAAA: false,
      rating: "Poor (Low Readability)",
      colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    };
  }
}
