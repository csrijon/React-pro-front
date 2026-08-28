"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowRight } from "lucide-react";
import { loginAdmin } from "@/lib/actions";
import CyberCaptcha from "../CyberCaptcha";

export default function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("AdminPassword123!");
  const [captchaToken, setCaptchaToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      setError("Please complete the security verification challenge below.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const result = await loginAdmin(null, formData);

      if (result.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Invalid username or password");
      }
    } catch {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center">
          {error}
        </div>
      )}

      <div>
        <label className="text-xs font-semibold text-gray-300 block mb-1.5">
          Master Username
        </label>
        <div className="relative">
          <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-sm focus:outline-none"
            placeholder="admin"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-300 block mb-1.5">
          Master Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-sm focus:outline-none"
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Cyber Captcha Anti-Bot Challenge */}
      <CyberCaptcha onVerified={(token) => setCaptchaToken(token)} />

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
