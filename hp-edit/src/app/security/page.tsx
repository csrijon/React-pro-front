"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, Download, FileText, CheckCircle2, Server, Key, EyeOff } from "lucide-react";
import { soundFX } from "@/components/CyberAudioFx";

export default function SecurityPage() {
  const handleDownloadNda = () => {
    soundFX.success();
    const ndaHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>HP Edit Enterprise — Mutual Non-Disclosure Agreement (NDA)</title>
  <style>
    body { font-family: sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
    h1 { font-size: 22px; color: #030712; border-bottom: 2px solid #06b6d4; padding-bottom: 10px; margin-bottom: 20px; }
    h2 { font-size: 14px; color: #0891b2; margin-top: 20px; margin-bottom: 6px; }
    p { font-size: 12px; margin-bottom: 12px; }
    .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-size: 10px; color: #64748b; }
  </style>
</head>
<body>
  <h1>MUTUAL NON-DISCLOSURE AGREEMENT (NDA)</h1>
  <p><strong>Parties:</strong> HP Edit Enterprise (www.hpedit.com) and the Prospective Client Organization.</p>
  
  <h2>1. Purpose &amp; Confidential Information</h2>
  <p>The parties intend to disclose confidential technical, financial, and strategic information solely for the purpose of exploring and executing software, mobile, and AI agent engineering engagements.</p>

  <h2>2. Non-Disclosure &amp; Security Standards</h2>
  <p>Recipient agrees to protect all Confidential Information with the same degree of care it exercises with its own sensitive assets (not less than reasonable care). Proprietary data will not be shared with third parties without prior written consent.</p>

  <h2>3. AI Data Isolation Guarantee</h2>
  <p>HP Edit Enterprise explicitly guarantees that client documents, internal databases, vector embeddings, and API keys are isolated in private tenant containers and <strong>never used to train public foundation AI models</strong>.</p>

  <h2>4. Governing Law</h2>
  <p>This Agreement is governed by applicable commercial laws, with disputes subject to primary arbitration.</p>

  <div class="footer">
    <div><strong>LEGAL DISCLAIMER:</strong> This is a standard mutual non-disclosure agreement template provided for reference. Executed copies must be countersigned by authorized signatories.</div>
    <div style="margin-top: 8px;">&copy; 2026 HP Edit Enterprise (www.hpedit.com). All rights reserved. Confidential &amp; Proprietary Document.</div>
  </div>

  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(ndaHtml);
      printWin.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-white flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar organization={null} />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold">Security &amp; NDA</span>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise Trust &amp; Air-Gapped AI</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Security Architecture &amp; NDA Guarantee
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              We design software architectures with bank-grade transport encryption, strict tenant isolation, and Day-1 Mutual Non-Disclosure protections.
            </p>
          </div>

          {/* Security Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero Public AI Training</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Your proprietary data, codebase, and customer records are never used to train public LLMs. We deploy private, air-gapped vector pipelines.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">TLS 1.3 &amp; AES-256 Encryption</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                All client API traffic, database storage, and webhook payloads are encrypted in-transit (TLS 1.3) and at-rest using AES-256 bit keys.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Code IP Transfer</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Full intellectual property, Git repositories, deployment scripts, and credentials are unconditionally handed over to you upon completion.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Mutual NDA on Day One</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We sign comprehensive Mutual Non-Disclosure Agreements before technical discovery begins, guaranteeing full legal safety.
              </p>
            </div>
          </div>

          {/* Download NDA Asset Card */}
          <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white">Download Standard Mutual NDA Asset</h3>
              <p className="text-xs text-gray-300">
                Print or download our bilateral NDA template with official copyright disclosures.
              </p>
            </div>

            <button
              onClick={handleDownloadNda}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 shrink-0 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download Official NDA Template</span>
            </button>
          </div>
        </div>
      </main>

      <Footer organization={null} />
    </div>
  );
}
