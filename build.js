#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { render } = require("./index.js");

const args = process.argv.slice(2);
const pdfFlag = args.includes("--pdf");
const nonFlagArgs = args.filter((arg) => !arg.startsWith("--"));

const resumePath =
  nonFlagArgs[0] || path.join(__dirname, "test", "sample.json");
const outputDir = nonFlagArgs[1] || __dirname;
const outputName = nonFlagArgs[2] || "resume";

console.log(`📄 Building resume from: ${resumePath}`);

try {
  const resumeData = JSON.parse(fs.readFileSync(resumePath, "utf8"));

  const html = render(resumeData);

  const htmlPath = path.join(outputDir, `${outputName}.html`);
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log(`✅ HTML: ${htmlPath}`);

  if (pdfFlag) {
    generatePDF(html, path.join(outputDir, `${outputName}.pdf`));
  }
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}

async function generatePDF(html, pdfPath) {
  try {
    const puppeteer = require("puppeteer");

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

     await page.pdf({
       path: pdfPath,
       format: "A4",
       printBackground: true,
       margin: {
         top: "0.2in",
         right: "0.5in",
         bottom: "0.5in",
         left: "0.5in",
       },
     });

    await browser.close();
    console.log(`✅ PDF: ${pdfPath}`);
  } catch (error) {
    console.error("❌ PDF generation failed:", error.message);
  }
}

