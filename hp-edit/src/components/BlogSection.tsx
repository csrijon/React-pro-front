"use client";

import { useState } from "react";
import { BlogPostData } from "@/types";
import { BookOpen, Clock, Tag, ArrowRight, X, Sparkles, MessageSquare } from "lucide-react";

interface BlogSectionProps {
  blogs: BlogPostData[];
}

export default function BlogSection({ blogs }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPostData | null>(null);

  if (!blogs || blogs.length === 0) return null;

  return (
    <section id="blog" className="py-24 relative bg-cyber-900 border-t border-white/10 overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Engineering Insights &amp; Research</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Latest From Our <span className="text-gradient-cyan">Tech Lab</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg">
            Practical architectures, case study teardowns, and modern software engineering blueprints.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((post) => {
            let tagsList: string[] = [];
            try {
              tagsList = JSON.parse(post.tags);
            } catch {
              tagsList = [];
            }

            return (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group rounded-2xl glass-panel-interactive overflow-hidden border border-white/10 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Cover image */}
                  {post.coverImage && (
                    <div className="relative w-full h-48 bg-cyber-950 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-400 border border-white/10">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tagsList.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-gray-400 mt-3 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer info */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                  <div className="text-[11px] text-gray-400">
                    By <strong className="text-white">{post.authorName}</strong>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Full Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-2xl glass-dropdown border border-cyan-500/30 p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95">
            <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <span>{selectedPost.readTime}</span>
                  <span>•</span>
                  <span>Published {new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {selectedPost.title}
                </h2>
                <div className="text-xs text-gray-400 mt-2">
                  Written by <strong className="text-white">{selectedPost.authorName}</strong> ({selectedPost.authorRole || "Architect"})
                </div>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedPost.coverImage && (
              <div className="my-6 rounded-xl overflow-hidden max-h-72 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-invert prose-cyan max-w-none text-sm text-gray-200 leading-relaxed space-y-4 whitespace-pre-wrap">
              {selectedPost.content}
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-400">
                Want to implement this architecture in your company?
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium"
                >
                  Close
                </button>
                <a
                  href="#contact"
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Consult With Authors</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
