import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | HP Edit Enterprise",
  description: "Enterprise privacy policy, data protection standards, and compliance information for HP Edit Enterprise.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar organization={null} />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Privacy Policy</span>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Legal &amp; Compliance Standards</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Enterprise Privacy Policy
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Last Updated &amp; Effective: January 1, 2026 • Reference: POL-PRIV-2026-v1
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-white/10 space-y-8 text-sm text-gray-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Overview &amp; Commitment</h2>
              <p>
                HP Edit Enterprise (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), operating the digital portal at <strong>www.hpedit.com</strong>, provides world-class software engineering, mobile development, autonomous AI agent architecture, and enterprise messaging systems. We are committed to protecting the privacy, confidentiality, and security of all client data.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Information Collection &amp; Use</h2>
              <p>
                We only collect data strictly necessary to scope, architect, and deliver software services. This includes contact details provided through our discovery estimator, chatbot conversations, inquiry forms, and WhatsApp channels. We do not sell or monetize client information to third parties.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. AI Data Isolation &amp; Model Privacy</h2>
              <p>
                Any proprietary data, documents, or knowledge bases provided for private RAG (Retrieval-Augmented Generation) or fine-tuning are air-gapped and processed strictly within isolated tenant containers. Client proprietary data is <strong>never used to train public foundation models</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. Meta WhatsApp Business API Messaging Compliance</h2>
              <p>
                When you initiate communication with our official WhatsApp Business channels (+91 98765 43210), messaging metadata is handled in compliance with the Meta Cloud API Privacy Directive and end-to-end transport encryption.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">5. Contact &amp; Data Rights</h2>
              <p>
                For questions regarding data access, deletion, or privacy verification, contact our Data Governance Officer at <a href="mailto:privacy@hpedit.com" className="text-cyan-400 underline">privacy@hpedit.com</a> or <a href="mailto:contact@hpedit.com" className="text-cyan-400 underline">contact@hpedit.com</a>.
              </p>
            </section>

            {/* Official Copyright Block */}
            <div className="pt-6 border-t border-white/10 text-xs text-gray-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>&copy; 2026 HP Edit Enterprise (www.hpedit.com). All rights reserved.</div>
              <div>Executive Tech Hub, Bengaluru, India</div>
            </div>
          </div>
        </div>
      </main>

      <Footer organization={null} />
    </div>
  );
}
