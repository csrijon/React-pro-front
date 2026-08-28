import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientPortalExperience from "@/components/Portal/ClientPortalExperience";
import { getOrganization } from "@/lib/actions";
import ThemeWrapper from "@/components/ThemeWrapper";
import { ShieldCheck, Sparkles, Lock, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Client Project Portal & Milestone Hub | HP Edit Enterprise",
  description: "Exclusive client portal to track sprint progress, test staging environments, inspect deliverables, and digitally sign off on milestones.",
};

export default async function ClientPortalPage() {
  const org = await getOrganization();

  return (
    <ThemeWrapper organization={org}>
      <div className="min-h-screen bg-cyber-950 text-gray-100 flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dedicated Client Sprint Vault</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Client Project <span className="text-gradient-cyan">Milestone Portal</span>
            </h1>

            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Track live sprint progress, access private staging environments, review deliverable checklists, and certify milestone completion with digital sign-offs.
            </p>
          </div>

          <ClientPortalExperience organization={org} />
        </main>

        <Footer organization={org} />
      </div>
    </ThemeWrapper>
  );
}
