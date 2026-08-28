import { OrganizationData, ServiceData, ProjectData, BlogPostData, FaqData } from "@/types";

export interface GeneratedSeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
}

export function autoGenerateSeo({
  organization,
  services = [],
  projects = [],
  blogs = [],
  faqs = [],
}: {
  organization: OrganizationData | null;
  services?: ServiceData[];
  projects?: ProjectData[];
  blogs?: BlogPostData[];
  faqs?: FaqData[];
}): GeneratedSeoMetadata {
  const orgName = organization?.name || "HP Edit Enterprise";
  const city = organization?.city || "Bengaluru";
  const country = organization?.country || "India";

  // Build high-intent services keywords
  const serviceKeywords = services.map((s) => s.title);
  const serviceCategories = Array.from(new Set(services.map((s) => s.category)));

  // Build blog topics
  const blogTopics = blogs.map((b) => b.title);

  // Combine into high-ranking keyword array
  const coreKeywords = [
    orgName,
    "HP Edit",
    "software development firm",
    "AI agent development company",
    "enterprise automation studio",
    "WhatsApp Business API integration",
    "Next.js 15 React developers",
    "Flutter mobile app development",
    "custom software engineering",
    `IT services ${city}`,
    `software agency ${city} ${country}`,
    ...serviceKeywords,
    ...serviceCategories,
  ];

  // Auto-generate title
  const topServices = services.slice(0, 3).map((s) => s.title).join(", ");
  const title = `${orgName} | Software Engineering, AI Agents & Enterprise Systems`;

  // Auto-generate meta description from actual content
  const desc = organization?.description ||
    `HP Edit Enterprise is an elite software studio in ${city}, ${country} specializing in ${topServices || "web apps, mobile solutions, autonomous AI agents, and WhatsApp API automation"}.`;

  const cleanDescription = desc.length > 155 ? `${desc.slice(0, 152)}...` : desc;

  return {
    title: organization?.seoTitle || title,
    description: organization?.seoDescription || cleanDescription,
    keywords: Array.from(new Set(coreKeywords)),
    canonical: "https://www.hpedit.com",
  };
}

export function generateJsonLdSchema({
  organization,
  services = [],
  faqs = [],
}: {
  organization: OrganizationData | null;
  services?: ServiceData[];
  faqs?: FaqData[];
}) {
  const orgName = organization?.name || "HP Edit Enterprise";
  const url = "https://www.hpedit.com";

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: orgName,
    alternateName: "HP Edit",
    url: url,
    logo: organization?.logoUrl || `${url}/logo.png`,
    description: organization?.description || "Elite software engineering studio.",
    telephone: organization?.primaryPhone || "+919876543210",
    email: organization?.primaryEmail || "contact@hpedit.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: organization?.address || "Executive Tech Hub",
      addressLocality: organization?.city || "Bengaluru",
      postalCode: organization?.postalCode || "560100",
      addressCountry: organization?.country || "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "12.9716",
      longitude: "77.5946",
    },
    sameAs: [
      organization?.linkedinUrl,
      organization?.githubUrl,
      organization?.twitterUrl,
      organization?.instagramUrl,
      organization?.youtubeUrl,
    ].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Software & AI Engineering Services",
      itemListElement: services.map((s, idx) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.shortDescription,
          category: s.category,
        },
        position: idx + 1,
      })),
    },
  };

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } : null;

  return { orgSchema, faqSchema };
}
