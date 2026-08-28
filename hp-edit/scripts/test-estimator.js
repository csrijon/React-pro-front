const puppeteer = require("puppeteer");
const path = require("path");

const outputDir = path.join(
  "C:",
  "Users",
  "ergau",
  ".gemini",
  "antigravity",
  "brain",
  "c6dfdc17-8b0d-4aa1-a284-4c7e1a74d6ba"
);

async function runAudit() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  await page.goto("http://localhost:3000/estimator", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 600));

  // Scroll down 400px
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise((r) => setTimeout(r, 600));

  const stickyEstimatorPath = path.join(outputDir, "browser_sticky_estimator_scrolled.png");
  await page.screenshot({ path: stickyEstimatorPath, fullPage: false });
  console.log(" Saved:", stickyEstimatorPath);

  await browser.close();
}

runAudit().catch(console.error);
