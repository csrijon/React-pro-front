"use client";

import { useState } from "react";
import { ProjectData } from "@/types";
import { Plus, Edit2, Trash2, Award, X, Sparkles } from "lucide-react";
import { upsertProject, deleteProject } from "@/lib/actions";

interface ProjectsManagerProps {
  initialProjects: ProjectData[];
}

export default function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [isEditing, setIsEditing] = useState(false);
  const [activeItem, setActiveItem] = useState<Partial<ProjectData>>({
    title: "",
    client: "",
    category: "AI Agents & Automation",
    description: "",
    metrics: "",
    techStack: "[]",
    demoUrl: "",
    featured: true,
    order: 0,
  });
  const [techStackInput, setTechStackInput] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleEdit = (project: ProjectData) => {
    setActiveItem(project);
    try {
      const parsed = JSON.parse(project.techStack);
      setTechStackInput(Array.isArray(parsed) ? parsed.join(", ") : "");
    } catch {
      setTechStackInput(project.techStack);
    }
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setActiveItem({
      title: "",
      client: "",
      category: "Web & Cloud Platform",
      description: "",
      metrics: "+250% Growth | <50ms Latency",
      techStack: "[]",
      demoUrl: "",
      featured: true,
      order: projects.length + 1,
    });
    setTechStackInput("Next.js 15, React 19, TypeScript, PostgreSQL");
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study project?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete project.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const techArray = techStackInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload: Partial<ProjectData> = {
        ...activeItem,
        techStack: JSON.stringify(techArray),
      };

      await upsertProject(payload);
      setIsEditing(false);
      window.location.reload();
    } catch {
      alert("Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Showcase Projects &amp; Case Studies</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage verified client success stories and impact metrics.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Case Study</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="rounded-xl glass-panel p-5 border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {p.category}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">{p.client}</span>
              </div>
              <h3 className="font-bold text-sm text-white">{p.title}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>
              <div className="mt-3 text-xs font-semibold text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-500/20">
                {p.metrics}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono">Order: {p.order}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEdit(p)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl glass-dropdown border border-emerald-500/30 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-bold text-base text-white">
                {activeItem.id ? "Edit Case Study" : "Add New Case Study"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={activeItem.title || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Client Name / Industry</label>
                  <input
                    type="text"
                    required
                    value={activeItem.client || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, client: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={activeItem.category || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Impact Metric Highlight *</label>
                  <input
                    type="text"
                    required
                    value={activeItem.metrics || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, metrics: e.target.value })}
                    placeholder="e.g. 94% manual effort reduction | <2s response"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={activeItem.description || ""}
                  onChange={(e) => setActiveItem({ ...activeItem, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Tech Stack Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="Next.js 15, Python, LangChain, WhatsApp Cloud API"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-400 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/25"
                >
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
