#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { render } = require('../index.js');

// Read the sample resume data
const resumeData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample.json'), 'utf8'));

// Render the HTML
const html = render(resumeData);

// Write the HTML file
const outputPath = path.join(__dirname, '..', 'output.html');
fs.writeFileSync(outputPath, html, 'utf8');

console.log(`✅ HTML generated successfully: ${outputPath}`);

// Optional: Generate PDF using Puppeteer
async function generatePDF() {
  try {
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      headless: 'new'
    });
    const page = await browser.newPage();
    
    // Set content and wait for it to load
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfPath = path.join(__dirname, '..', 'output.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });
    
    await browser.close();
    console.log(`✅ PDF generated successfully: ${pdfPath}`);
  } catch (error) {
    console.error('⚠️  PDF generation failed (puppeteer might not be installed):', error.message);
    console.log('💡 To enable PDF generation, run: npm install puppeteer');
  }
}

// Try to generate PDF
generatePDF();