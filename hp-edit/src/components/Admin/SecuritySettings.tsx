"use client";

import { useState } from "react";
import { Lock, ShieldCheck, CheckCircle2, Key, Link as LinkIcon, Copy, AlertTriangle } from "lucide-react";
import { updateAdminPassword, updateAdminPortalSlug } from "@/lib/actions";
import { OrganizationData } from "@/types";

interface SecuritySettingsProps {
  organization?: OrganizationData;
}

export default function SecuritySettings({ organization }: SecuritySettingsProps) {
  // Password state
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);
  const [successPass, setSuccessPass] = useState(false);
  const [errorPass, setErrorPass] = useState("");

  // Slug state
  const [slug, setSlug] = useState(organization?.adminPortalSlug || "admin");
  const [loadingSlug, setLoadingSlug] = useState(false);
  const [successSlug, setSuccessSlug] = useState(false);
  const [errorSlug, setErrorSlug] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setErrorPass("New passwords do not match.");
      return;
    }

    setLoadingPass(true);
    setErrorPass("");
    setSuccessPass(false);

    try {
      const res = await updateAdminPassword(currentPass, newPass);
      if (res.success) {
        setSuccessPass(true);
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");
        setTimeout(() => setSuccessPass(false), 4000);
      } else {
        setErrorPass(res.error || "Failed to update password.");
      }
    } catch {
      setErrorPass("An error occurred while updating the password.");
    } finally {
      setLoadingPass(false);
    }
  };

  const handleSlugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSlug(true);
    setErrorSlug("");
    setSuccessSlug(false);

    try {
      const res = await updateAdminPortalSlug(slug);
      if (res.success && res.slug) {
        setSuccessSlug(true);
        setSlug(res.slug);
        setTimeout(() => {
          setSuccessSlug(false);
          window.location.href = `/${res.slug}/dashboard`;
        }, 1500);
      } else {
        setErrorSlug(res.error || "Failed to update admin slug.");
      }
    } catch {
      setErrorSlug("An error occurred while updating the admin slug.");
    } finally {
      setLoadingSlug(false);
    }
  };

  const handleCopyUrl = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.hpedit.com";
    navigator.clipboard.writeText(`${origin}/${slug}`);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* 1. Custom Secret Portal Slug */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-cyan-400" />
            <span>Secret Admin Portal URL Slug</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Hide and protect your portal. Change the URL path from &ldquo;admin&rdquo; to any custom secret slug.
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
          {successSlug && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Admin portal slug updated! Redirecting to new secret location...</span>
            </div>
          )}

          {errorSlug && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorSlug}
            </div>
          )}

          <form onSubmit={handleSlugSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Secret Admin URL Path
              </label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-mono">
                  /
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. secret-ops, control-hub-99"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1 border border-white/10"
                  title="Copy full secret URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedUrl ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300/90 flex items-start gap-2 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Security Notice:</strong> Once changed, the old URL will return a 404 Not Found error. Be sure to bookmark or save your new secret link.
              </span>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loadingSlug || slug === organization?.adminPortalSlug}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
              >
                <span>{loadingSlug ? "Updating..." : "Save Secret Slug"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. Password Security */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            <span>Master Password &amp; Credentials</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Update the master administrative password for this dashboard.
          </p>
        </div>

        <div className="rounded-2xl glass-panel p-6 border border-white/10">
          {successPass && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Admin password updated successfully!</span>
            </div>
          )}

          {errorPass && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorPass}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                New Password (Min 8 characters)
              </label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 text-white text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 text-white text-xs focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loadingPass}
                className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all duration-200 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{loadingPass ? "Updating..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
