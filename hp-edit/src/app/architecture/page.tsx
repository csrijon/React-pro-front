import { getOrganization, getPublishedServices } from "@/lib/actions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import SystemTopologyArchitect from "@/components/SystemTopologyArchitect";
import ComplianceTrustBadges from "@/components/ComplianceTrustBadges";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive System Topology & Architecture Designer | HP Edit Enterprise",
  description: "Visually design your custom software pipeline, AI agent clusters, vector databases, and integrations. Calculate real-time throughput and latency.",
};

export default async function ArchitecturePage() {
  const organization = await getOrganization();
  const services = await getPublishedServices();

  return (
    <ThemeWrapper organization={organization}>
      <div className="flex flex-col min-h-screen bg-cyber-950 text-white selection:bg-cyan-500 selection:text-black">
        <Navbar organization={organization} services={services} />

        <main className="flex-grow pt-32 pb-32 md:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SystemTopologyArchitect organization={organization} />
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
