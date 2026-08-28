"use client";

import { Menu, Bell, Shield, Activity, ExternalLink, Sparkles } from "lucide-react";
import AdminNotificationsMenu from "./AdminNotificationsMenu";
import { AdminNotificationData } from "@/types";
import ThemeSwitcher from "../ThemeSwitcher";
import Link from "next/link";

interface AdminTopBarProps {
  activeTab: string;
  notifications?: AdminNotificationData[];
  onSelectTab: (tabId: string) => void;
  onOpenMobileSidebar: () => void;
  username: string;
  userRole?: string;
}

export default function AdminTopBar({
  activeTab,
  notifications = [],
  onSelectTab,
  onOpenMobileSidebar,
  username,
  userRole,
}: AdminTopBarProps) {
  const getTabTitle = (tabId: string) => {
    switch (tabId) {
      case "analytics":
        return { title: "Executive Analytics", desc: "Real-time pipeline conversion, demand telemetry & revenue intelligence" };
      case "activity":
        return { title: "Live Customer Radar", desc: "Real-time visitor interactions, active sessions & click streams" };
      case "threats":
        return { title: "Bot Shield & Security Threats", desc: "DDoS mitigation, anomaly detection & blocked malicious requests" };
      case "inquiries":
        return { title: "Inquiries CRM & Lead Pipeline", desc: "High-ticket project briefs, client specifications & multichannel dispatcher" };
      case "bookings":
        return { title: "1-Click Video Call Bookings", desc: "Scheduled 15-min discovery sprints and 30-min architecture consultations" };
      case "applications":
        return { title: "Careers Inbox & Talent", desc: "Engineering applications, portfolio submissions & candidate reviews" };
      case "users":
        return { title: "Team & Role-Based Access Control (RBAC)", desc: "Manage team permissions, invite administrators & approve role change requests" };
      case "audit":
        return { title: "Audit & Accountability Logs", desc: "Immutable trail of all administrative actions, logins & data mutations" };
      case "ai-settings":
        return { title: "AI Model Keys & Instant Webhooks", desc: "Configure Gemini 2.0 Flash RAG keys & Meta WhatsApp lead alert webhooks" };
      case "services":
        return { title: "Services Bento Manager", desc: "Create, edit and reorder engineering capabilities & deliverables" };
      case "projects":
        return { title: "Case Studies & Portfolio", desc: "Manage production case studies, client logos and impact metrics" };
      case "blogs":
        return { title: "Tech Blogs & Publications", desc: "Publish engineering articles, system architecture breakdowns & news" };
      case "team":
        return { title: "Studio Team Members", desc: "Showcase partners, lead engineers and digital strategists" };
      case "faqs":
        return { title: "Frequently Asked Questions", desc: "Manage client FAQs, categories and answers" };
      case "org":
        return { title: "Organization & Contact Settings", desc: "Update studio name, headquarters, phone, email & WhatsApp defaults" };
      case "theme":
        return { title: "Theme, Colors & Custom Fonts", desc: "Customize dark/light mode palette, typography and audio sound effects" };
      case "seo":
        return { title: "SEO, Meta & SERP Management", desc: "Fine-tune page meta titles, OG images, keywords and search indexing" };
      case "socials":
        return { title: "Social Links & Community", desc: "Update GitHub, LinkedIn, Twitter/X, Instagram and Discord links" };
      case "about":
        return { title: "About Us & Key Metrics", desc: "Edit company story, founding mission, and studio statistics" };
      case "security":
        return { title: "Security & Portal Slug", desc: "Change the secret Admin URL slug and reset master passwords" };
      default:
        return { title: "Enterprise Control Panel", desc: "Manage studio operations, CRM, content and security" };
    }
  };

  const info = getTabTitle(activeTab);

  return (
    <header className="bg-cyber-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-30 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Left: Mobile Sidebar Trigger + Breadcrumb */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider hidden sm:inline">
              HP EDIT ADMIN /
            </span>
            <h1 className="text-sm sm:text-base font-extrabold text-white truncate">
              {info.title}
            </h1>
          </div>
          <span className="text-[11px] text-gray-400 truncate hidden md:inline">
            {info.desc}
          </span>
        </div>
      </div>

      {/* Right: Notification Bell, Edge Latency, Theme Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Real-Time Admin Notifications Bell Center */}
        <AdminNotificationsMenu
          notifications={notifications}
          onSelectTab={onSelectTab}
        />

        {/* Live Edge Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>38ms</span>
        </div>

        {/* Live Site Shortcut */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-medium border border-white/10 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        </Link>
      </div>
    </header>
  );
}
