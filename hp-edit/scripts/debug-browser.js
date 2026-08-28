const puppeteer = require("puppeteer");

async function checkConsole() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  page.on("console", (msg) => console.log("BROWSER LOG:", msg.type(), msg.text()));
  page.on("pageerror", (err) => console.log("PAGE ERROR:", err.message, err.stack));

  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 2000));
  await browser.close();
}

checkConsole().catch(console.error);
