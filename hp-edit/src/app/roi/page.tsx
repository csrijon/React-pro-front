import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoiCalculator from "@/components/RoiCalculator";
import { getOrganization } from "@/lib/actions";
import ThemeWrapper from "@/components/ThemeWrapper";
import { TrendingUp, Sparkles, DollarSign, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "In-House vs. HP Edit ROI Calculator | HP Edit Enterprise",
  description: "Calculate the exact capital savings and time-to-market speedup of partnering with HP Edit versus traditional in-house hiring.",
};

export default async function RoiPage() {
  const org = await getOrganization();

  return (
    <ThemeWrapper organization={org}>
      <div className="min-h-screen bg-cyber-950 text-gray-100 flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Capital Efficiency &amp; Velocity</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              In-House Hiring vs. <span className="text-gradient-emerald">HP Edit Sprints</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Compare the true financial expenditure of full-time hiring—including recruiting commissions, payroll taxes, healthcare, and onboarding lag—against dedicated HP Edit sprint execution.
            </p>
          </div>

          <RoiCalculator />
        </main>

        <Footer organization={org} />
      </div>
    </ThemeWrapper>
  );
}
