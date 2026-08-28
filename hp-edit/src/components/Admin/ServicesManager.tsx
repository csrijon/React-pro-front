"use client";

import React, { useState } from "react";
import { ServiceData } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Layers,
  Sparkles,
  X,
  Globe,
  GripVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Smartphone,
  Cpu,
  Zap,
  MessageSquare,
  TrendingUp,
  Monitor,
  Server
} from "lucide-react";
import {
  upsertService,
  deleteService,
  reorderServicesAction,
  toggleServiceVisibilityAction
} from "@/lib/actions";
import { soundFX } from "../CyberAudioFx";

interface ServicesManagerProps {
  initialServices: ServiceData[];
}

export default function ServicesManager({ initialServices }: ServicesManagerProps) {
  const [services, setServices] = useState<ServiceData[]>(() =>
    [...initialServices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  );
  const [isEditing, setIsEditing] = useState(false);
  const [activeItem, setActiveItem] = useState<Partial<ServiceData>>({
    title: "",
    slug: "",
    category: "Web & Cloud",
    icon: "Globe",
    shortDescription: "",
    fullDescription: "",
    features: "[]",
    order: 0,
    isFeatured: true,
    isActive: true,
  });
  const [featuresInput, setFeaturesInput] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [error, setError] = useState("");

  // Drag-and-drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(""), 2500);
  };

  const handleEdit = (service: ServiceData) => {
    soundFX.click();
    setActiveItem({
      ...service,
      isActive: service.isActive !== false,
    });
    try {
      const parsed = JSON.parse(service.features);
      setFeaturesInput(Array.isArray(parsed) ? parsed.join("\n") : "");
    } catch {
      setFeaturesInput(service.features);
    }
    setIsEditing(true);
  };

  const handleAddNew = () => {
    soundFX.click();
    setActiveItem({
      title: "",
      slug: "",
      category: "Web & Cloud",
      icon: "Globe",
      shortDescription: "",
      fullDescription: "",
      features: "[]",
      order: services.length + 1,
      isFeatured: true,
      isActive: true,
    });
    setFeaturesInput("");
    setIsEditing(true);
  };

  const handleDelete = async (id: string, title: string) => {
    soundFX.click();
    if (!confirm(`Are you sure you want to delete '${title}'?`)) return;
    try {
      await deleteService(id);
      soundFX.success();
      setServices((prev) => prev.filter((s) => s.id !== id));
      showNotification(`Deleted '${title}'`);
    } catch {
      soundFX.error();
      alert("Failed to delete service.");
    }
  };

  const handleToggleVisibility = async (service: ServiceData) => {
    soundFX.click();
    const newStatus = service.isActive === false ? true : false;

    // Optimistic UI update
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, isActive: newStatus } : s))
    );

    try {
      await toggleServiceVisibilityAction(service.id, newStatus);
      soundFX.success();
      showNotification(
        newStatus
          ? `✓ '${service.title}' is now Published (Visible on site)`
          : `⚡ '${service.title}' is now Hidden from website`
      );
    } catch (err) {
      soundFX.error();
      // Revert
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: service.isActive } : s))
      );
      alert("Failed to update visibility.");
    }
  };

  const persistReorder = async (updatedList: ServiceData[]) => {
    setReordering(true);
    const orderedIds = updatedList.map((s) => s.id);
    try {
      await reorderServicesAction(orderedIds);
      soundFX.success();
      showNotification("✓ Service order saved & updated live across website!");
    } catch (err) {
      soundFX.error();
      console.error("Reorder error:", err);
      alert("Failed to save reordered services.");
    } finally {
      setReordering(false);
    }
  };

  const handleMove = (index: number, direction: "UP" | "DOWN") => {
    soundFX.click();
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const updated = [...services];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, movedItem);

    // Re-assign order numbers
    const reindexed = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setServices(reindexed);
    persistReorder(reindexed);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    soundFX.click();
    const updated = [...services];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);

    const reindexed = updated.map((item, idx) => ({ ...item, order: idx + 1 }));
    setServices(reindexed);
    setDraggedIndex(null);
    setDragOverIndex(null);
    persistReorder(reindexed);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.click();
    setSaving(true);
    setError("");

    try {
      const featuresArray = featuresInput
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload: Partial<ServiceData> = {
        ...activeItem,
        slug: activeItem.slug || activeItem.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        features: JSON.stringify(featuresArray),
        isActive: activeItem.isActive !== false,
      };

      await upsertService(payload);
      soundFX.success();
      setIsEditing(false);
      showNotification("✓ Service saved successfully!");
      window.location.reload();
    } catch {
      soundFX.error();
      setError("Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Smartphone":
        return Smartphone;
      case "Cpu":
        return Cpu;
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
      default:
        return Globe;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Service Capabilities &amp; Navigation Matrix</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Total {services.length} services ({services.filter((s) => s.isActive !== false).length} published, {services.filter((s) => s.isActive === false).length} hidden). Drag cards or use arrows to reorder.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {feedbackMsg && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          <button
            onClick={handleAddNew}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan/20 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>
      </div>

      {/* Reordering helper banner */}
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Drag &amp; Move Enabled:</strong> Grab the handle or click arrows to rearrange order. Changes update live in the Navigation Dropdown, Homepage Bento, and Services Catalog.
          </span>
        </div>
        {reordering && (
          <span className="text-[11px] font-mono text-cyan-400 animate-pulse font-bold">
            Saving order...
          </span>
        )}
      </div>

      {/* Grid of existing services with Drag & Drop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, idx) => {
          const Icon = getCategoryIcon(s.icon);
          const isHidden = s.isActive === false;
          const isDraggingThis = draggedIndex === idx;
          const isDragOverThis = dragOverIndex === idx;

          return (
            <div
              key={s.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              className={`rounded-2xl luxury-card p-5 border transition-all duration-200 flex flex-col justify-between relative group select-none ${
                isDraggingThis
                  ? "opacity-30 border-cyan-500 scale-95"
                  : isDragOverThis
                  ? "border-cyan-400 bg-cyan-500/10 shadow-glow-cyan/25 scale-[1.02]"
                  : isHidden
                  ? "border-white/5 bg-cyber-950/60 opacity-60"
                  : "border-white/10 hover:border-cyan-500/40"
              }`}
            >
              <div>
                {/* Card Top Strip: Drag Handle, Category Badge, Order Steppers */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1 rounded bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white cursor-grab active:cursor-grabbing transition-colors"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                      #{idx + 1}
                    </span>

                    <span className="text-[10px] font-bold text-gray-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {s.category}
                    </span>
                  </div>

                  {/* Move Up / Down Arrow Steppers */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "UP")}
                      className={`p-1 rounded ${
                        idx === 0
                          ? "text-gray-700 cursor-not-allowed"
                          : "text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === services.length - 1}
                      onClick={() => handleMove(idx, "DOWN")}
                      className={`p-1 rounded ${
                        idx === services.length - 1
                          ? "text-gray-700 cursor-not-allowed"
                          : "text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Service Title & Icon */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-snug">{s.title}</h3>
                    <span className="text-[10px] font-mono text-gray-400">/services/{s.slug}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2 mt-1">
                  {s.shortDescription}
                </p>

                {/* Hidden Alert Pill */}
                {isHidden && (
                  <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold inline-flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    <span>HIDDEN FROM PUBLIC WEBSITE</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions: Visibility Toggle, Edit, Delete */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                {/* 1-Click Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(s)}
                  className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                    !isHidden
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                  title={!isHidden ? "Click to hide from website" : "Click to publish on website"}
                >
                  {!isHidden ? (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(s)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-300 transition-colors"
                    title="Edit details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id, s.title)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                    title="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl glass-dropdown border border-cyan-500/30 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>{activeItem.id ? "Edit Service Offering" : "Create New Service Offering"}</span>
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="my-3 p-3 rounded-xl bg-rose-500/10 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={activeItem.title || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Slug (URL key)</label>
                  <input
                    type="text"
                    value={activeItem.slug || ""}
                    onChange={(e) => setActiveItem({ ...activeItem, slug: e.target.value })}
                    placeholder="e.g. web-development"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Category</label>
                  <select
                    value={activeItem.category || "Web & Cloud"}
                    onChange={(e) => setActiveItem({ ...activeItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-cyber-900 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Web & Cloud">Web &amp; Cloud</option>
                    <option value="Mobile">Mobile</option>
                    <option value="AI & Intelligence">AI &amp; Intelligence</option>
                    <option value="Enterprise Automation">Enterprise Automation</option>
                    <option value="Messaging & Conversions">Messaging &amp; Conversions</option>
                    <option value="Growth & Marketing">Growth &amp; Marketing</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="IT & Infrastructure">IT &amp; Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Icon Name</label>
                  <select
                    value={activeItem.icon || "Globe"}
                    onChange={(e) => setActiveItem({ ...activeItem, icon: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-cyber-900 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Globe">Globe (Web)</option>
                    <option value="Smartphone">Smartphone (Mobile)</option>
                    <option value="Cpu">Cpu (AI Agents)</option>
                    <option value="Zap">Zap (Automation)</option>
                    <option value="MessageSquare">MessageSquare (WhatsApp)</option>
                    <option value="TrendingUp">TrendingUp (Marketing)</option>
                    <option value="Monitor">Monitor (Desktop Software)</option>
                    <option value="Server">Server (Cloud / IT)</option>
                  </select>
                </div>
              </div>

              {/* Toggles: Visible on Website & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={activeItem.isActive !== false}
                    onChange={(e) => setActiveItem({ ...activeItem, isActive: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                  <span>
                    <strong>Visible on Website</strong>
                    <span className="block text-[10px] text-gray-400">
                      Show in navigation dropdown &amp; catalog
                    </span>
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input
                    type="checkbox"
                    checked={activeItem.isFeatured !== false}
                    onChange={(e) => setActiveItem({ ...activeItem, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                  <span>
                    <strong>Featured Highlight</strong>
                    <span className="block text-[10px] text-gray-400">
                      Highlight in core capabilities
                    </span>
                  </span>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Short Summary (Card Preview) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={activeItem.shortDescription || ""}
                  onChange={(e) => setActiveItem({ ...activeItem, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Full Technical Description (Modal / Page)
                </label>
                <textarea
                  rows={3}
                  value={activeItem.fullDescription || ""}
                  onChange={(e) => setActiveItem({ ...activeItem, fullDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Deliverables / Features List (One item per line)
                </label>
                <textarea
                  rows={4}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
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
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan/25"
                >
                  {saving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
