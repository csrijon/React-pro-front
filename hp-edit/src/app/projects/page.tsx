import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import { OrganizationData, ProjectData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Portfolio & Previous Work | HP Edit Enterprise",
  description:
    "Explore real-world software platforms, autonomous AI agents, enterprise automation systems, and high-conversion WhatsApp funnels engineered by HP Edit Enterprise.",
};

export default async function ProjectsPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  const projects = await prisma.projectShowcase.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-24 pb-12">
          <ProjectsShowcase
            projects={projects as unknown as ProjectData[]}
            title="Production Portfolio & Engineering Case Studies"
            subtitle="Explore our verified production deployments across hyper-scale SaaS, autonomous AI agents, mobile applications, and enterprise automation infrastructure."
            showFilters={true}
          />
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
