const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");

function createTemplate() {
  const outputPath = __dirname + "/resume-boring-template.docx";
  
  const fontSizeNormal = "21";
  const fontSizeHeader = "24";
  const fontSizeName = "36";
  const fontSizeLabel = "22";
  const fontSizePosition = "22";
  
  let bodyContent = '';
  
  // Name
  bodyContent += `<w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="${fontSizeName}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{name}</w:t></w:r>
  </w:p>`;
  
  // Label
  bodyContent += `<w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${fontSizeLabel}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{label}</w:t></w:r>
  </w:p>`;
  
  // Contact info
  bodyContent += `<w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{contactInfoStart}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t> | </w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{contactInfoMiddle}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t> | </w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{contactInfoEnd}</w:t></w:r>
  </w:p>`;
  
  // Summary
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="120" w:after="240"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{summary}</w:t></w:r>
  </w:p>`;
  
  // Skills Section Header
  bodyContent += `<w:p>
    <w:pPr>
      <w:pBdr>
        <w:bottom w:val="single" w:sz="6" w:space="1" w:color="000000"/>
      </w:pBdr>
      <w:spacing w:after="40"/>
    </w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="${fontSizeHeader}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{skillsHeader}</w:t></w:r>
  </w:p>`;
  
  // Skills loop - each skill on its own line
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{#skills}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="10" w:after="10"/></w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{skillName}: </w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{keywords}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{/skills}</w:t></w:r>
  </w:p>`;
  
  // Work Section Header
  bodyContent += `<w:p>
    <w:pPr>
      <w:pBdr>
        <w:bottom w:val="single" w:sz="6" w:space="1" w:color="000000"/>
      </w:pBdr>
      <w:spacing w:before="240" w:after="40"/>
    </w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="${fontSizeHeader}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{workHeader}</w:t></w:r>
  </w:p>`;
  
  // Work entries with paragraph loop - loop tags on their own lines
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{#work}</w:t></w:r>
  </w:p>`;
  
  bodyContent += `<w:p>
    <w:pPr>
      <w:tabs>
        <w:tab w:val="right" w:pos="9360"/>
      </w:tabs>
    </w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="${fontSizePosition}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{position}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizePosition}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>, {companyName}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizePosition}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t xml:space="preserve">	</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{startDate} – {endDate}</w:t></w:r>
  </w:p>`;
  
  // Work summary - conditional, only if not empty
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{#hasSummary}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="20" w:after="20"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{summary}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{/hasSummary}</w:t></w:r>
  </w:p>`;
  
  // Work highlights - each on its own line
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{#highlights}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="5" w:after="5"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>● {text}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{/highlights}</w:t></w:r>
  </w:p>
  
  <!-- Add spacing between work entries -->
  <w:p>
    <w:pPr><w:spacing w:before="120" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t> </w:t></w:r>
  </w:p>`;
  
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{/work}</w:t></w:r>
  </w:p>`;
  
  // Projects Section Header
  bodyContent += `<w:p>
    <w:pPr>
      <w:pBdr>
        <w:bottom w:val="single" w:sz="6" w:space="1" w:color="000000"/>
      </w:pBdr>
      <w:spacing w:before="240" w:after="40"/>
    </w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="${fontSizeHeader}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{projectsHeader}</w:t></w:r>
  </w:p>`;
  
  // Projects entries with paragraph loop
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{#projects}</w:t></w:r>
  </w:p>`;
  
  bodyContent += `<w:p>
    <w:pPr>
      <w:tabs>
        <w:tab w:val="right" w:pos="9360"/>
      </w:tabs>
    </w:pPr>
    <w:r><w:rPr><w:b/><w:sz w:val="${fontSizePosition}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{projectName}</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizePosition}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t xml:space="preserve">	</w:t></w:r>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{url}</w:t></w:r>
  </w:p>`;
  
  // Project summary - conditional, only if not empty
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{#hasSummary}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="20" w:after="20"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>{summary}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{/hasSummary}</w:t></w:r>
  </w:p>`;
  
  // Project highlights - each on its own line
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{#highlights}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="5" w:after="5"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="${fontSizeNormal}"/><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/></w:rPr><w:t>● {text}</w:t></w:r>
  </w:p>
  <w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{/highlights}</w:t></w:r>
  </w:p>
  
  <!-- Add spacing between project entries -->
  <w:p>
    <w:pPr><w:spacing w:before="120" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t> </w:t></w:r>
  </w:p>`;
  
  bodyContent += `<w:p>
    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
    <w:r><w:rPr><w:sz w:val="1"/></w:rPr><w:t>{/projects}</w:t></w:r>
  </w:p>`;
  
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyContent}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:sz w:val="${fontSizeNormal}"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`;

  const corePropsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Awesomish Resume Generator</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF"/>
</cp:coreProperties>`;

  const appPropsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>Awesomish Resume Generator</Application>
</Properties>`;

  const zip = new PizZip();

  zip.file("[Content_Types].xml", contentTypesXml);
  zip.file("_rels/.rels", relsXml);
  zip.file("word/document.xml", documentXml);
  zip.file("word/_rels/document.xml.rels", wordRelsXml);
  zip.file("word/styles.xml", stylesXml);
  zip.file("docProps/core.xml", corePropsXml);
  zip.file("docProps/app.xml", appPropsXml);

  const buffer = zip.generate({
    type: "nodebuffer",
    compression: "DEFLATE"
  });

  fs.writeFileSync(outputPath, buffer);
  console.log(`Template created: ${outputPath}`);
}

if (require.main === module) {
  createTemplate();
}

module.exports = { createTemplate };
