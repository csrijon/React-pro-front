"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, ExternalLink, LogOut, ShieldCheck, Activity } from "lucide-react";
import { logoutAdmin } from "@/lib/actions";
import ThemeSwitcher from "../ThemeSwitcher";
import AdminNotificationsMenu from "./AdminNotificationsMenu";
import { AdminNotificationData } from "@/types";
import { soundFX } from "../CyberAudioFx";

interface AdminHeaderProps {
  username: string;
  userRole?: string;
  notifications?: AdminNotificationData[];
  onSelectTab?: (tabId: string) => void;
}

export default function AdminHeader({
  username,
  userRole = "SUPER_ADMIN",
  notifications = [],
  onSelectTab,
}: AdminHeaderProps) {
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

  return (
    <header className="bg-cyber-950/95 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Admin Console Identifier */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-glow-cyan/20">
            <div className="w-full h-full bg-cyber-950 rounded-[10px] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-cyan-400" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">
                HP EDIT ENTERPRISE
              </span>
              <span className={`text-[9px] font-black uppercase tracking-wider border px-2 py-0.5 rounded ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono hidden sm:block">
              www.hpedit.com • Protected Environment
            </span>
          </div>
        </div>

        {/* Right: Notifications, Server Telemetry, Theme Switcher, Identity Badge, Live Site, Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Real-Time Admin Notifications Bell Center */}
          <AdminNotificationsMenu
            notifications={notifications}
            onSelectTab={onSelectTab}
          />

          {/* Live Edge Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Edge Online (38ms)</span>
          </div>

          {/* Theme Switcher */}
          <ThemeSwitcher compact />

          {/* View Live Site Button */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-medium border border-white/10 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </Link>

          {/* Logged in Identity */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Admin: <strong className="text-white font-mono">{username}</strong></span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Exiting..." : "Sign Out"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
