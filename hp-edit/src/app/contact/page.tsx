import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import ContactSection from "@/components/ContactSection";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import { OrganizationData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Technical Scoping Hub | HP Edit Enterprise",
  description:
    "Schedule a high-priority technical consultation, request an enterprise quote, or reach our principal engineering team directly on WhatsApp.",
};

export default async function ContactPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-24 pb-20">
          <ContactSection organization={org as unknown as OrganizationData} />
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
