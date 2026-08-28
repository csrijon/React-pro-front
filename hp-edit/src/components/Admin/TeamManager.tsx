"use client";

import { useState, useRef } from "react";
import { TeamMemberData } from "@/types";
import { Users, Plus, Edit2, Trash2, X, Upload, Mail, Phone } from "lucide-react";
import { upsertTeamMember, deleteTeamMember } from "@/lib/actions";

interface TeamManagerProps {
  initialTeam: TeamMemberData[];
}

export default function TeamManager({ initialTeam }: TeamManagerProps) {
  const [team, setTeam] = useState<TeamMemberData[]>(initialTeam);
  const [isEditing, setIsEditing] = useState(false);
  const [activeMember, setActiveMember] = useState<Partial<TeamMemberData>>({
    name: "",
    designation: "",
    bio: "",
    photoUrl: "",
    email: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    order: 0,
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert("Please upload a photo smaller than 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setActiveMember((prev) => ({ ...prev, photoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (member: TeamMemberData) => {
    setActiveMember(member);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setActiveMember({
      name: "",
      designation: "",
      bio: "",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      email: "",
      phone: "",
      linkedinUrl: "",
      githubUrl: "",
      twitterUrl: "",
      order: team.length + 1,
      active: true,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    try {
      await deleteTeamMember(id);
      setTeam((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Failed to delete team member.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await upsertTeamMember(activeMember);
      setIsEditing(false);
      window.location.reload();
    } catch {
      alert("Failed to save team member.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Team Members &amp; Leadership</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your core engineers, leadership bios, photos, and direct links.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {team.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl glass-panel p-5 border border-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-cyber-950 border border-white/10">
                {member.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Users className="w-8 h-8" />
                  </div>
                )}
              </div>

              <h3 className="font-bold text-sm text-white">{member.name}</h3>
              <div className="text-xs text-purple-400 font-semibold">{member.designation}</div>
              <p className="text-xs text-gray-400 mt-2 line-clamp-2">{member.bio}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono">Order: {member.order}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl glass-dropdown border border-purple-500/30 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-bold text-base text-white">
                {activeMember.id ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              {/* Photo Upload Row */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-cyber-900 border border-white/10 shrink-0">
                  {activeMember.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeMember.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Users className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={activeMember.photoUrl || ""}
                    onChange={(e) => setActiveMember({ ...activeMember, photoUrl: e.target.value })}
                    placeholder="Or enter Image URL"
                    className="w-full px-2.5 py-1 rounded bg-black/40 border border-white/10 text-white text-[11px] font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={activeMember.name || ""}
                    onChange={(e) => setActiveMember({ ...activeMember, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    value={activeMember.designation || ""}
                    onChange={(e) => setActiveMember({ ...activeMember, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Short Bio *</label>
                <textarea
                  required
                  rows={2}
                  value={activeMember.bio || ""}
                  onChange={(e) => setActiveMember({ ...activeMember, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Email</label>
                  <input
                    type="email"
                    value={activeMember.email || ""}
                    onChange={(e) => setActiveMember({ ...activeMember, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={activeMember.phone || ""}
                    onChange={(e) => setActiveMember({ ...activeMember, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={activeMember.linkedinUrl || ""}
                    onChange={(e) => setActiveMember({ ...activeMember, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={activeMember.githubUrl || ""}
                    onChange={(e) => setActiveMember({ ...activeMember, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Twitter URL</label>
                  <input
                    type="url"
                    value={activeMember.twitterUrl || ""}
                    onChange={(e) => setActiveMember({ ...activeMember, twitterUrl: e.target.value })}
                    placeholder="https://x.com/..."
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
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
                  className="px-6 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/25"
                >
                  {saving ? "Saving..." : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
