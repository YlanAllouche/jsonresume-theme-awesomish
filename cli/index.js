#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const resumeModule = require("../index.js");
const coverLetterModule = require("../cover-letter.js");
const boringModule = require("../resume-boring.js");
const { generatePDF } = require("./pdf-generator.js");
const { parseJSONFile } = require("../utils/parse-json.js");

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Awesomish Resume Generator

Usage:
  awesomish <input.json> [--letter] [--a4] [--boring]

Arguments:
  input.json          Path to JSON file (resume or cover letter)
  --letter            Generate cover letter instead of resume (default: CV)
  --a4                Use A4 page size (default: Letter)
  --boring            Generate DOCX using docxtemplater (default: HTML/PDF)

Examples:
  awesomish ./resume.json
  awesomish ./resume.json --letter
  awesomish ./resume.json --a4
  awesomish ./resume.json --boring
  awesomish some/folder/LASTNAME-FIRSTNAME.json
  awesomish some/folder/LASTNAME-FIRSTNAME.json --letter
  `);
  process.exit(0);
}

if (args.length === 0) {
  console.error("Error: No input file specified");
  console.error("Usage: awesomish <input.json> [--letter]");
  process.exit(1);
}

const isBoring = args.includes("--boring");
const isLetter = args.includes("--letter");
const useA4 = args.includes("--a4");
const jsonFile = args.find((arg) => !arg.startsWith("--"));

if (!jsonFile) {
  console.error("Error: No input file specified");
  process.exit(1);
}

if (isBoring && isLetter) {
  console.error("Error: --boring and --letter cannot be used together");
  process.exit(1);
}

const absolutePath = path.resolve(jsonFile);

if (!fs.existsSync(absolutePath)) {
  console.error(`Error: File not found: ${absolutePath}`);
  process.exit(1);
}

const directory = path.dirname(absolutePath);
const fileWithoutExt = path.basename(absolutePath, path.extname(absolutePath));

console.log(
  `📄 Building ${isBoring ? "DOCX resume" : isLetter ? "cover letter" : "resume"} from: ${absolutePath}`,
);

try {
  const jsonData = parseJSONFile(absolutePath);

  if (isBoring) {
    const docxBuffer = boringModule.render(jsonData);
    const docxPath = path.join(directory, `${fileWithoutExt}.docx`);
    fs.writeFileSync(docxPath, docxBuffer);
    console.log(`✅ DOCX: ${docxPath}`);
  } else {
    const renderModule = isLetter ? coverLetterModule : resumeModule;
    const html = renderModule.render(jsonData);

    const pageFormat = useA4 ? "A4" : "letter";

    const pdfRenderOptions = renderModule.pdfRenderOptions || {};
    const pdfViewport = renderModule.pdfViewport || null;
    const pdfPath = path.join(directory, `${fileWithoutExt}.pdf`);

    generatePDF(html, pdfPath, pageFormat, pdfRenderOptions, pdfViewport)
      .then((result) => {
        console.log(`✅ PDF: ${result.path}`);
      })
      .catch((error) => {
        console.error(`${error.message}`);
        process.exit(1);
      });
  }
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exit(1);
}
