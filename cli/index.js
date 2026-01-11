#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const resumeModule = require("../index.js");
const coverLetterModule = require("../cover-letter.js");
const { generatePDF } = require("./pdf-generator.js");

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Awesomish Resume Generator

Usage:
  awesomish <input.json> [--letter] [--a4]

Arguments:
  input.json          Path to JSON file (resume or cover letter)
  --letter            Generate cover letter instead of resume (default: CV)
  --a4                Use A4 page size (default: Letter)

Examples:
  awesomish ./resume.json
  awesomish ./resume.json --letter
  awesomish ./resume.json --a4
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

const isLetter = args.includes("--letter");
const useA4 = args.includes("--a4");
const jsonFile = args.find((arg) => !arg.startsWith("--"));

if (!jsonFile) {
  console.error("Error: No input file specified");
  process.exit(1);
}

const absolutePath = path.resolve(jsonFile);

if (!fs.existsSync(absolutePath)) {
  console.error(`Error: File not found: ${absolutePath}`);
  process.exit(1);
}

const directory = path.dirname(absolutePath);
const fileWithoutExt = path.basename(absolutePath, path.extname(absolutePath));
const pdfPath = path.join(directory, `${fileWithoutExt}.pdf`);

console.log(
  `📄 Building ${isLetter ? "cover letter" : "resume"} from: ${absolutePath}`,
);

try {
  const jsonData = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const renderModule = isLetter ? coverLetterModule : resumeModule;
  const html = renderModule.render(jsonData);

  const pageFormat = useA4 ? "A4" : "letter";

  const pdfRenderOptions = renderModule.pdfRenderOptions || {};
  const pdfViewport = renderModule.pdfViewport || null;

  generatePDF(html, pdfPath, pageFormat, pdfRenderOptions, pdfViewport)
    .then((result) => {
      console.log(`✅ PDF: ${result.path}`);
    })
    .catch((error) => {
      console.error(`${error.message}`);
      process.exit(1);
    });
} catch (error) {
  console.error(`Build failed: ${error.message}`);
  process.exit(1);
}
