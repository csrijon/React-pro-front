"use client";

import { useState, useTransition } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  Download,
  Sparkles,
  ArrowRight,
  Lock,
  Layers,
  Calendar,
  Building,
  Check,
  AlertCircle,
  Code2,
  Terminal,
  Activity,
  Layout
} from "lucide-react";
import { ClientProjectData, ProjectMilestoneData, OrganizationData } from "@/types";
import { lookupClientProject, signOffClientMilestone } from "@/lib/actions";
import { soundFX } from "../CyberAudioFx";

interface ClientPortalProps {
  initialProject?: ClientProjectData | null;
  organization?: OrganizationData | null;
}

export default function ClientPortalExperience({
  initialProject = null,
  organization,
}: ClientPortalProps) {
  const [project, setProject] = useState<ClientProjectData | null>(initialProject);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Sign off modal state
  const [selectedMilestone, setSelectedMilestone] = useState<ProjectMilestoneData | null>(null);
  const [clientSignName, setClientSignName] = useState("");
  const [signNotes, setSignNotes] = useState("");
  const [signSuccess, setSignSuccess] = useState("");
  const [signSubmitting, setSignSubmitting] = useState(false);

  const handleLookup = (codeToSearch?: string) => {
    soundFX.click();
    const query = codeToSearch || accessCode;
    if (!query.trim()) {
      setError("Please provide your project reference code (e.g. HPE-7849) or email.");
      return;
    }

    setError("");
    startTransition(async () => {
      const res = await lookupClientProject(query);
      if (res.success && res.project) {
        setProject(res.project);
      } else {
        setError(res.error || "Project not found.");
      }
    });
  };

  const handleSignOffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !selectedMilestone) return;

    soundFX.click();
    setSignSubmitting(true);
    setError("");

    try {
      const res = await signOffClientMilestone(
        project.id,
        selectedMilestone.id,
        clientSignName,
        signNotes
      );

      if (res.success) {
        soundFX.success();
        setSignSuccess(res.message || "Milestone successfully approved!");
        // Re-fetch project
        const updated = await lookupClientProject(project.projectCode);
        if (updated.success && updated.project) {
          setProject(updated.project);
        }
        setTimeout(() => {
          setSelectedMilestone(null);
          setSignSuccess("");
          setClientSignName("");
          setSignNotes("");
        }, 1800);
      } else {
        setError(res.error || "Failed to sign off milestone.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setSignSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return { label: "Milestone Completed", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
      case "IN_PROGRESS":
        return { label: "Sprint In Progress", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-bold animate-pulse" };
      case "REVIEW":
        return { label: "Ready for Client Sign-Off", color: "bg-purple-500/20 text-purple-300 border-purple-500/30 font-bold" };
      default:
        return { label: "Scheduled", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. If no project loaded, render Project Lookup Card */}
      {!project ? (
        <div className="max-w-xl mx-auto py-12">
          <div className="p-8 sm:p-10 rounded-3xl luxury-card border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Client Portal Access</h3>
                <p className="text-xs text-gray-400">Enter your Project Reference Code or Client Email</p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLookup();
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1.5 font-mono">
                  Project Code / Client Email
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="e.g. HPE-7849 or alex@omnicorp.ai"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-cyan-400 focus:outline-none placeholder:text-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-black text-sm shadow-glow-cyan/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <span>Unlock Client Project Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center">
              <span className="text-xs text-gray-400">Testing client portal? </span>
              <button
                type="button"
                onClick={() => {
                  setAccessCode("HPE-7849");
                  handleLookup("HPE-7849");
                }}
                className="text-xs font-bold text-cyan-400 hover:underline"
              >
                Load Live Demo Project (HPE-7849) →
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* 2. Active Authenticated Client Dashboard */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Project Command Bar */}
          <div className="p-6 sm:p-8 rounded-3xl luxury-card border border-cyan-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                    {project.projectCode}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                    {project.tier}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Sprint Active</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {project.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono pt-2">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{project.clientCompany || project.clientName}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Target Delivery: {project.targetDelivery || "Q3 2026"}</span>
                  </span>
                </div>
              </div>

              {/* Progress Ring & Switch Project button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4 shrink-0">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center w-48">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Sprint Completion
                  </div>
                  <div className="text-3xl font-black text-gradient-cyan mt-1">
                    {project.progressPercent}%
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setProject(null)}
                  className="text-xs text-gray-400 hover:text-white underline font-mono"
                >
                  Switch / Log Out Project
                </button>
              </div>
            </div>

            {/* Staging Vault Quick Access Strip */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
              {project.stagingUrl && (
                <a
                  href={project.stagingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Launch Live Staging Environment</span>
                </a>
              )}

              {project.figmaUrl && (
                <a
                  href={project.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Interactive Design System (Figma)</span>
                </a>
              )}

              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Client Code Repository Vault</span>
                </a>
              )}
            </div>
          </div>

          {/* 2. Interactive Sprints & Milestone Sign-Off Cards */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-white">Project Sprints &amp; Milestones</h3>
                <p className="text-xs text-gray-400">Review completed milestones, verify deliverable checklists, and sign off deliverables.</p>
              </div>
              <span className="text-xs text-cyan-400 font-mono font-bold">
                {project.milestones.filter((m) => m.status === "COMPLETED").length} of {project.milestones.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {project.milestones.map((m, idx) => {
                const badge = getStatusBadge(m.status);
                const deliverablesList = m.deliverables
                  ? m.deliverables.split(",").map((d) => d.trim()).filter(Boolean)
                  : [];

                return (
                  <div
                    key={m.id}
                    className={`p-6 rounded-2xl border transition-all ${
                      m.status === "COMPLETED"
                        ? "bg-emerald-950/10 border-emerald-500/30"
                        : m.status === "IN_PROGRESS"
                        ? "bg-cyber-900 border-cyan-500/40 shadow-glow-cyan/15"
                        : "bg-white/3 border-white/5"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-bold text-gray-500">
                            Sprint #{idx + 1}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.color}`}>
                            {badge.label}
                          </span>
                          {m.targetDate && (
                            <span className="text-xs text-gray-400 font-mono">
                              Due: {m.targetDate}
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg font-bold text-white">{m.title}</h4>
                        <p className="text-xs text-gray-300 leading-relaxed">{m.description}</p>

                        {/* Deliverables Checklist */}
                        {deliverablesList.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5 font-mono">
                              Deliverable Checklist:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {deliverablesList.map((del, dIdx) => (
                                <div
                                  key={dIdx}
                                  className="text-xs flex items-center gap-2 text-gray-300"
                                >
                                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                    m.status === "COMPLETED"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                      : "bg-white/5 text-gray-400 border border-white/10"
                                  }`}>
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                  <span className="line-clamp-1">{del}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Signed Off Banner if Completed */}
                        {m.signedOffByClient && (
                          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 font-medium">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>
                              <strong>Digitally Certified by:</strong> {m.signOffClientName || project.clientName} on {m.signOffDate ? new Date(m.signOffDate).toLocaleDateString() : "Verified"}
                              {m.signOffNotes ? ` — "${m.signOffNotes}"` : ""}
                            </span>
                          </div>
                        )}

                        {/* Invoice & Billing Section */}
                        {m.invoiceAmount && (
                          <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-gray-400">Milestone Fee:</span>
                              <span className="font-bold text-white font-mono">{m.invoiceAmount}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                m.invoiceStatus === "PAID"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}>
                                {m.invoiceStatus || "UNPAID"}
                              </span>
                            </div>

                            {m.invoiceStatus !== "PAID" && m.paymentLink && (
                              <a
                                href={m.paymentLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-bold transition-all shadow-glow-emerald/20"
                              >
                                Pay Invoice
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="shrink-0 flex items-center gap-2">
                        {m.status !== "COMPLETED" ? (
                          <button
                            onClick={() => {
                              soundFX.click();
                              setSelectedMilestone(m);
                              setClientSignName(project.clientName);
                            }}
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-extrabold flex items-center gap-1.5 shadow-glow-cyan/20 transition-all"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Sign Off Milestone</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Milestone Verified</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Milestone Digital Sign-Off Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl luxury-card border border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-black text-white">Digital Milestone Sign-Off</h4>
              </div>
              <button
                onClick={() => setSelectedMilestone(null)}
                className="text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {signSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2 text-emerald-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <div className="font-extrabold text-sm">{signSuccess}</div>
                <div className="text-xs text-emerald-400/80">
                  Audit trail recorded. Project progress updated.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignOffSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                  <div className="font-mono text-cyan-400 font-bold">
                    {project?.projectCode} — {selectedMilestone.title}
                  </div>
                  <div className="text-gray-300">{selectedMilestone.description}</div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1 font-mono">
                    Authorized Signer Name &amp; Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientSignName}
                    onChange={(e) => setClientSignName(e.target.value)}
                    placeholder="e.g. Alex Vance, VP Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1 font-mono">
                    Sign-off Notes / Feedback (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={signNotes}
                    onChange={(e) => setSignNotes(e.target.value)}
                    placeholder="All acceptance criteria met. Staging environment validated."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMilestone(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={signSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-black shadow-glow-cyan/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {signSubmitting ? "Submitting Signature..." : "Confirm & Sign Off Milestone"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
