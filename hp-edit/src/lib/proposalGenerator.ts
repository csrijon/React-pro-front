export interface ProposalSpec {
  refId: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  platforms: string[];
  scaleComplexity: string;
  aiSuperpowers: string[];
  currencySymbol: string;
  currencyCode: string;
  totalCostFormatted: string;
  timelineWeeks: string;
  generatedDate: string;
}

export function generateProposalHtml(spec: ProposalSpec): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HP Edit Enterprise — Project Proposal [${spec.refId}]</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 40px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 2px solid #06b6d4;
      margin-bottom: 30px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #030712;
    }
    .brand-sub {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: #0891b2;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 2px;
    }
    .ref-block {
      text-align: right;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: #64748b;
    }
    .ref-highlight {
      font-size: 13px;
      font-weight: 700;
      color: #030712;
    }
    .section-title {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0891b2;
      margin-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 16px;
    }
    .card-label {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .card-val {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    .price-box {
      background: #ecfeff;
      border: 1.5px solid #06b6d4;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 24px 0;
    }
    .price-label {
      font-size: 12px;
      font-weight: 700;
      color: #0891b2;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .price-val {
      font-size: 32px;
      font-weight: 800;
      color: #0891b2;
      margin-top: 4px;
    }
    .timeline-val {
      font-size: 13px;
      color: #475569;
      margin-top: 4px;
    }
    .list-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #334155;
      margin-bottom: 6px;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      margin: 2px;
    }
    .milestones {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 12px;
    }
    .milestones th, .milestones td {
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      text-align: left;
    }
    .milestones th {
      background: #f1f5f9;
      font-weight: 700;
    }
    .disclaimer-box {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 14px;
      border-radius: 6px;
      font-size: 11px;
      color: #92400e;
      margin-top: 30px;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #94a3b8;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand-title">HP EDIT ENTERPRISE</div>
      <div class="brand-sub">Next-Gen Software &amp; AI Studio • www.hpedit.com</div>
    </div>
    <div class="ref-block">
      <div>SPECIFICATION PROPOSAL</div>
      <div class="ref-highlight">#${spec.refId}</div>
      <div>Date: ${spec.generatedDate}</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-label">Target Architecture &amp; Scale</div>
      <div class="card-val">${spec.scaleComplexity}</div>
    </div>
    <div class="card">
      <div class="card-label">Estimated Delivery Velocity</div>
      <div class="card-val">${spec.timelineWeeks}</div>
    </div>
  </div>

  <div class="section-title">Selected Platform Deliverables</div>
  <div style="margin-bottom: 20px;">
    ${spec.platforms.map((p) => `<span class="badge">${p}</span>`).join(" ")}
  </div>

  <div class="section-title">Integrated AI Superpowers &amp; Automations</div>
  <div style="margin-bottom: 20px;">
    ${spec.aiSuperpowers.map((ai) => `<span class="badge">${ai}</span>`).join(" ")}
  </div>

  <div class="price-box">
    <div class="price-label">Ballpark Estimated Investment</div>
    <div class="price-val">${spec.totalCostFormatted}</div>
    <div class="timeline-val">Target Sprint Horizon: ${spec.timelineWeeks}</div>
  </div>

  <div class="section-title">Sprint Delivery Framework</div>
  <table class="milestones">
    <thead>
      <tr>
        <th>Phase</th>
        <th>Deliverable Scope</th>
        <th>Target Window</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Phase 1: Architecture</strong></td>
        <td>System schema, wireframe blueprints, AI agent topology &amp; data contracts</td>
        <td>Week 1</td>
      </tr>
      <tr>
        <td><strong>Phase 2: Core Engineering</strong></td>
        <td>Next.js / Flutter code, LLM orchestration, WhatsApp Webhooks &amp; DB models</td>
        <td>Weeks 2–3</td>
      </tr>
      <tr>
        <td><strong>Phase 3: QA &amp; Launch</strong></td>
        <td>Stress testing, security audit, staging verification &amp; 100% IP transfer</td>
        <td>Week 4</td>
      </tr>
    </tbody>
  </table>

  <!-- Official Legal Disclaimer & Disclaimers -->
  <div class="disclaimer-box">
    <strong>LEGAL NOTICE &amp; PROPOSAL DISCLAIMER:</strong><br />
    This specification document represents an initial ballpark estimate and technical scoping analysis prepared by HP Edit Enterprise for discussion purposes. Final binding deliverables, fixed milestones, and Service Level Agreements (SLAs) will be formalized in the Master Services Agreement (MSA) upon contract execution. All technical architecture, trademarks, and methodologies remain the intellectual property of HP Edit Enterprise prior to formal assignment.
  </div>

  <!-- Official Copyright Notice -->
  <div class="footer">
    <div>&copy; 2026 HP Edit Enterprise (www.hpedit.com). All rights reserved. Confidential &amp; Proprietary.</div>
    <div>ST 24, Awfis 4th Floor, Siddha Esplanade, Kolkata - 700013 • info@hpedit.com • +91 9836847984</div>
  </div>

  <div class="no-print" style="margin-top: 24px; text-align: center;">
    <button onclick="window.print()" style="padding: 10px 24px; background: #06b6d4; color: #030712; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; font-size: 13px;">
      🖨️ Print / Save as PDF
    </button>
  </div>
</body>
</html>`;
}

export function downloadProposalPdf(spec: ProposalSpec) {
  const html = generateProposalHtml(spec);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 300);
  }
}
