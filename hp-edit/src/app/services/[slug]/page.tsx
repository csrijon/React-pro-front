import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import {
  Globe,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  MessageSquare,
  Clock,
  Code2
} from "lucide-react";
import { OrganizationData, ServiceData } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const SLUG_ALIASES: Record<string, string> = {
  "fullstack-web": "web-development",
  "web-platforms": "web-development",
  "web-apps": "web-development",
  "web-dev": "web-development",
  "enterprise-automation": "automation-tools",
  "workflow-automation": "automation-tools",
  "business-automation": "automation-tools",
  "whatsapp-api": "whatsapp-integration",
  "whatsapp-automation": "whatsapp-integration",
  "whatsapp-business": "whatsapp-integration",
  "ai-agents": "ai-agents",
  "ai-automation": "ai-agents",
  "llm-systems": "ai-agents",
  "mobile-apps": "mobile-apps",
  "mobile-app-development": "mobile-apps",
  "flutter-apps": "mobile-apps",
  "growth-marketing": "digital-influencer-marketing",
  "marketing": "digital-influencer-marketing",
  "desktop-software": "desktop-software",
  "custom-software": "desktop-software",
  "it-consulting": "it-consulting",
  "cloud-infrastructure": "it-consulting",
};

async function getServiceBySlug(slug: string) {
  const cleanSlug = slug.toLowerCase().trim();

  // 1. Direct match
  let service = await prisma.serviceOffering.findUnique({
    where: { slug: cleanSlug },
  });
  if (service) return service;

  // 2. Alias dictionary lookup
  const mappedSlug = SLUG_ALIASES[cleanSlug];
  if (mappedSlug) {
    service = await prisma.serviceOffering.findUnique({
      where: { slug: mappedSlug },
    });
    if (service) return service;
  }

  // 3. Fallback fuzzy search against all services
  const allServices = await prisma.serviceOffering.findMany({
    orderBy: { order: "asc" },
  });

  const normalized = cleanSlug.replace(/[^a-z0-9]/g, "");
  const fuzzy = allServices.find((s) => {
    const sNorm = s.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const titleNorm = s.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    return sNorm.includes(normalized) || normalized.includes(sNorm) || titleNorm.includes(normalized);
  });

  if (fuzzy) return fuzzy;

  // 4. Fallback to first available service if available
  return allServices[0] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found | HP Edit Enterprise" };
  }

  return {
    title: `${service.title} | HP Edit Enterprise`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  let featuresList: string[] = [];
  try {
    featuresList = JSON.parse(service.features);
  } catch {
    featuresList = [service.shortDescription];
  }

  const waNumber = org?.whatsappNumber?.replace(/[^0-9]/g, "") || "919876543210";
  const waMsg = encodeURIComponent(
    `Hello HP Edit Enterprise! I am interested in building a project with your "${service.title}" capabilities. Let's discuss scope.`
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMsg}`;

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white">Services</Link>
              <span>/</span>
              <span className="text-cyan-300 font-bold">{service.title}</span>
            </div>

            {/* Service Header */}
            <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-cyan-500/30 relative overflow-hidden bg-cyber-950/70">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{service.category}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {service.title}
              </h1>

              <p className="mt-6 text-base sm:text-lg text-gray-200 leading-relaxed max-w-3xl">
                {service.fullDescription || service.shortDescription}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discuss On WhatsApp</span>
                </a>
                <Link
                  href="/estimator"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25"
                >
                  <Zap className="w-4 h-4" />
                  <span>Estimate This Project</span>
                </Link>
              </div>
            </div>

            {/* Architecture Deliverables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                  <span>Key Deliverables &amp; Artifacts</span>
                </h2>
                <ul className="space-y-3 text-sm text-gray-200">
                  {featuresList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span>Sprint Delivery Framework</span>
                </h2>
                <div className="space-y-4 text-sm text-gray-200">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-bold text-cyan-300 mb-1">Phase 1: Architecture &amp; Schema Design (Days 1–5)</div>
                    <div className="text-xs text-gray-300">Complete API schema, wireframes, multi-agent topologies, and data contracts.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-bold text-purple-300 mb-1">Phase 2: Core Engineering &amp; AI Integration (Weeks 2–3)</div>
                    <div className="text-xs text-gray-300">High-speed Next.js/Flutter code, LLM orchestration, and backend pipeline builds.</div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="font-bold text-emerald-300 mb-1">Phase 3: QA, Stress Testing &amp; Production Handover (Week 4)</div>
                    <div className="text-xs text-gray-300">Load testing, CI/CD pipeline automation, full code IP handover, and live launch.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="pt-8 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/services"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Capabilities</span>
              </Link>
              <Link
                href="/estimator"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-bold flex items-center gap-2"
              >
                <span>Calculate Ballpark Estimate</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
