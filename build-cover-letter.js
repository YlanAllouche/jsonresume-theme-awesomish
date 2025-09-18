#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { render } = require("./cover-letter.js");

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Cover Letter Generator

Usage:
  node build-cover-letter.js [input.json] [--pdf output.pdf]

Arguments:
  input.json          Path to cover letter JSON file (optional, defaults to cover-letter-schema.json)
  --pdf <path>        Generate PDF at specified path (enables PDF generation)

Examples:
  node build-cover-letter.js                                    # HTML only, default sample
  node build-cover-letter.js my-letter.json                     # HTML only, custom JSON  
  node build-cover-letter.js --pdf letter.pdf                   # PDF from default JSON
  node build-cover-letter.js my-letter.json --pdf letter.pdf    # PDF from custom JSON
  node build-cover-letter.js --pdf /tmp/application.pdf         # PDF with full path
  node build-cover-letter.js my-data.json --pdf ./output/cover-letter.pdf
`);
  process.exit(0);
}

const pdfIndex = args.indexOf("--pdf");
let pdfPath = null;
if (pdfIndex !== -1 && args[pdfIndex + 1]) {
  pdfPath = args[pdfIndex + 1];
}

const jsonFile = args.find((arg) => !arg.startsWith("--") && arg !== pdfPath);
const coverLetterPath =
  jsonFile || path.join(__dirname, "cover-letter-schema.json");

console.log(`📄 Building cover letter from: ${coverLetterPath}`);

try {
  const coverLetterData = JSON.parse(fs.readFileSync(coverLetterPath, "utf8"));
  const html = render(coverLetterData);

  const htmlPath = path.join(__dirname, "cover-letter.html");
  fs.writeFileSync(htmlPath, html, "utf8");
  console.log(`✅ HTML: ${htmlPath}`);

  if (pdfPath) {
    generatePDF(html, pdfPath);
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
      format: "letter", // TODO: Consider making it a cli argument or part of the data schema
      printBackground: true,
      margin: {
        top: "0.5in",
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
