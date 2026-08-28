"use client";

import { useState } from "react";
import { FaqData } from "@/types";
import { HelpCircle, Plus, Edit2, Trash2, X } from "lucide-react";
import { upsertFaq, deleteFaq } from "@/lib/actions";

interface FaqManagerProps {
  initialFaqs: FaqData[];
}

export default function FaqManager({ initialFaqs }: FaqManagerProps) {
  const [faqs, setFaqs] = useState<FaqData[]>(initialFaqs);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFaq, setActiveFaq] = useState<Partial<FaqData>>({
    question: "",
    answer: "",
    category: "General",
    order: 0,
  });
  const [saving, setSaving] = useState(false);

  const handleEdit = (faq: FaqData) => {
    setActiveFaq(faq);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setActiveFaq({
      question: "",
      answer: "",
      category: "General",
      order: faqs.length + 1,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteFaq(id);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch {
      alert("Failed to delete FAQ.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await upsertFaq(activeFaq);
      setIsEditing(false);
      window.location.reload();
    } catch {
      alert("Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Frequently Asked Questions Manager</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage objections, process timelines, and client answers displayed on the homepage.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((f) => (
          <div
            key={f.id}
            className="p-5 rounded-xl glass-panel border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {f.category}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">Order: {f.order}</span>
              </div>
              <h3 className="font-bold text-sm text-white">{f.question}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{f.answer}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleEdit(f)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-amber-500/20 text-gray-400 hover:text-amber-400 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(f.id)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl glass-dropdown border border-amber-500/30 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-bold text-base text-white">
                {activeFaq.id ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Category</label>
                <input
                  type="text"
                  value={activeFaq.category || ""}
                  onChange={(e) => setActiveFaq({ ...activeFaq, category: e.target.value })}
                  placeholder="e.g. Process, Legal, WhatsApp, Pricing"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={activeFaq.question || ""}
                  onChange={(e) => setActiveFaq({ ...activeFaq, question: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Answer *</label>
                <textarea
                  required
                  rows={4}
                  value={activeFaq.answer || ""}
                  onChange={(e) => setActiveFaq({ ...activeFaq, answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
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
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25"
                >
                  {saving ? "Saving..." : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
