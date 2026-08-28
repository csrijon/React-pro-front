"use client";

import { useState } from "react";
import {
  Users,
  Shield,
  UserPlus,
  Key,
  Lock,
  Check,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldAlert,
  Send,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Edit2
} from "lucide-react";
import { AdminUserData, AdminRole, AccessRequestData } from "@/types";
import {
  createAdminUser,
  updateAdminUserRole,
  deleteAdminUser,
  resetAdminUserPassword,
  updateAdminUserDetailsAction,
  createAccessRequest,
  reviewAccessRequest
} from "@/lib/actions";
import { soundFX } from "../CyberAudioFx";

interface TeamRbacManagerProps {
  users: AdminUserData[];
  accessRequests?: AccessRequestData[];
  currentUserId?: string;
  userRole?: string;
}

const roleDescriptions: Record<AdminRole, { title: string; desc: string; color: string }> = {
  SUPER_ADMIN: {
    title: "Super Admin",
    desc: "Complete studio authority: User management, security settings, organization config, and all portals.",
    color: "cyan",
  },
  SALES_LEAD: {
    title: "Sales & Client Lead",
    desc: "Access to CRM Inquiries inbox, proposal generation, multi-channel messaging, and client activity telemetry.",
    color: "emerald",
  },
  CONTENT_MANAGER: {
    title: "Content & SEO Manager",
    desc: "Publish and update services, case studies, engineering blogs, team profiles, and FAQs.",
    color: "purple",
  },
  TALENT_HR: {
    title: "Talent & HR Lead",
    desc: "Review incoming job applications, candidate resumes, and manage open career listings.",
    color: "amber",
  },
  SECURITY_AUDITOR: {
    title: "Security Auditor",
    desc: "Inspect cybersecurity threat logs, honeypot defusals, and firewall rate limit events.",
    color: "rose",
  },
};

