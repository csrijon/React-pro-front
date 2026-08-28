import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | HP Edit Enterprise",
  description: "Enterprise terms of service, IP ownership guarantees, and service agreements for HP Edit Enterprise.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar organization={null} />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Terms of Service</span>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Master Commercial Terms</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Terms of Service &amp; Client Agreement
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Last Revised: January 1, 2026 • Reference: MSA-HPEDIT-2026-v2
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/10 space-y-8 text-sm text-gray-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Scope of Engagement</h2>
              <p>
                HP Edit Enterprise undertakes bespoke software engineering, mobile application development, autonomous AI agent architecture, WhatsApp Cloud API integrations, and digital growth consulting according to the deliverables specified in executed Statements of Work (SOW) or signed Master Services Agreements (MSA).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. 100% Intellectual Property &amp; Code Ownership</h2>
              <p>
                Upon receipt of final milestone settlement, <strong>100% of custom source code, repositories, database schemas, and tailored model architectures are irrevocably assigned to the Client</strong>. HP Edit Enterprise retains no lingering claims or vendor lock-in over bespoke deliverables.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Estimates &amp; Scoping Disclaimers</h2>
              <p>
                Calculations provided by the online Cost Estimator represent initial technical ballpark sizing for discovery planning. Final binding timelines, SLA targets, and payment milestones are strictly defined in the technical SOW.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. Confidentiality &amp; Mutual Non-Disclosure</h2>
              <p>
                Both parties agree to treat all business data, customer records, technical specifications, and proprietary algorithms as strictly confidential under our standard Mutual NDA.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">5. Limitation of Liability</h2>
              <p>
                Except in cases of gross negligence or willful misconduct, neither party shall be liable for indirect, incidental, or consequential damages. Maximum aggregate liability is limited to the fees paid under the specific active engagement.
              </p>
            </section>

            {/* Official Copyright Block */}
            <div className="pt-6 border-t border-white/10 text-xs text-gray-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>&copy; 2026 HP Edit Enterprise (www.hpedit.com). All rights reserved.</div>
              <div>contact@hpedit.com • Bengaluru, India</div>
            </div>
          </div>
        </div>
      </main>

      <Footer organization={null} />
    </div>
  );
}
