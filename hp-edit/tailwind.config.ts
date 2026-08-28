import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#030712",
        foreground: "#f9fafb",
        cyber: {
          950: "#030712",
          900: "#0B0F19",
          850: "#111827",
          800: "#1F2937",
          700: "#374151",
          accent: "#06B6D4",
          purple: "#8B5CF6",
          blue: "#3B82F6",
          emerald: "#10B981",
          rose: "#F43F5E",
          amber: "#F59E0B"
        }
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "shimmer": "shimmer 2.5s infinite linear",
        "marquee": "marquee 35s linear infinite",
        "marquee-reverse": "marquee-reverse 35s linear infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
          "50%": { "background-size": "200% 200%", "background-position": "right center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      backgroundImage: {
        "cyber-grid": "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.15), transparent 70%)",
        "radial-purple": "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), transparent 70%)",
      },
      boxShadow: {
        "glow-cyan": "0 0 40px -10px rgba(6, 182, 212, 0.4)",
        "glow-purple": "0 0 40px -10px rgba(139, 92, 246, 0.4)",
        "glow-blue": "0 0 40px -10px rgba(59, 130, 246, 0.4)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      }
    },
  },
  plugins: [],
};

export default config;