export default function TeamRbacManager({
  users: initialUsers,
  accessRequests: initialRequests = [],
  currentUserId,
  userRole = "SUPER_ADMIN",
}: TeamRbacManagerProps) {
  const [users, setUsers] = useState<AdminUserData[]>(initialUsers);
  const [requests, setRequests] = useState<AccessRequestData[]>(initialRequests);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestRole, setRequestRole] = useState<AdminRole>("SUPER_ADMIN");
  const [requestReason, setRequestReason] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    fullName: "",
    role: "SALES_LEAD" as AdminRole,
    password: "",
  });
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [resetModalUserId, setResetModalUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [editingUser, setEditingUser] = useState<{
    id: string;
    fullName: string;
    username: string;
    role: AdminRole;
    isActive: boolean;
    newPassword?: string;
  } | null>(null);

  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const pendingRequests = requests.filter((r) => r.status === "PENDING");

  const handleUpdateUserDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await updateAdminUserDetailsAction({
        id: editingUser.id,
        fullName: editingUser.fullName,
        username: editingUser.username,
        role: editingUser.role,
        isActive: editingUser.isActive,
        newPassword: editingUser.newPassword,
      });

      if (res.success && res.user) {
        soundFX.success();
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? (res.user as unknown as AdminUserData) : u))
        );
        setEditingUser(null);
        setStatusMsg("Team member profile and credentials updated successfully.");
      } else {
        setErrorMsg(res.error || "Failed to update user.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setStatusMsg("");

    try {
      const res = await createAdminUser(newUser);
      if (res.success && res.user) {
        soundFX.success();
        setUsers((prev) => [...prev, res.user as unknown as AdminUserData]);
        setShowAddModal(false);
        setNewUser({ username: "", fullName: "", role: "SALES_LEAD", password: "" });
        setStatusMsg("New team member added successfully.");
      } else {
        setErrorMsg(res.error || "Failed to create user.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: AdminRole) => {
    soundFX.click();
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      await updateAdminUserRole(userId, newRole, targetUser.isActive);
    }
  };

  const handleToggleActive = async (userId: string) => {
    soundFX.click();
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    const newStatus = !targetUser.isActive;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: newStatus } : u))
    );
    await updateAdminUserRole(userId, targetUser.role, newStatus);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to revoke and delete this team user's access?")) return;
    soundFX.click();
    const res = await deleteAdminUser(userId);
    if (res.success) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setStatusMsg("User access revoked.");
    } else {
      setErrorMsg(res.error || "Could not delete user.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUserId) return;
    setIsSubmitting(true);
    const res = await resetAdminUserPassword(resetModalUserId, newPassword);
    if (res.success) {
      soundFX.success();
      setResetModalUserId(null);
      setNewPassword("");
      setStatusMsg("Password updated successfully.");
    } else {
      setErrorMsg(res.error || "Failed to reset password.");
    }
    setIsSubmitting(false);
  };

  const handleSendAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createAccessRequest(requestRole, requestReason);
    if (res.success && res.request) {
      soundFX.success();
      setRequests((prev) => [res.request as unknown as AccessRequestData, ...prev]);
      setShowRequestModal(false);
      setRequestReason("");
      setStatusMsg("Access request submitted to Super Admin.");
    } else {
      setErrorMsg("Failed to submit access request.");
    }
    setIsSubmitting(false);
  };

  const handleReviewRequest = async (requestId: string, status: "APPROVED" | "REJECTED") => {
    soundFX.click();
    const res = await reviewAccessRequest(requestId, status);
    if (res.success) {
      soundFX.success();
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r))
      );
      if (status === "APPROVED") {
        const req = requests.find((r) => r.id === requestId);
        if (req) {
          setUsers((prev) =>
            prev.map((u) => (u.id === req.userId ? { ...u, role: req.requestedRole as AdminRole } : u))
          );
        }
      }
      setStatusMsg(`Access request ${status.toLowerCase()}.`);
    } else {
      setErrorMsg(res.error || "Action failed.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Team Access &amp; RBAC Console</h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {users.length} Team Accounts
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Assign role-based permissions or review access upgrade requests across your studio team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                soundFX.click();
                setShowRequestModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Role Upgrade</span>
            </button>
          )}

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                soundFX.click();
                setShowAddModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Pending Access Requests for Super Admin */}
      {isSuperAdmin && pendingRequests.length > 0 && (
        <div className="p-6 rounded-3xl glass-dropdown border border-purple-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>Pending Role Upgrade Requests ({pendingRequests.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
              Super Admin Review Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">@{req.username}</span>
                    <span className="text-gray-400 text-[11px] block">
                      Current: {req.currentRole} ➔ Requested: <strong className="text-cyan-400">{req.requestedRole}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-300 text-[11px] bg-white/5 p-2.5 rounded-lg border border-white/5">
                  &ldquo;{req.reason}&rdquo;
                </p>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleReviewRequest(req.id, "REJECTED")}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReviewRequest(req.id, "APPROVED")}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-bold shadow-md shadow-emerald-500/20"
                  >
                    Grant {req.requestedRole}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role Explanations Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(Object.keys(roleDescriptions) as AdminRole[]).map((r) => {
          const info = roleDescriptions[r];
          return (
            <div key={r} className="p-4 rounded-2xl glass-panel border border-white/5 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 font-bold text-white">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>{info.title}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">{info.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Team Members Table */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-6 font-semibold">User / Identity</th>
                <th className="py-3.5 px-6 font-semibold">Assigned Role (RBAC)</th>
                <th className="py-3.5 px-6 font-semibold">Account Status</th>
                <th className="py-3.5 px-6 font-semibold">Last Login</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-sm">{u.fullName}</div>
                    <div className="text-[11px] text-gray-400 font-mono">@{u.username}</div>
                  </td>

                  <td className="py-4 px-6">
                    {isSuperAdmin ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as AdminRole)}
                        className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-semibold focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                        <option value="SALES_LEAD">Sales &amp; Client Lead</option>
                        <option value="CONTENT_MANAGER">Content &amp; SEO Manager</option>
                        <option value="TALENT_HR">Talent &amp; HR Lead</option>
                        <option value="SECURITY_AUDITOR">Security Auditor</option>
                      </select>
                    ) : (
                      <span className="font-mono text-cyan-400 font-bold">{u.role}</span>
                    )}
                  </td>

                  <td className="py-4 px-6">
                    <button
                      type="button"
                      disabled={!isSuperAdmin}
                      onClick={() => handleToggleActive(u.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        u.isActive
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-400" : "bg-rose-400"}`} />
                      <span>{u.isActive ? "Active" : "Deactivated"}</span>
                    </button>
                  </td>

                  <td className="py-4 px-6 font-mono text-[11px] text-gray-400">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "Never logged in"}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            soundFX.click();
                            setEditingUser({
                              id: u.id,
                              fullName: u.fullName,
                              username: u.username,
                              role: u.role,
                              isActive: u.isActive,
                              newPassword: "",
                            });
                          }}
                          className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          title="Edit Details & Credentials"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isSuperAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            soundFX.click();
                            setResetModalUserId(u.id);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                          title="Quick Reset Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {isSuperAdmin && u.id !== currentUserId && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                          title="Revoke User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Access Upgrade Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl glass-dropdown border border-purple-500/30 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" />
                <span>Request Elevated Role Access</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendAccessRequest} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Requested Role *</label>
                <select
                  value={requestRole}
                  onChange={(e) => setRequestRole(e.target.value as AdminRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-900 border border-white/10 text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="CONTENT_MANAGER">Content &amp; SEO Manager</option>
                  <option value="SALES_LEAD">Sales &amp; Client Lead</option>
                  <option value="TALENT_HR">Talent &amp; HR Lead</option>
                  <option value="SECURITY_AUDITOR">Security Auditor</option>
                  <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Justification / Reason *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain why you need access to this section..."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-purple-400 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold"
                >
                  {isSubmitting ? "Submitting..." : "Submit to Super Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl glass-dropdown border border-cyan-500/30 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Add Team Member</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Username * (Alphanumeric)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. alex_sales"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Role (RBAC Permissions) *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminRole })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-900 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="SALES_LEAD">Sales &amp; Client Lead (CRM &amp; Proposals)</option>
                  <option value="CONTENT_MANAGER">Content &amp; SEO Manager</option>
                  <option value="TALENT_HR">Talent &amp; HR Lead (Careers &amp; Resumes)</option>
                  <option value="SECURITY_AUDITOR">Security Auditor (Threat Logs)</option>
                  <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Initial Password * (Min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs shadow-lg shadow-cyan-500/25"
                >
                  {isSubmitting ? "Creating..." : "Save Team Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {resetModalUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl glass-dropdown border border-cyan-500/30 p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <span>Reset User Password</span>
            </h3>

            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">New Password (Min 8 chars)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetModalUserId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold"
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Super Admin: Edit Team Member Details & Master Credentials Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl glass-dropdown border border-cyan-500/30 p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-cyan-400" />
                <span>Super Admin: Edit Member &amp; Credentials</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateUserDetails} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={editingUser.fullName}
                    onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">System Username *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-500 font-mono">@</span>
                    <input
                      type="text"
                      required
                      value={editingUser.username}
                      onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Assigned Role (RBAC) *</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as AdminRole })}
                    className="w-full px-3.5 py-2 rounded-xl bg-cyber-900 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="SUPER_ADMIN">Super Admin (Full Authority)</option>
                    <option value="SALES_LEAD">Sales &amp; Client Lead</option>
                    <option value="CONTENT_MANAGER">Content &amp; SEO Manager</option>
                    <option value="TALENT_HR">Talent &amp; HR Lead</option>
                    <option value="SECURITY_AUDITOR">Security Auditor</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-semibold block mb-1">Account Access Status</label>
                  <select
                    value={editingUser.isActive ? "active" : "disabled"}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === "active" })}
                    className="w-full px-3.5 py-2 rounded-xl bg-cyber-900 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="active">Active (Access Granted)</option>
                    <option value="disabled">Deactivated / Locked Out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  Change / Override Password (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  placeholder="Enter new 8+ character password to override"
                  value={editingUser.newPassword || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, newPassword: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold shadow-lg shadow-cyan-500/25"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
