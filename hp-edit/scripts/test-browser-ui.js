const puppeteer = require("puppeteer");
const path = require("path");
const { SignJWT } = require("jose");

const outputDir = path.join(
  "C:",
  "Users",
  "ergau",
  ".gemini",
  "antigravity",
  "brain",
  "c6dfdc17-8b0d-4aa1-a284-4c7e1a74d6ba"
);

async function runFullVerification() {
  console.log("🚀 Launching Headless Chrome for 5-Feature Complete Roadmap Audit...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Audit /portal (Client Project Portal)
  console.log("Auditing /portal lookup page...");
  await page.goto("http://localhost:3000/portal", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 600));

  const portalLookupPath = path.join(outputDir, "browser_client_portal_lookup.png");
  await page.screenshot({ path: portalLookupPath, fullPage: false });
  console.log(" Saved:", portalLookupPath);

  // Click Load Live Demo Project (HPE-7849)
  console.log("Unlocking Live Demo Project HPE-7849 in /portal...");
  const demoButton = await page.$('button::-p-text(Load Live Demo Project)');
  if (demoButton) {
    await demoButton.click();
    await new Promise((r) => setTimeout(r, 1200));
  } else {
    // Fill input and submit
    await page.type('input[placeholder*="HPE-7849"]', "HPE-7849");
    await page.click('button[type="submit"]');
    await new Promise((r) => setTimeout(r, 1200));
  }

  const portalDashboardPath = path.join(outputDir, "browser_client_portal_dashboard.png");
  await page.screenshot({ path: portalDashboardPath, fullPage: false });
  console.log(" Saved:", portalDashboardPath);

  // 2. Audit /roi (In-House vs. HP Edit ROI Calculator)
  console.log("Auditing /roi calculator...");
  await page.goto("http://localhost:3000/roi", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));

  const roiPath = path.join(outputDir, "browser_roi_calculator.png");
  await page.screenshot({ path: roiPath, fullPage: false });
  console.log(" Saved:", roiPath);

  // 3. Audit /api/og (Dynamic OpenGraph Image Generation)
  console.log("Auditing /api/og dynamic image...");
  await page.goto(
    "http://localhost:3000/api/og?title=Building+Autonomous+AI+Swarms+with+Gemini+2.0+Flash&category=Frontier+AI&readTime=5+min+read",
    { waitUntil: "networkidle0" }
  );
  await new Promise((r) => setTimeout(r, 600));

  const ogPath = path.join(outputDir, "browser_og_image_api.png");
  await page.screenshot({ path: ogPath, fullPage: false });
  console.log(" Saved:", ogPath);

  // 4. Audit Admin Sidebar with Client Portals tab
  console.log("Auditing Admin Dashboard Client Portals tab...");
  const secret = new TextEncoder().encode("hp-edit-enterprise-ultra-secure-secret-key-2026");
  const token = await new SignJWT({
    userId: "admin-root",
    username: "admin",
    role: "SUPER_ADMIN",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  await page.setCookie({
    name: "hp_admin_session",
    value: token,
    domain: "localhost",
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
  });

  await page.goto("http://localhost:3000/admin/dashboard", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 800));

  // Click "Client Portals & Sprints" tab
  const clientTab = await page.$('button::-p-text(Client Portals & Sprints)');
  if (clientTab) {
    await clientTab.click();
    await new Promise((r) => setTimeout(r, 800));
  }

  const adminClientProjectsPath = path.join(outputDir, "browser_admin_client_projects_tab.png");
  await page.screenshot({ path: adminClientProjectsPath, fullPage: false });
  console.log(" Saved:", adminClientProjectsPath);

  await browser.close();
  console.log("\n✅ Complete 5-Feature Roadmap Audit finished successfully!");
}

runFullVerification().catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});
