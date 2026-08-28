import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import TiltCard from "@/components/TiltCard";
import { BookOpen, Clock, ArrowRight, Sparkles, Tag, User } from "lucide-react";
import { OrganizationData, BlogPostData } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Engineering Insights & Frontier Tech Research | HP Edit Enterprise",
  description:
    "Technical deep-dives on Next.js 15, autonomous multi-agent pipelines, LangChain, Flutter native architectures, and enterprise WhatsApp Cloud API engineering.",
  keywords: ["engineering blog", "Next.js 15 tutorial", "AI multi-agent architecture", "Flutter mobile development", "WhatsApp Cloud API guide", "HP Edit research"],
  alternates: {
    canonical: "https://www.hpedit.com/blog",
  },
  openGraph: {
    title: "Engineering Insights & Frontier Tech Research | HP Edit Enterprise",
    description: "Technical articles on modern software engineering, autonomous AI agents, and enterprise architectures.",
    url: "https://www.hpedit.com/blog",
    siteName: "HP Edit Enterprise",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Insights | HP Edit Enterprise",
    description: "Deep-dives on Next.js 15, Flutter, and autonomous AI agents.",
  },
};

export default async function BlogPage() {
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  const blogs = await prisma.blogPost.findMany({
    where: { published: true },
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
                <BookOpen className="w-3.5 h-3.5" />
                <span>Engineering Insights</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                Architectural <span className="text-gradient-cyan">Deep-Dives</span>
              </h1>
              <p className="mt-4 text-gray-300 text-sm sm:text-lg leading-relaxed">
                Essays, architectural breakdowns, and benchmarks from our principal engineering studio.
              </p>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => {
                let tagList: string[] = [];
                try {
                  tagList = JSON.parse(post.tags || "[]");
                } catch {
                  tagList = post.tags ? post.tags.split(",") : [];
                }

                return (
                  <TiltCard key={post.id} glowColor="rgba(6, 182, 212, 0.25)">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="h-full rounded-3xl glass-panel p-8 border border-white/10 flex flex-col justify-between group block transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            {tagList[0] || "Architecture"}
                          </span>
                          <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readTime}</span>
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{post.authorName}</span>
                        </div>

                        <span className="font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          <span>Read</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
