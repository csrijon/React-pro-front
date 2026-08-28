"use client";

import { useState, useRef } from "react";
import { BlogPostData } from "@/types";
import { BookOpen, Plus, Edit2, Trash2, X, Upload, Clock, Tag } from "lucide-react";
import { upsertBlogPost, deleteBlogPost } from "@/lib/actions";

interface BlogManagerProps {
  initialBlogs: BlogPostData[];
}

export default function BlogManager({ initialBlogs }: BlogManagerProps) {
  const [blogs, setBlogs] = useState<BlogPostData[]>(initialBlogs);
  const [isEditing, setIsEditing] = useState(false);
  const [activePost, setActivePost] = useState<Partial<BlogPostData>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    authorName: "HP Edit Engineering Team",
    authorRole: "Principal Software Architect",
    tags: "[]",
    readTime: "5 min read",
    published: true,
  });
  const [tagsInput, setTagsInput] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Please upload a cover image smaller than 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setActivePost((prev) => ({ ...prev, coverImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (post: BlogPostData) => {
    setActivePost(post);
    try {
      const parsed = JSON.parse(post.tags);
      setTagsInput(Array.isArray(parsed) ? parsed.join(", ") : "");
    } catch {
      setTagsInput(post.tags);
    }
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setActivePost({
      title: "",
      slug: "",
      excerpt: "",
      content: "## Overview\n\nExplain technical solution here...",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
      authorName: "HP Edit Engineering Team",
      authorRole: "Principal Architect",
      tags: "[]",
      readTime: "5 min read",
      published: true,
      order: blogs.length + 1,
    });
    setTagsInput("AI Agents, Next.js 15, Enterprise Architecture");
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await deleteBlogPost(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch {
      alert("Failed to delete blog post.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagsArray = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload: Partial<BlogPostData> = {
        ...activePost,
        slug: activePost.slug || activePost.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        tags: JSON.stringify(tagsArray),
      };

      await upsertBlogPost(payload);
      setIsEditing(false);
      window.location.reload();
    } catch {
      alert("Failed to save blog post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Tech Blog &amp; Insights Engine</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Publish engineering articles, research breakthroughs, and technical guides.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl glass-panel p-5 border border-white/10 flex flex-col justify-between"
          >
            <div>
              {b.coverImage && (
                <div className="w-full h-32 rounded-xl overflow-hidden mb-3 bg-cyber-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className="font-bold text-sm text-white line-clamp-2">{b.title}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{b.excerpt}</p>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-cyan-400 font-mono">
                <span>{b.readTime}</span>
                <span>•</span>
                <span>{b.authorName}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-500">/{b.slug}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEdit(b)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
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
          <div className="relative w-full max-w-2xl rounded-2xl glass-dropdown border border-cyan-500/30 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-bold text-base text-white">
                {activePost.id ? "Edit Article" : "Write New Article"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              {/* Cover Image Upload */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <label className="text-xs font-semibold text-gray-300 block">Cover Image</label>
                <div className="flex items-center gap-3">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <input
                    type="url"
                    value={activePost.coverImage || ""}
                    onChange={(e) => setActivePost({ ...activePost, coverImage: e.target.value })}
                    placeholder="Or enter Image URL"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={activePost.title || ""}
                    onChange={(e) => setActivePost({ ...activePost, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={activePost.slug || ""}
                    onChange={(e) => setActivePost({ ...activePost, slug: e.target.value })}
                    placeholder="e.g. how-we-scaled-ai-agents"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Summary / Excerpt *</label>
                <textarea
                  required
                  rows={2}
                  value={activePost.excerpt || ""}
                  onChange={(e) => setActivePost({ ...activePost, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Full Article Content (Markdown) *</label>
                <textarea
                  required
                  rows={8}
                  value={activePost.content || ""}
                  onChange={(e) => setActivePost({ ...activePost, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none font-mono leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={activePost.authorName || ""}
                    onChange={(e) => setActivePost({ ...activePost, authorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Author Role</label>
                  <input
                    type="text"
                    value={activePost.authorRole || ""}
                    onChange={(e) => setActivePost({ ...activePost, authorRole: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Reading Time</label>
                  <input
                    type="text"
                    value={activePost.readTime || ""}
                    onChange={(e) => setActivePost({ ...activePost, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="AI Agents, Next.js 15, Python"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none font-mono"
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
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25"
                >
                  {saving ? "Publishing..." : "Save Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
