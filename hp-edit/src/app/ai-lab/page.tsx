import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import AiAutomationDemo from "@/components/AiAutomationDemo";
import InteractiveSystemArchitecture from "@/components/InteractiveSystemArchitecture";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import { Bot, Sparkles, Cpu, ShieldCheck, Zap } from "lucide-react";
import { OrganizationData, ServiceData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Autonomous AI Agent & Automation Simulator | HP Edit Enterprise",
  description:
    "Interactive AI Agent Sandbox. Test live simulations of multi-agent LLM swarms, private enterprise RAG pipelines, and automated WhatsApp CRM funnels.",
  keywords: ["AI agent simulator", "autonomous AI agents", "enterprise RAG pipeline", "LangChain multi-agent", "Claude 3.7", "Gemini 2.0", "HP Edit AI Lab"],
  alternates: {
    canonical: "https://www.hpedit.com/ai-lab",
  },
  openGraph: {
    title: "Autonomous AI Agent & Automation Simulator | HP Edit Enterprise",
    description: "Interactive AI Agent Sandbox. Test live multi-agent pipelines interacting with ERPs, document streams, and WhatsApp lead funnels.",
    url: "https://www.hpedit.com/ai-lab",
    siteName: "HP Edit Enterprise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent & Automation Sandbox | HP Edit Enterprise",
    description: "Test autonomous multi-agent pipelines in real-time.",
  },
};

import AiAgentSandbox from "@/components/AiAgentSandbox";
import ComplianceTrustBadges from "@/components/ComplianceTrustBadges";

export default async function AiLabPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });
  const services = await prisma.serviceOffering.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar
          organization={org as unknown as OrganizationData}
          services={services as unknown as ServiceData[]}
        />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            <AiAgentSandbox organization={org as unknown as OrganizationData} />
            <AiAutomationDemo />
            <InteractiveSystemArchitecture />
          </div>

          <div className="mt-20">
            <ComplianceTrustBadges />
          </div>
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
