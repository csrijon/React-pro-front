import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import BookingExperience from "@/components/BookingExperience";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import { OrganizationData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Schedule a 1-on-1 Video Discovery Call | HP Edit Enterprise",
  description:
    "Schedule a direct 15-minute Sprint Discovery or 30-minute Architecture Consultation with our Principal Engineering Architect. Pick your timezone and receive an instant Google Meet link.",
  keywords: ["book discovery call", "schedule architecture consultation", "software consultation meeting", "HP Edit booking"],
  alternates: {
    canonical: "https://www.hpedit.com/book",
  },
  openGraph: {
    title: "Schedule a 1-on-1 Video Discovery Call | HP Edit Enterprise",
    description: "Pick your timezone and schedule a direct video consultation with our principal engineering team.",
    url: "https://www.hpedit.com/book",
    siteName: "HP Edit Enterprise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Discovery Call Booking | HP Edit Enterprise",
    description: "Schedule your 15-min technical discovery sprint.",
  },
};

export default async function BookCallPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <BookingExperience organization={org as unknown as OrganizationData} />
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
