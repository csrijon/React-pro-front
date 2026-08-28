import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import CostEstimator from "@/components/CostEstimator";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import { Calculator } from "lucide-react";
import { OrganizationData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project Scope & Cost Estimator | HP Edit Enterprise",
  description:
    "Interactive pricing calculator. Estimate project investment ranges across USD, INR, EUR, GBP, and AED. Download official PDF specifications.",
  keywords: ["software pricing calculator", "app development cost estimator", "AI agent pricing", "Next.js development cost", "HP Edit"],
  alternates: {
    canonical: "https://www.hpedit.com/estimator",
  },
  openGraph: {
    title: "Interactive Project Scope & Cost Estimator | HP Edit Enterprise",
    description: "Calculate instant ballpark pricing, delivery schedules, and generate pre-filled technical specifications for your software build.",
    url: "https://www.hpedit.com/estimator",
    siteName: "HP Edit Enterprise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Scope & Cost Estimator | HP Edit Enterprise",
    description: "Calculate instant ballpark pricing and download official PDF proposals.",
  },
};

export default async function EstimatorPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-32 pb-32 lg:pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Calculator className="w-3.5 h-3.5" />
                <span>Instant Transparent Estimates</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                Project Scope &amp; <span className="text-gradient-cyan">Pricing Calculator</span>
              </h1>
              <p className="mt-4 text-gray-300 text-sm sm:text-lg leading-relaxed">
                Select your required platforms, complexity tier, and AI superpowers to generate real-time ballpark investment ranges and sprint schedules.
              </p>
            </div>

            <CostEstimator organization={org as unknown as OrganizationData} />
          </div>
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
