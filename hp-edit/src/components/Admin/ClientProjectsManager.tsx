"use client";

import { useState } from "react";
import {
  Layers,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  Building,
  User,
  Mail,
  Edit2,
  Check,
  X,
  FileCheck,
  Sparkles
} from "lucide-react";
import { ClientProjectData, ProjectMilestoneData } from "@/types";
import {
  createClientProjectAction,
  updateClientProjectAction,
  deleteClientProjectAction,
  addProjectMilestoneAction,
  deleteProjectMilestoneAction
} from "@/lib/actions";
import { soundFX } from "../CyberAudioFx";
import Link from "next/link";

interface ClientProjectsManagerProps {
  initialProjects?: ClientProjectData[];
}

export default function ClientProjectsManager({
  initialProjects = [],
}: ClientProjectsManagerProps) {
  const [projects, setProjects] = useState<ClientProjectData[]>(initialProjects);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProjectData | null>(null);
  const [addingMilestoneProjectId, setAddingMilestoneProjectId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundFX.click();
    setLoading(true);
    setStatusMessage("");

    try {
      const formData = new FormData(e.currentTarget);
      const res = await createClientProjectAction(formData);
      if (res.success) {
        soundFX.success();
        setStatusMessage("Client Project created successfully!");
        setIsCreating(false);
        window.location.reload();
      }
    } catch {
      setStatusMessage("Failed to create client project.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundFX.click();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await updateClientProjectAction(formData);
      if (res.success) {
        soundFX.success();
        setStatusMessage("Project updated successfully!");
        setEditingProject(null);
        window.location.reload();
      }
    } catch {
      setStatusMessage("Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete Project ${code}?`)) return;
    soundFX.click();
    await deleteClientProjectAction(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddMilestone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundFX.click();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await addProjectMilestoneAction(formData);
      if (res.success) {
        soundFX.success();
        setAddingMilestoneProjectId(null);
        window.location.reload();
      }
    } catch {
      alert("Failed to add milestone.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;
    soundFX.click();
    await deleteProjectMilestoneAction(milestoneId);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl luxury-card border border-cyan-500/20">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Client Sprints &amp; Project Portals</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage client milestone portals accessible via <Link href="/portal" target="_blank" className="text-cyan-400 hover:underline">/portal</Link> with secure reference codes.
          </p>
        </div>

        <button
          onClick={() => {
            soundFX.click();
            setIsCreating(!isCreating);
          }}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-black flex items-center gap-2 transition-all shadow-glow-cyan/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Client Project</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
          {statusMessage}
        </div>
      )}

      {/* Create Project Modal / Form */}
      {isCreating && (
        <form onSubmit={handleCreateProject} className="p-6 rounded-2xl bg-cyber-900 border border-cyan-500/30 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white">Create New Client Project Portal</h3>
            <button type="button" onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white text-xs">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Project Code (e.g. HPE-9021)</label>
              <input
                type="text"
                name="projectCode"
                defaultValue={"HPE-" + Math.floor(1000 + Math.random() * 9000)}
                required
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Project Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. ApexFlow Real-Time Logistics OS"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Client Name</label>
              <input
                type="text"
                name="clientName"
                placeholder="e.g. Sarah Jenkins"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Client Email</label>
              <input
                type="email"
                name="clientEmail"
                placeholder="e.g. sarah@apexlogistics.io"
                required
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Client Company</label>
              <input
                type="text"
                name="clientCompany"
                placeholder="e.g. ApexLogistics Global"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Tier</label>
              <select
                name="tier"
                className="w-full px-3 py-2 rounded-xl bg-cyber-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="Enterprise Sprint">Enterprise Sprint</option>
                <option value="Growth Scale Platform">Growth Scale Platform</option>
                <option value="0-to-1 Rapid MVP">0-to-1 Rapid MVP</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Live Staging URL</label>
              <input
                type="url"
                name="stagingUrl"
                placeholder="https://staging-project.hpedit.com"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Target Delivery</label>
              <input
                type="text"
                name="targetDelivery"
                placeholder="e.g. 2026-10-15"
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Description &amp; Architectural Scope</label>
            <textarea
              name="description"
              rows={3}
              placeholder="High-level description of client project deliverables..."
              required
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 text-xs font-black disabled:opacity-50"
            >
              {loading ? "Creating..." : "Save Project"}
            </button>
          </div>
        </form>
      )}

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-6">
        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/3 border border-white/5 text-gray-400 text-xs">
            No client projects found. Click &quot;New Client Project&quot; above to create one.
          </div>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="p-6 rounded-2xl bg-cyber-900 border border-white/10 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                      {p.projectCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold">
                      {p.tier}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      Client: {p.clientName} ({p.clientEmail})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{p.title}</h3>
                  <p className="text-xs text-gray-300">{p.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/portal"
                    target="_blank"
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 text-xs font-bold flex items-center gap-1.5 border border-white/10"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View /portal</span>
                  </Link>

                  <button
                    onClick={() => setAddingMilestoneProjectId(p.id)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1 border border-cyan-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Milestone</span>
                  </button>

                  <button
                    onClick={() => handleDeleteProject(p.id, p.projectCode)}
                    className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Milestones Sub-List */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                  Milestones ({p.milestones?.length || 0})
                </div>

                {p.milestones && p.milestones.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {p.milestones.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          m.status === "COMPLETED"
                            ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                            : "bg-white/3 border-white/5 text-gray-300"
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-bold truncate">{m.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono">
                            Status: {m.status} {m.signedOffByClient ? "✓ Signed Off" : ""}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteMilestone(m.id)}
                          className="text-gray-500 hover:text-rose-400 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">No milestones configured yet.</div>
                )}
              </div>

              {/* Add Milestone Inline Form */}
              {addingMilestoneProjectId === p.id && (
                <form onSubmit={handleAddMilestone} className="p-4 rounded-xl bg-cyber-950 border border-cyan-500/30 space-y-3 mt-3">
                  <input type="hidden" name="projectId" value={p.id} />
                  <div className="font-bold text-xs text-cyan-400">Add Milestone to {p.projectCode}</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="title"
                      placeholder="Milestone Title (e.g. Sprint 2: RAG Pipeline)"
                      required
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      name="targetDate"
                      placeholder="Target Date (e.g. 2026-09-01)"
                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    name="deliverables"
                    placeholder="Deliverables checklist (comma separated, e.g. API Docs, Vector Store, Staging)"
                    required
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />

                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Milestone description..."
                    required
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none resize-none"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingMilestoneProjectId(null)}
                      className="px-3 py-1 text-xs text-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-1.5 rounded-lg bg-cyan-500 text-gray-950 font-bold text-xs"
                    >
                      Save Milestone
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
