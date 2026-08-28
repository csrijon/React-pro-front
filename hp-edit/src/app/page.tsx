import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ClientHomeExperience from "@/components/ClientHomeExperience";
import StructuredData from "@/components/StructuredData";
import { autoGenerateSeo } from "@/lib/seoGenerator";
import {
  OrganizationData,
  ServiceData,
  ProjectData,
  BlogPostData,
  TeamMemberData,
  FaqData
} from "@/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: "default" },
    });
    const services = await prisma.serviceOffering.findMany({ select: { title: true, category: true, shortDescription: true } });
    const blogs = await prisma.blogPost.findMany({ where: { published: true }, select: { title: true } });

    const seo = autoGenerateSeo({
      organization: org as unknown as OrganizationData,
      services: services as unknown as ServiceData[],
      blogs: blogs as unknown as BlogPostData[],
    });

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      alternates: {
        canonical: seo.canonical,
      },
      openGraph: {
        title: seo.title,
        description: seo.description,
        url: seo.canonical,
        siteName: org?.name || "HP Edit Enterprise",
        locale: "en_US",
        type: "website",
        images: [
          {
            url: org?.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
            width: 1200,
            height: 630,
            alt: seo.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: seo.title,
        description: seo.description,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch {
    return {
      title: "HP Edit Enterprise | Next-Gen Software, AI Agents & Enterprise Systems",
      description: "We architect superfast web apps, mobile apps, autonomous AI agents, enterprise automation systems, and WhatsApp integrations.",
    };
  }
}

export default async function HomePage() {
  let org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        id: "default",
        name: "HP Edit Enterprise",
        tagline: "Architecting Intelligent Software, AI Agents & Enterprise Systems",
        description: "We are an elite software engineering studio crafting high-speed web apps, mobile solutions, autonomous AI agents, enterprise automation pipelines, and WhatsApp growth engines.",
      },
    });
  }

  const services = await prisma.serviceOffering.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  const projects = await prisma.projectShowcase.findMany({
    orderBy: { order: "asc" },
  });

  const blogs = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const team = await prisma.teamMember.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  const faqs = await prisma.faqItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <>
      <StructuredData
        organization={org as unknown as OrganizationData}
        services={services as unknown as ServiceData[]}
        faqs={faqs as unknown as FaqData[]}
      />
      <ClientHomeExperience
        organization={org as unknown as OrganizationData}
        services={services as unknown as ServiceData[]}
        projects={projects as unknown as ProjectData[]}
        blogs={blogs as unknown as BlogPostData[]}
        team={team as unknown as TeamMemberData[]}
        faqs={faqs as unknown as FaqData[]}
      />
    </>
  );
}
