"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Calculator,
  MessageSquare,
  Bot,
  Copy,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Layers,
  Activity,
  Briefcase,
  Calendar,
  ShieldCheck
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import { OrganizationData } from "@/types";

interface CommandPaletteProps {
  organization: OrganizationData | null;
}

export default function CommandPalette({ organization }: CommandPaletteProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        soundFX.click();
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const waNumber = organization?.whatsappNumber?.replace(/[^0-9]/g, "") || "919876543210";
  const defaultMsg = encodeURIComponent(
    organization?.whatsappDefaultMessage ||
      "Hello HP Edit Enterprise! I am interested in building a project with you."
  );
  const whatsappUrl = `https://wa.me/${waNumber}?text=${defaultMsg}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("contact@hpedit.com");
    setCopiedText(true);
    soundFX.success();
    setTimeout(() => setCopiedText(false), 2000);
  };

  const actions = [
    {
      id: "book",
      title: "Schedule Video Discovery Call (15-min Sprint Scoping)",
      category: "Scheduling",
      icon: Calendar,
      badge: "Instant Google Meet",
      run: () => {
        setIsOpen(false);
        soundFX.click();
        router.push("/book");
      },
    },
    {
      id: "estimator",
      title: "Calculate Project Cost & Sprint Timeline",
      category: "Tools",
      icon: Calculator,
      badge: "Interactive PDF",
      run: () => {
        setIsOpen(false);
        soundFX.click();
        router.push("/estimator");
      },
    },
    {
      id: "ai-lab",
      title: "Open Autonomous AI Agent Sandbox & Swarm Lab",
      category: "AI",
      icon: Bot,
      badge: "Gemini 2.0 / Claude 3.7",
      run: () => {
        setIsOpen(false);
        soundFX.click();
        router.push("/ai-lab");
      },
    },
    {
      id: "services",
      title: "Explore 8 Dedicated Engineering Capabilities",
      category: "Capabilities",
      icon: Layers,
      badge: "Sub-100ms Architecture",
      run: () => {
        setIsOpen(false);
        soundFX.click();
        router.push("/services");
      },
    },
    {
      id: "whatsapp",
      title: "Connect with Principal Architect on WhatsApp",
      category: "Direct Channel",
      icon: MessageSquare,
      badge: "< 5 Min Response",
      run: () => {
        setIsOpen(false);
        soundFX.click();
        window.open(whatsappUrl, "_blank");
      },
    },
    {
      id: "track",
      title: "Track Active Project Sprint & Milestone Status",
      category: "Tracking",
      icon: Activity,
      badge: "Live Status",
      run: () => {
        setIsOpen(false);
        soundFX.click();
        router.push("/track");
      },
    },
    {
      id: "security",
      title: "Inspect Cyber Threat Logs & Firewall Posture",
      category: "Security",
      icon: ShieldCheck,
      badge: "Zero-Trust",
      run: () => {
        setIsOpen(false);
        soundFX.click();
        router.push("/security");
      },
    },
    {
      id: "careers",
      title: "View Open Engineering Roles & Join Guild",
      category: "Careers",
      icon: Briefcase,
      badge: "Top 1% Collective",
      run: () => {
        setIsOpen(false);
        soundFX.click();
        router.push("/careers");
      },
    },
    {
      id: "copy-email",
      title: "Copy Official Email Address",
      category: "Quick Action",
      icon: Copy,
      badge: copiedText ? "Copied!" : "contact@hpedit.com",
      run: handleCopyEmail,
    },
  ];

  const filteredActions = searchQuery.trim() === ""
    ? actions
    : actions.filter((a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      {/* Command Palette Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl glass-dropdown border border-cyan-500/40 p-4 shadow-2xl space-y-4">
            {/* Input Header */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or jump to feature (e.g. Book, Estimator, AI Lab)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white text-xs placeholder:text-gray-500 focus:outline-none"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded text-gray-400">
                ESC
              </kbd>
            </div>

            {/* List of Actions */}
            <div className="space-y-1 max-h-80 overflow-y-auto no-scrollbar">
              {filteredActions.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No matching commands found.
                </div>
              ) : (
                filteredActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.run}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-300 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-gray-400">{item.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {item.badge}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
