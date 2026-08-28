import { getOrganization, getPublishedServices } from "@/lib/actions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import AutomationMaturityScorecard from "@/components/AutomationMaturityScorecard";
import ComplianceTrustBadges from "@/components/ComplianceTrustBadges";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Automation Maturity Scorecard | HP Edit Enterprise",
  description: "Take the 60-second diagnostic. Assess your company's automation maturity, speed to lead, and AI readiness. Get an instant custom roadmap.",
};

export default async function ScorecardPage() {
  const organization = await getOrganization();
  const services = await getPublishedServices();

  return (
    <ThemeWrapper organization={organization}>
      <div className="flex flex-col min-h-screen bg-cyber-950 text-white selection:bg-cyan-500 selection:text-black">
        <Navbar organization={organization} services={services} />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AutomationMaturityScorecard organization={organization} />
          </div>

          <div className="mt-20">
            <ComplianceTrustBadges />
          </div>
        </main>

        <Footer organization={organization} />
      </div>
    </ThemeWrapper>
  );
}
