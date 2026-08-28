"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Zap,
  CheckCircle2,
  Cpu,
  Server,
  Award
} from "lucide-react";

export default function ComplianceTrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: "SOC-2 Type II Architecture",
      subtitle: "Enterprise Data Isolation",
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    },
    {
      icon: Lock,
      title: "GDPR & ISO-27001 Ready",
      subtitle: "Zero-Data Retention AI Option",
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    },
    {
      icon: Zap,
      title: "99.99% Uptime Guarantee",
      subtitle: "Edge Distributed Architecture",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      icon: Server,
      title: "OWASP Top 10 Hardened",
      subtitle: "Continuous Threat Defense",
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
  ];

  return (
    <div className="py-8 border-t border-b border-white/5 bg-cyber-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl luxury-card border border-white/10 flex items-center gap-3.5 hover:border-white/20 transition-all shadow-lg"
              >
                <div className={`p-2.5 rounded-xl border ${b.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {b.title}
                  </h4>
                  <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                    {b.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
