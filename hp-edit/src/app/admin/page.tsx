import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminLoginForm from "@/components/Admin/AdminLoginForm";
import Navbar from "@/components/Navbar";
import ThemeWrapper from "@/components/ThemeWrapper";
import Link from "next/link";
import { Terminal, Shield, ArrowLeft } from "lucide-react";
import { OrganizationData } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  let org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        id: "default",
        name: "HP Edit Enterprise",
        tagline: "Architecting Intelligent Software, AI Agents & Enterprise Systems",
        description: "We are an elite software engineering studio crafting high-speed web apps, mobile solutions, autonomous AI agents, enterprise automation pipelines, and WhatsApp growth engines.",
      },
    });
  }

  return (
    <ThemeWrapper organization={org as unknown as OrganizationData}>
      <div className="min-h-screen bg-cyber-950 flex flex-col justify-between text-white relative selection:bg-cyan-500 selection:text-black overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar organization={org as unknown as OrganizationData} />

        {/* Glow Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[450px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Center Login Form Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-24 sm:py-32 relative z-10">
          <div className="w-full max-w-md">
            {/* Back Link */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to hpedit.com Home</span>
            </Link>

            {/* Login Card */}
            <div className="rounded-3xl luxury-card p-8 sm:p-10 border border-white/10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px] mx-auto mb-4 shadow-glow-cyan/20">
                  <div className="w-full h-full bg-cyber-950 rounded-[14px] flex items-center justify-center">
                    <Terminal className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Management Portal</h1>
                <p className="text-xs text-gray-400 mt-1.5">HP Edit Enterprise Control Center</p>
              </div>

              <AdminLoginForm />

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-[11px] text-gray-400">
                  Default Credentials: <span className="font-mono text-cyan-300 font-bold">admin</span> / <span className="font-mono text-cyan-300 font-bold">AdminPassword123!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
}
