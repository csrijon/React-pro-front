import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import { Clock, Tag, ArrowLeft, User, Sparkles, Share2, Calendar } from "lucide-react";
import { OrganizationData, BlogPostData } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!blog) {
    return { title: "Article Not Found | HP Edit Enterprise" };
  }

  return {
    title: `${blog.title} | HP Edit Engineering Insights`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [{ url: blog.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  const blog = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!blog) {
    notFound();
  }

  let tagsList: string[] = [];
  try {
    tagsList = JSON.parse(blog.tags);
  } catch {
    tagsList = ["Engineering"];
  }

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
        <Navbar organization={org as unknown as OrganizationData} />

        <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
          <article className="max-w-4xl mx-auto space-y-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white">Insights</Link>
              <span>/</span>
              <span className="text-cyan-400 font-semibold truncate max-w-xs">{blog.title}</span>
            </div>

            {/* Article Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {tagsList.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {blog.title}
              </h1>

              {/* Author & Meta Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-400 border-b border-white/10 pb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{blog.authorName}</div>
                    <div className="text-[10px] text-gray-400">{blog.authorRole || "Principal Architect"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{blog.readTime}</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {blog.coverImage && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden bg-cyber-900 border border-white/10 relative shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Article Content */}
            <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/10">
              <div className="prose prose-invert max-w-none text-gray-200 text-sm sm:text-base leading-relaxed space-y-6">
                {blog.content.split("\n\n").map((para, idx) => {
                  if (para.startsWith("## ")) {
                    return (
                      <h2 key={idx} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-white/10 pb-2">
                        {para.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (para.startsWith("### ")) {
                    return (
                      <h3 key={idx} className="text-lg font-bold text-cyan-300 mt-6 mb-3">
                        {para.replace("### ", "")}
                      </h3>
                    );
                  }
                  return (
                    <p key={idx} className="text-gray-300 leading-relaxed font-normal">
                      {para}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/blog"
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Articles</span>
              </Link>

              <Link
                href="/estimator"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                <span>Build Similar Architecture</span>
              </Link>
            </div>
          </article>
        </main>

        <Footer organization={org as unknown as OrganizationData} />
        <FuturisticChatbot organization={org as unknown as OrganizationData} />
      </div>
    </ThemeWrapper>
  );
}
