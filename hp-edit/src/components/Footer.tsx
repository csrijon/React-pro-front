"use client";

import Link from "next/link";
import {
  Terminal,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  ShieldCheck,
  Activity,
  FileText,
  Compass,
  Sparkles
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import { OrganizationData } from "@/types";

interface FooterProps {
  organization: OrganizationData | null;
}

export default function Footer({ organization }: FooterProps) {
  const scrollToTop = () => {
    soundFX.click();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const waNumber = organization?.whatsappNumber?.replace(/[^0-9]/g, "") || "919876543210";
  const defaultMsg = encodeURIComponent(
    organization?.whatsappDefaultMessage ||
      "Hello HP Edit Enterprise! Reaching out from your website footer."
  );
  const whatsappUrl = `https://wa.me/${waNumber}?text=${defaultMsg}`;

  return (
    <footer className="bg-cyber-950 pt-10 pb-12 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* COCOON FOOTER CONTAINER */}
      <div className="max-w-7xl mx-auto rounded-[2.5rem] sm:rounded-[3.5rem] glass-panel border border-cyan-500/20 p-8 sm:p-14 shadow-2xl bg-cyber-950/85 backdrop-blur-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Bio (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-block">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px]">
                <div className="w-full h-full bg-cyber-950 rounded-[10px] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white">HP EDIT ENTERPRISE</span>
                <span className="text-[11px] text-cyan-400 font-mono tracking-wider">www.hpedit.com</span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm">
              {organization?.description ||
                "Architecting high-performance web platforms, mobile apps, autonomous AI agents, enterprise automation systems, and growth engines."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {organization?.linkedinUrl && (
                <a
                  href={organization.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 flex items-center justify-center transition-colors border border-white/5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>
              )}
              {organization?.githubUrl && (
                <a
                  href={organization.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 flex items-center justify-center transition-colors border border-white/5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                  </svg>
                </a>
              )}
              {organization?.twitterUrl && (
                <a
                  href={organization.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter/X"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 flex items-center justify-center transition-colors border border-white/5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Core Capabilities */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Core Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li>
                <Link href="/services/web-platforms" className="hover:text-cyan-400 transition-colors">
                  Web &amp; Cloud Platforms
                </Link>
              </li>
              <li>
                <Link href="/services/mobile-apps" className="hover:text-cyan-400 transition-colors">
                  Mobile Apps (Flutter/iOS)
                </Link>
              </li>
              <li>
                <Link href="/ai-lab" className="hover:text-purple-400 transition-colors">
                  Autonomous AI Agents
                </Link>
              </li>
              <li>
                <Link href="/services/enterprise-automation" className="hover:text-cyan-400 transition-colors">
                  Enterprise Automation
                </Link>
              </li>
              <li>
                <Link href="/services/whatsapp-api" className="hover:text-cyan-400 transition-colors">
                  WhatsApp Business API
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Utilities & Pages */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Client Utilities
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li>
                <Link href="/book" className="hover:text-cyan-300 transition-colors text-cyan-300 font-bold flex items-center gap-1">
                  <span>📅 Book Video Discovery Call</span>
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="hover:text-cyan-400 transition-colors flex items-center gap-1 text-cyan-300 font-medium">
                  <Compass className="w-3.5 h-3.5" />
                  <span>System Topology Architect</span>
                </Link>
              </li>
              <li>
                <Link href="/scorecard" className="hover:text-purple-400 transition-colors flex items-center gap-1 text-purple-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Automation Maturity Scorecard</span>
                </Link>
              </li>
              <li>
                <Link href="/estimator" className="hover:text-cyan-400 transition-colors">
                  Cost &amp; Timeline Estimator
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Project Status Tracker</span>
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-cyan-400 transition-colors">
                  Verified Case Studies
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-cyan-400 transition-colors">
                  Production Portfolio &amp; Work
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>99.99% Live System Status</span>
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-cyan-400 transition-colors">
                  Careers &amp; Guild
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Security &amp; Mutual NDA</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Headquarters Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contact &amp; Campus</span>
            </h4>
            <div className="space-y-3 text-xs text-gray-300">
              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block font-semibold">Headquarters:</span>
                <span className="text-gray-200 block font-medium leading-snug mt-0.5">
                  {organization?.address || "ST 24, Awfis 4th Floor, Siddha Esplanade"}
                </span>
                <span className="text-gray-400 text-[11px] block mt-0.5">
                  {organization?.city || "Kolkata"} - {organization?.postalCode || "700013"}, {organization?.country || "India"}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block font-semibold">Direct Phones:</span>
                <div className="mt-1 flex flex-col gap-1">
                  <a
                    href={`tel:${organization?.primaryPhone?.replace(/\s+/g, "") || "+919836847984"}`}
                    className="text-white hover:text-cyan-300 transition-colors font-mono font-semibold"
                  >
                    {organization?.primaryPhone || "+91 9836847984"}
                  </a>
                  {organization?.secondaryPhone && (
                    <a
                      href={`tel:${organization.secondaryPhone.replace(/\s+/g, "")}`}
                      className="text-gray-300 hover:text-white transition-colors font-mono"
                    >
                      {organization.secondaryPhone}
                    </a>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-gray-400 block font-semibold">Inquiries:</span>
                <a
                  href={`mailto:${organization?.primaryEmail || "info@hpedit.com"}`}
                  className="text-cyan-300 hover:underline font-mono font-semibold block mt-0.5"
                >
                  {organization?.primaryEmail || "info@hpedit.com"}
                </a>
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal &amp; Trust
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-300">
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service &amp; IP
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-cyan-400 transition-colors">
                  Security &amp; Mutual NDA
                </Link>
              </li>
              <li>
                <Link href="/book" className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors block pt-1">
                  Book 15-Min Scoping →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & legal disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-300">
          <div className="space-y-1 text-center md:text-left">
            <div>
              &copy; {new Date().getFullYear()} HP Edit Enterprise (www.hpedit.com). All rights reserved.
            </div>
            <div className="text-xs text-gray-400">
              Disclaimer: All technical proposals, estimations, and architectural blueprints are subject to technical contract execution under our Master Services Agreement.
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors font-medium"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
