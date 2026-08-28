"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Activity,
  ShieldCheck,
  Inbox,
  Calendar,
  Briefcase,
  UserCheck,
  FileSpreadsheet,
  Bot,
  Building,
  Palette,
  Globe,
  Share2,
  Compass,
  Layers,
  Award,
  BookOpen,
  Users,
  HelpCircle,
  Key,
  ExternalLink,
  LogOut,
  Terminal,
  ChevronRight,
  X,
  Sparkles,
  ShieldAlert,
  Sliders,
  Columns
} from "lucide-react";
import { logoutAdmin } from "@/lib/actions";
import ThemeSwitcher from "../ThemeSwitcher";
import { soundFX } from "../CyberAudioFx";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  count?: number;
  roles?: string[];
}

interface NavGroup {
  groupName: string;
  items: TabItem[];
}

interface AdminSidebarProps {
  username: string;
  userRole?: string;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  counts?: {
    newInquiries?: number;
    newBookings?: number;
    newApplications?: number;
    pendingRequests?: number;
    activitiesCount?: number;
    threatsCount?: number;
    servicesCount?: number;
    projectsCount?: number;
    blogsCount?: number;
    teamCount?: number;
    faqsCount?: number;
    logsCount?: number;
    usersCount?: number;
  };
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function AdminSidebar({
  username,
  userRole = "SUPER_ADMIN",
  activeTab,
  onSelectTab,
  counts = {},
  mobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    soundFX.click();
    setLoggingOut(true);
    await logoutAdmin();
    router.push("/admin");
    router.refresh();
  };

  const getRoleBadge = (role: string = "SUPER_ADMIN") => {
    const norm = (role || "SUPER_ADMIN").toUpperCase().replace(/[^A-Z0-9]/g, "");
    switch (norm) {
      case "SUPERADMIN":
      case "ADMIN":
        return { label: "Super Admin", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-bold" };
      case "SALESLEAD":
        return { label: "Sales Lead", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold" };
      case "CONTENTMANAGER":
        return { label: "Content Lead", color: "bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold" };
      case "TALENTHR":
        return { label: "HR Lead", color: "bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold" };
      case "SECURITYAUDITOR":
        return { label: "Security Auditor", color: "bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold" };
      default:
        return { label: "Super Admin", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-bold" };
    }
  };

  const badge = getRoleBadge(userRole);

  const navGroups: NavGroup[] = [
    {
      groupName: "Intelligence & Radar",
      items: [
        { id: "analytics", label: "Executive Analytics", icon: BarChart3, roles: ["SUPER_ADMIN", "SALES_LEAD"] },
        { id: "activity", label: "Live Customer Radar", icon: Activity, count: counts.activitiesCount, roles: ["SUPER_ADMIN", "SALES_LEAD"] },
        { id: "threats", label: "Bot Shield & Threats", icon: ShieldCheck, count: counts.threatsCount, roles: ["SUPER_ADMIN", "SECURITY_AUDITOR"] },
      ],
    },
    {
      groupName: "CRM & Pipelines",
      items: [
        { id: "kanban", label: "Pipeline Kanban", icon: Columns, roles: ["SUPER_ADMIN", "SALES_LEAD"] },
        { id: "inquiries", label: "Inquiries CRM", icon: Inbox, badge: counts.newInquiries ? counts.newInquiries : undefined, roles: ["SUPER_ADMIN", "SALES_LEAD"] },
        { id: "bookings", label: "Video Bookings", icon: Calendar, badge: counts.newBookings ? counts.newBookings : undefined, roles: ["SUPER_ADMIN", "SALES_LEAD"] },
        { id: "client-projects", label: "Client Portals & Sprints", icon: Layers, roles: ["SUPER_ADMIN", "SALES_LEAD", "CONTENT_MANAGER"] },
        { id: "applications", label: "Careers Inbox", icon: Briefcase, badge: counts.newApplications ? counts.newApplications : undefined, roles: ["SUPER_ADMIN", "TALENT_HR"] },
      ],
    },
    {
      groupName: "Governance & Security",
      items: [
        { id: "toggles", label: "Site Modules & Toggles", icon: Sliders, roles: ["SUPER_ADMIN"] },
        {
          id: "users",
          label: "Team & RBAC",
          icon: UserCheck,
          count: counts.usersCount,
          badge: counts.pendingRequests ? counts.pendingRequests : undefined,
          roles: ["SUPER_ADMIN", "SALES_LEAD", "CONTENT_MANAGER", "TALENT_HR", "SECURITY_AUDITOR"],
        },
        { id: "audit", label: "Audit & Logs", icon: FileSpreadsheet, count: counts.logsCount, roles: ["SUPER_ADMIN", "SECURITY_AUDITOR"] },
        { id: "ai-settings", label: "AI & Outbound Alerts", icon: Bot, roles: ["SUPER_ADMIN"] },
        { id: "security", label: "Security & Slug", icon: Key, roles: ["SUPER_ADMIN"] },
      ],
    },
    {
      groupName: "Studio & Content CMS",
      items: [
        { id: "services", label: "Services Bento", icon: Layers, count: counts.servicesCount, roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
        { id: "projects", label: "Case Studies", icon: Award, count: counts.projectsCount, roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
        { id: "blogs", label: "Tech Blogs", icon: BookOpen, count: counts.blogsCount, roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
        { id: "team", label: "Team Members", icon: Users, count: counts.teamCount, roles: ["SUPER_ADMIN", "CONTENT_MANAGER", "TALENT_HR"] },
        { id: "faqs", label: "FAQs", icon: HelpCircle, count: counts.faqsCount, roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
        { id: "org", label: "Organization Info", icon: Building, roles: ["SUPER_ADMIN"] },
        { id: "theme", label: "Theme & Fonts", icon: Palette, roles: ["SUPER_ADMIN"] },
        { id: "seo", label: "SEO & SERP", icon: Globe, roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
        { id: "socials", label: "Social Links", icon: Share2, roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
        { id: "about", label: "About Us & Stats", icon: Compass, roles: ["SUPER_ADMIN", "CONTENT_MANAGER"] },
      ],
    },
  ];

  const normalizedRole = (userRole || "SUPER_ADMIN").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const isSuperAdmin = normalizedRole === "SUPERADMIN" || normalizedRole === "ADMIN" || !userRole;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-cyber-950/95 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col justify-between transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header: Brand & Identity */}
        <div className="p-5 border-b border-white/10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link href="/" target="_blank" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-glow-cyan/20">
                <div className="w-full h-full bg-cyber-950 rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  HP EDIT ENTERPRISE
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  Control Center
                </span>
              </div>
            </Link>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="p-3 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-between mt-1">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{username}</span>
              </span>
              <span className={`text-[9px] font-black uppercase tracking-wider border px-2 py-0.5 rounded mt-1 w-fit ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono text-right">
              <div>Edge Online</div>
              <div className="text-emerald-400 font-bold">38ms</div>
            </div>
          </div>
        </div>

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar">
          {navGroups.map((group, gIdx) => {
            const filteredItems = group.items.filter((item) => {
              if (isSuperAdmin) return true;
              return item.roles?.some(
                (r) => r.toUpperCase().replace(/[^A-Z0-9]/g, "") === normalizedRole
              );
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1.5">
                <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-gray-400 font-mono">
                  {group.groupName}
                </div>

                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          soundFX.click();
                          onSelectTab(item.id);
                          onCloseMobile();
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-white border border-cyan-500/40 shadow-glow-cyan/15 font-black"
                            : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              isActive ? "text-cyan-400 scale-110" : "text-gray-400 group-hover:text-cyan-300"
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded-full bg-purple-500 text-white text-[10px] font-mono font-bold animate-pulse">
                              {item.badge}
                            </span>
                          )}
                          {item.count !== undefined && !item.badge && (
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                                isActive ? "bg-cyan-500/30 text-cyan-200" : "bg-white/5 text-gray-400"
                              }`}
                            >
                              {item.count}
                            </span>
                          )}
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isActive ? "text-cyan-400 translate-x-0.5 opacity-100" : "text-gray-600 opacity-0 group-hover:opacity-60"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Utility Bar: Live Site, Theme Switcher, Sign Out */}
        <div className="p-4 border-t border-white/10 bg-cyber-950/80 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            {/* View Live Site */}
            <Link
              href="/"
              target="_blank"
              className="flex-1 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold border border-white/10 flex items-center justify-center gap-2 transition-colors group"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Theme Switcher */}
            <ThemeSwitcher compact />
          </div>

          {/* Sign Out */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
