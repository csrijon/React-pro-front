import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import TiltCard from "@/components/TiltCard";
import { Users, Sparkles, Mail, Phone, ArrowRight, Briefcase } from "lucide-react";
import { OrganizationData, TeamMemberData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Principal Leadership & Engineering Guild | HP Edit Enterprise",
  description:
    "Meet the principal architects, engineers, and AI researchers behind HP Edit Enterprise. Top 1% engineering talent delivering high-stakes software.",
  keywords: ["software engineers", "AI researchers", "Next.js architects", "Flutter mobile developers", "HP Edit leadership", "engineering team"],
  alternates: {
    canonical: "https://www.hpedit.com/team",
  },
  openGraph: {
    title: "Principal Leadership & Engineering Guild | HP Edit Enterprise",
    description: "Meet the engineers, designers, and AI specialists behind HP Edit Enterprise.",
    url: "https://www.hpedit.com/team",
    siteName: "HP Edit Enterprise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Guild | HP Edit Enterprise",
    description: "Meet our principal software and AI architects.",
  },
};

export default async function TeamPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  const team = await prisma.teamMember.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Users className="w-3.5 h-3.5" />
                <span>The Engineering Guild</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                Architects of the <span className="text-gradient-cyan">Next Frontier</span>
              </h1>
              <p className="mt-4 text-gray-300 text-sm sm:text-lg leading-relaxed">
                Our core studio consists of principal full-stack developers, mobile engineers, and frontier AI researchers.
              </p>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <TiltCard key={member.id} glowColor="rgba(6, 182, 212, 0.25)">
                  <div className="h-full rounded-3xl glass-panel p-8 border border-white/10 flex flex-col justify-between group">
                    <div className="space-y-4">
                      {/* Photo / Avatar */}
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px]">
                        <div className="w-full h-full bg-cyber-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                          {member.photoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={member.photoUrl}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-black text-cyan-400 font-mono">
                              {member.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {member.name}
                        </h3>
                        <div className="text-xs text-cyan-400 font-mono mt-0.5">
                          {member.designation}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </div>

                    {/* Social & Contact Links */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            aria-label={`Email ${member.name}`}
                            className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.linkedinUrl && (
                          <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on LinkedIn`}
                            className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                            </svg>
                          </a>
                        )}
                        {member.githubUrl && (
                          <a
                            href={member.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${member.name} on GitHub`}
                            className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                            </svg>
                          </a>
                        )}
                      </div>

                      <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                        Active Lead
                      </span>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>

            {/* Careers Callout */}
            <div className="p-8 sm:p-12 rounded-3xl glass-dropdown border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white">Want to Join the Guild?</h3>
                <p className="text-sm text-gray-300">
                  We are hiring top 1% AI engineers, Next.js full-stack architects, and Flutter mobile leads.
                </p>
              </div>

              <Link
                href="/careers"
                className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 shrink-0 transition-transform hover:scale-105"
              >
                <Briefcase className="w-4 h-4" />
                <span>Explore Open Roles</span>
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
