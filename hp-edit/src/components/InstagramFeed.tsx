"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Camera,
  Play,
  Layers,
  ArrowRight
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

interface InstagramPost {
  id: string;
  type: "image" | "reel" | "carousel";
  caption: string;
  likes: number;
  comments: number;
  tag: string;
  imageUrl: string;
  postUrl: string;
}

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: "ig-1",
    type: "reel",
    caption: "Benchmarking Next.js 15 Partial Prerendering (PPR) vs Cold Lambda starts. Sub-50ms TTFB across all edge nodes ⚡ #Nextjs #WebDev #Engineering",
    likes: 342,
    comments: 28,
    tag: "Next.js 15 PPR",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    postUrl: "https://www.instagram.com/hpeditenterprise",
  },
  {
    id: "ig-2",
    type: "carousel",
    caption: "System Architecture Blueprint: Deploying multi-tenant Autonomous RAG agents with pgvector & FastAPI microservices 🤖📐 #AIAgents #FastAPI",
    likes: 489,
    comments: 42,
    tag: "Architecture Blueprint",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    postUrl: "https://www.instagram.com/hpeditenterprise",
  },
  {
    id: "ig-3",
    type: "reel",
    caption: "Behind the scenes at our Kolkata Headquarters (Awfis Siddha Esplanade) — high-frequency sprint review day 🚀🏢 #KolkataTech #StudioLife",
    likes: 615,
    comments: 53,
    tag: "Studio Culture",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
    postUrl: "https://www.instagram.com/hpeditenterprise",
  },
  {
    id: "ig-4",
    type: "image",
    caption: "120Hz Flutter Mobile UI Showcase: Real-time biometric authentication and interactive trading charts on iOS & Android 📱✨ #FlutterDev #MobileApp",
    likes: 298,
    comments: 19,
    tag: "Flutter 120Hz UI",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
    postUrl: "https://www.instagram.com/hpeditenterprise",
  },
];

export default function InstagramFeed() {
  const instagramProfileUrl = "https://www.instagram.com/hpeditenterprise";

  return (
    <section id="instagram-feed" className="py-20 relative bg-cyber-950/90 border-t border-white/5 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-pink-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-white/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider">
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram Live Pulse</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineering Studio <span className="text-gradient-purple">Behind the Code</span>
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm">
              Follow <strong className="text-white">@hpeditenterprise</strong> for architecture breakdowns, code sprints, and studio updates.
            </p>
          </div>

          <a
            href={instagramProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFX.click()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-500/20 transition-all shrink-0 self-start sm:self-auto"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @hpeditenterprise</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX.click()}
              className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 aspect-square block shadow-xl transition-transform hover:-translate-y-1.5 duration-300"
            >
              {/* Background Image */}
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-950 via-cyber-950/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

              {/* Tag Pill on Top Right */}
              <div className="absolute top-3 right-3 z-10">
                <span className="text-[10px] font-mono font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 flex items-center gap-1">
                  {post.type === "reel" ? (
                    <Play className="w-2.5 h-2.5 fill-current text-pink-400" />
                  ) : (
                    <Layers className="w-2.5 h-2.5 text-cyan-400" />
                  )}
                  <span>{post.tag}</span>
                </span>
              </div>

              {/* Hover Details on Bottom */}
              <div className="absolute inset-x-0 bottom-0 p-4 z-10 space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed font-sans group-hover:text-white">
                  {post.caption}
                </p>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-pink-400">
                      <Heart className="w-3.5 h-3.5 fill-pink-400" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1 text-cyan-300">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.comments}</span>
                    </span>
                  </div>

                  <span className="text-white text-[10px] font-bold underline decoration-pink-500 flex items-center gap-0.5">
                    <span>View Post</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
