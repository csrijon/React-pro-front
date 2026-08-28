"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Terminal,
  Globe,
  Smartphone,
  Bot,
  Zap,
  Layers,
  Compass,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  ExternalLink,
  Calendar,
  Users,
  BookOpen,
  Briefcase,
  Search,
  TrendingUp,
  ShieldCheck,
  Monitor,
  Server,
  MessageSquare
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import { OrganizationData, ServiceData } from "@/types";
import ThemeSwitcher from "./ThemeSwitcher";
import WhatsAppIcon from "./WhatsAppIcon";

interface NavbarProps {
  organization: OrganizationData | null;
  services?: ServiceData[];
}

const defaultCapabilityLinks = [
  {
    name: "Full-Stack Web & Cloud",
    desc: "Next.js 15, React 19, server actions & edge cache",
    href: "/services/web-development",
    icon: Globe,
    badge: "Edge SSR",
  },
  {
    name: "Mobile App Development",
    desc: "Flutter, Swift & Kotlin with 120 FPS performance",
    href: "/services/mobile-apps",
    icon: Smartphone,
  },
  {
    name: "Autonomous AI Agents",
    desc: "Claude 3.7 & Gemini 2.0 multi-agent swarms",
    href: "/services/ai-agents",
    icon: Bot,
    badge: "Frontier",
  },
  {
    name: "Enterprise Automation",
    desc: "ERP robotic process pipelines & CRM sync",
    href: "/services/automation-tools",
    icon: Zap,
  },
  {
    name: "WhatsApp Business API",
    desc: "Official Meta Cloud API sales funnels",
    href: "/services/whatsapp-integration",
    icon: MessageSquare,
  },
  {
    name: "Digital Growth & Marketing",
    desc: "Full-funnel acquisition & conversion systems",
    href: "/services/digital-influencer-marketing",
    icon: TrendingUp,
  },
  {
    name: "Bespoke Computer Software",
    desc: "Cross-platform desktop & offline-first ERPs",
    href: "/services/desktop-software",
    icon: Monitor,
  },
  {
    name: "Custom IT Consulting",
    desc: "Cloud infrastructure & security hardening",
    href: "/services/it-consulting",
    icon: Server,
  },
];

function getServiceIconComponent(iconName?: string) {
  switch (iconName) {
    case "Smartphone":
      return Smartphone;
    case "Cpu":
    case "Bot":
      return Bot;
    case "Zap":
      return Zap;
    case "MessageSquare":
      return MessageSquare;
    case "TrendingUp":
      return TrendingUp;
    case "Monitor":
      return Monitor;
    case "Server":
      return Server;
    case "Layers":
      return Layers;
    case "Compass":
      return Compass;
    default:
      return Globe;
  }
}

const companyLinks = [
  { name: "About HP Edit", desc: "Our heritage, mission & ethos", href: "/about", icon: Compass },
  { name: "Production Portfolio", desc: "Real software & AI systems delivered", href: "/projects", icon: Layers },
  { name: "Contact Us", desc: "Direct inquiries, studio address & phone", href: "/contact", icon: PhoneCall },
  { name: "System Topology Architect", desc: "Interactive visual pipeline & latency designer", href: "/architecture", icon: Compass },
  { name: "Automation Maturity Scorecard", desc: "60-second diagnostic & transformation plan", href: "/scorecard", icon: Sparkles },
  { name: "In-House vs Sprint ROI", desc: "Cost & speedup comparison calculator", href: "/roi", icon: TrendingUp },
  { name: "Client Project Portal", desc: "Live sprint tracker & milestone sign-offs", href: "/portal", icon: ShieldCheck },
  { name: "Live System Status", desc: "99.99% operational uptime & latency monitor", href: "/status", icon: Server },
  { name: "Principal Architects", desc: "Meet the elite engineering team", href: "/team", icon: Users },
  { name: "Engineering Insights", desc: "Architecture blueprints & RAG guides", href: "/blog", icon: BookOpen },
  { name: "Careers & Guild", desc: "Join our top 1% engineer collective", href: "/careers", icon: Briefcase },
];

