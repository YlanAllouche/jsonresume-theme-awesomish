const path = require("path");

async function generatePDF(
  html,
  pdfPath,
  format = "letter",
  pdfRenderOptions = {},
  pdfViewport = null,
) {
  try {
    const puppeteer = require("puppeteer");

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium",
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const mediaType = pdfRenderOptions.mediaType || "screen";
    await page.emulateMediaType(mediaType);

    const base64Html = Buffer.from(html).toString("base64");
    await page.goto(`data:text/html;base64,${base64Html}`, {
      waitUntil: "networkidle0",
    });

    if (pdfViewport) {
      await page.setViewport(pdfViewport);
    }

    await page.pdf({
      path: pdfPath,
      format: format,
      printBackground: true,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      ...pdfRenderOptions,
    });

    await browser.close();
    return { success: true, path: pdfPath };
  } catch (error) {
    throw new Error(`PDF generation failed: ${error.message}`);
  }
}

module.exports = {
  generatePDF,
};