export default function Navbar({ organization, services }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [capabilitiesOpen, setCapabilitiesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [waDropdownOpen, setWaDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const capabilitiesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const companyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const waTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamically derive active published services in exact configured order
  const dynamicCapabilities = (services && services.length > 0)
    ? services
        .filter((s) => s.isActive !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((s) => ({
          name: s.title,
          desc: s.shortDescription,
          href: `/services/${s.slug}`,
          icon: getServiceIconComponent(s.icon),
          badge: s.isFeatured ? "Core" : undefined,
        }))
    : defaultCapabilityLinks;

  const handleCapabilitiesEnter = () => {
    if (capabilitiesTimeoutRef.current) clearTimeout(capabilitiesTimeoutRef.current);
    setCapabilitiesOpen(true);
  };

  const handleCapabilitiesLeave = () => {
    capabilitiesTimeoutRef.current = setTimeout(() => {
      setCapabilitiesOpen(false);
    }, 250);
  };

  const handleCompanyEnter = () => {
    if (companyTimeoutRef.current) clearTimeout(companyTimeoutRef.current);
    setCompanyOpen(true);
  };

  const handleCompanyLeave = () => {
    companyTimeoutRef.current = setTimeout(() => {
      setCompanyOpen(false);
    }, 250);
  };

  const handleWaEnter = () => {
    if (waTimeoutRef.current) clearTimeout(waTimeoutRef.current);
    setWaDropdownOpen(true);
  };

  const handleWaLeave = () => {
    waTimeoutRef.current = setTimeout(() => {
      setWaDropdownOpen(false);
    }, 300);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setCapabilitiesOpen(false);
    setCompanyOpen(false);
    setWaDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const waNumber = organization?.whatsappNumber?.replace(/[^0-9]/g, "") || "919836847984";
  const defaultMsg = encodeURIComponent(
    organization?.whatsappDefaultMessage ||
      "Hello HP Edit Enterprise! I am interested in building a high-speed software / AI project."
  );
  const whatsappUrl = `https://wa.me/${waNumber}?text=${defaultMsg}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "py-2 sm:py-3" : "py-3 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 transition-all duration-300 ${
              isScrolled
                ? "luxury-glass shadow-2xl border border-white/10 backdrop-blur-xl bg-cyber-950/85"
                : "bg-cyber-950/60 border border-white/5 backdrop-blur-md"
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={() => soundFX.click()}
              className="flex items-center gap-2.5 group"
            >
              {organization?.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={organization.logoUrl}
                  alt={organization.name || "HP Edit"}
                  className="h-7 w-auto object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-glow-cyan/25 transition-transform group-hover:scale-105">
                  <div className="w-full h-full bg-cyber-950 rounded-[9px] flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  {organization?.name ? organization.name.toUpperCase() : "HP EDIT"}
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded uppercase tracking-wider hidden sm:inline-block">
                  Enterprise
                </span>
              </div>
            </Link>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-gray-200">
              {/* Capabilities Mega Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleCapabilitiesEnter}
                onMouseLeave={handleCapabilitiesLeave}
              >
                <button
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setCapabilitiesOpen(!capabilitiesOpen);
                  }}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors ${
                    capabilitiesOpen || pathname.startsWith("/services")
                      ? "text-white bg-white/10"
                      : "hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>Capabilities</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      capabilitiesOpen ? "rotate-180 text-cyan-400" : "text-gray-400"
                    }`}
                  />
                </button>

                {capabilitiesOpen && (
                  <div
                    onMouseEnter={handleCapabilitiesEnter}
                    onMouseLeave={handleCapabilitiesLeave}
                    className="absolute left-0 mt-2 w-[580px] rounded-3xl glass-dropdown border border-cyan-500/30 p-3.5 shadow-2xl z-50 animate-in zoom-in-95 duration-150"
                  >
                    <div className="text-xs font-bold text-gray-300 uppercase tracking-wider px-3 py-1.5 border-b border-white/5 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>All Engineering Capabilities</span>
                      </span>
                      <span className="text-cyan-300 font-mono text-xs font-bold">
                        {dynamicCapabilities.length} Published
                      </span>
                    </div>

                    {/* 2-Column Mega Grid */}
                    <div className="grid grid-cols-2 gap-2 pt-2.5">
                      {dynamicCapabilities.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              soundFX.click();
                              setCapabilitiesOpen(false);
                            }}
                            className="flex items-start gap-2.5 p-2 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                          >
                            <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/25 group-hover:scale-105 transition-all mt-0.5 shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-xs text-gray-200 group-hover:text-white flex items-center gap-1.5 leading-tight">
                                <span className="truncate">{item.name}</span>
                                {item.badge && (
                                  <span className="px-1 py-0.2 text-[8px] font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30 shrink-0">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-400 truncate mt-0.5 leading-tight">
                                {item.desc}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Dropdown Footer Quick Links */}
                    <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] px-2">
                      <Link
                        href="/architecture"
                        onClick={() => {
                          soundFX.click();
                          setCapabilitiesOpen(false);
                        }}
                        className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-mono font-medium"
                      >
                        <Compass className="w-3 h-3" />
                        <span>System Topology Architect</span>
                      </Link>

                      <Link
                        href="/services"
                        onClick={() => {
                          soundFX.click();
                          setCapabilitiesOpen(false);
                        }}
                        className="text-gray-300 hover:text-white font-medium"
                      >
                        View Full Services Catalog →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Lab Link with pulsing neural badge */}
              <Link
                href="/ai-lab"
                onClick={() => soundFX.click()}
                className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${
                  pathname === "/ai-lab"
                    ? "text-purple-300 bg-purple-500/15 border border-purple-500/30 shadow-glow-purple/20"
                    : "hover:text-purple-300 hover:bg-white/5"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>AI Lab</span>
              </Link>

              {/* Case Studies Link */}
              <Link
                href="/case-studies"
                onClick={() => soundFX.click()}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  pathname === "/case-studies" ? "text-white bg-white/10" : "hover:text-white hover:bg-white/5"
                }`}
              >
                Case Studies
              </Link>

              {/* Cost & Timeline Estimator Link */}
              <Link
                href="/estimator"
                onClick={() => soundFX.click()}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  pathname === "/estimator" ? "text-white bg-white/10" : "hover:text-white hover:bg-white/5"
                }`}
              >
                Estimator
              </Link>

              {/* Contact Us Link */}
              <Link
                href="/contact"
                onClick={() => soundFX.click()}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  pathname === "/contact" ? "text-white bg-white/10" : "hover:text-white hover:bg-white/5"
                }`}
              >
                Contact
              </Link>

              {/* Company Dropdown */}
              <div
                className="relative"
                onMouseEnter={handleCompanyEnter}
                onMouseLeave={handleCompanyLeave}
              >
                <button
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setCompanyOpen(!companyOpen);
                  }}
                  className={`px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors ${
                    companyOpen || ["/about", "/team", "/blog", "/careers", "/architecture", "/scorecard", "/portal"].includes(pathname)
                      ? "text-white bg-white/10"
                      : "hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>Company</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      companyOpen ? "rotate-180 text-cyan-400" : "text-gray-400"
                    }`}
                  />
                </button>

                {companyOpen && (
                  <div
                    onMouseEnter={handleCompanyEnter}
                    onMouseLeave={handleCompanyLeave}
                    className="absolute left-0 mt-2 w-80 rounded-3xl glass-dropdown border border-white/10 p-2.5 shadow-2xl z-50 animate-in zoom-in-95 duration-150"
                  >
                    <div className="space-y-1">
                      {companyLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              soundFX.click();
                              setCompanyOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-gray-200 group-hover:text-white leading-tight">{item.name}</div>
                              <div className="text-[11px] text-gray-400 truncate mt-0.5">{item.desc}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action Suite */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Theme Toggle */}
              <div className="hidden sm:block">
                <ThemeSwitcher compact />
              </div>

              {/* WhatsApp Quick Connect Trigger */}
              <div
                className="relative"
                onMouseEnter={handleWaEnter}
                onMouseLeave={handleWaLeave}
              >
                <button
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setWaDropdownOpen(!waDropdownOpen);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-transform hover:scale-105"
                  title="WhatsApp Direct Channel"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                {waDropdownOpen && (
                  <div
                    onMouseEnter={handleWaEnter}
                    onMouseLeave={handleWaLeave}
                    className="absolute right-0 mt-2 w-64 rounded-3xl glass-dropdown border border-emerald-500/30 p-2.5 shadow-2xl z-50 animate-in zoom-in-95"
                  >
                    <div className="text-xs font-bold text-gray-300 uppercase tracking-wider px-2 py-1 flex items-center justify-between border-b border-white/5">
                      <span>Direct WhatsApp</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setWaDropdownOpen(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-white/5 text-xs text-gray-200 hover:text-white transition-colors mt-1"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <div>
                        <div className="font-bold text-emerald-300 text-xs">Founder &amp; Principal Architect</div>
                        <div className="text-[11px] text-gray-300">Direct technical scoping</div>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Book Discovery Call CTA Pill */}
              <Link
                href="/book"
                onClick={() => soundFX.click()}
                className="px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-glow-cyan/20 transition-all hover:scale-105 flex items-center gap-1 sm:gap-1.5"
              >
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Book Call</span>
                <span className="sm:hidden">Book</span>
              </Link>

              {/* Mobile Menu Trigger */}
              <button
                type="button"
                onClick={() => {
                  soundFX.click();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:text-white lg:hidden"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Flyout Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-2 p-4 pb-8 rounded-3xl glass-dropdown border border-white/10 shadow-2xl space-y-4 animate-in slide-in-from-top-4 duration-200 max-h-[82vh] overflow-y-auto">
              <div className="space-y-1 text-xs">
                <div className="px-2 py-1 font-bold text-[10px] uppercase font-mono text-cyan-300">
                  Capabilities ({dynamicCapabilities.length})
                </div>
                {dynamicCapabilities.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-white/5 font-semibold text-gray-200"
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-2 border-t border-white/5">
                  <Link
                    href="/ai-lab"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-purple-500/10 font-bold text-purple-300"
                  >
                    ✨ AI Lab (Autonomous Agents)
                  </Link>
                  <Link
                    href="/architecture"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-cyan-500/10 font-bold text-cyan-300"
                  >
                    📐 System Topology Architect
                  </Link>
                  <Link
                    href="/scorecard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-purple-500/10 font-bold text-purple-300"
                  >
                    📊 Maturity Scorecard
                  </Link>
                  <Link
                    href="/book"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-cyan-500/10 font-bold text-cyan-300"
                  >
                    📅 Book Discovery Video Call
                  </Link>
                  <Link
                    href="/case-studies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-white/5 font-semibold text-gray-200"
                  >
                    Case Studies &amp; Benchmarks
                  </Link>
                  <Link
                    href="/estimator"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-white/5 font-semibold text-gray-200"
                  >
                    Cost &amp; Timeline Estimator
                  </Link>
                  <Link
                    href="/portal"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-white/5 font-semibold text-gray-200"
                  >
                    Client Project Portal
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-white/5 font-semibold text-gray-200"
                  >
                    About HP Edit
                  </Link>
                  <Link
                    href="/team"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-white/5 font-semibold text-gray-200"
                  >
                    Engineering Team
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-2 rounded-xl hover:bg-white/5 font-semibold text-gray-200"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
