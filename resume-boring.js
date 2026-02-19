const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

function formatDate(dateStr) {
  if (!dateStr) return "";

  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const date = new Date(dateStr + "-01");
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatLocation(loc) {
  if (!loc) return "";
  const parts = [];

  if (loc.city) parts.push(loc.city);
  if (loc.region) parts.push(loc.region);
  if (loc.countryCode) parts.push(loc.countryCode);

  return parts.join(", ");
}

function formatContactInfoParts(basics) {
  const parts = [];
  
  if (basics.email) parts.push(basics.email);
  if (basics.phone) parts.push(basics.phone);
  if (basics.location) {
    const loc = formatLocation(basics.location);
    if (loc) parts.push(loc);
  }
  if (basics.url) parts.push(basics.url);
  
  // Split into three segments for bold pipe separators
  // First part, middle parts, last part
  if (parts.length === 0) {
    return { start: "", middle: "", end: "" };
  } else if (parts.length === 1) {
    return { start: parts[0], middle: "", end: "" };
  } else if (parts.length === 2) {
    return { start: parts[0], middle: "", end: parts[1] };
  } else if (parts.length === 3) {
    return { start: parts[0], middle: parts[1], end: parts[2] };
  } else {
    // 4 parts - email | phone | location | url
    return { start: parts[0], middle: parts[1] + " | " + parts[2], end: parts[3] };
  }
}

function transformSkills(skills) {
  if (!skills || skills.length === 0) return [];

  return skills.map(skill => ({
    name: skill.name || "",
    keywords: (skill.keywords || []).join(", ")
  }));
}

function transformWork(work) {
  if (!work || work.length === 0) return [];

  return work.map(job => {
    return {
      name: job.name || "",
      position: job.position || "",
      startDate: formatDate(job.startDate),
      endDate: formatDate(job.endDate) || "Present",
      summary: job.summary || "",
      highlights: job.highlights || []
    };
  });
}

function transformProjects(projects) {
  if (!projects || projects.length === 0) return [];

  return projects.map(project => ({
    name: project.name || "",
    url: project.url || "",
    highlights: project.highlights || []
  }));
}

function transformEducation(education) {
  if (!education || education.length === 0) return [];

  return education.map(edu => {
    const startDate = formatDate(edu.startDate);
    const endDate = formatDate(edu.endDate);
    
    return {
      institution: edu.institution || "",
      studyType: edu.studyType || "",
      area: edu.area || "",
      startDate: startDate,
      endDate: endDate
    };
  });
}

function transformData(resume) {
  const basics = resume.basics || {};
  const contactParts = formatContactInfoParts(basics);

  // Format data to match the enhanced template structure
  const data = {
    // Header
    name: basics.name || "",
    label: basics.label || "",
    contactInfoStart: contactParts.start,
    contactInfoMiddle: contactParts.middle,
    contactInfoEnd: contactParts.end,
    summary: basics.summary || "",
    
    // Sections
    skills: transformSkills(resume.skills),
    work: transformWork(resume.work),
    projects: transformProjects(resume.projects),
    education: transformEducation(resume.education)
  };

  return data;
}

function render(resume) {
  const templatePath = __dirname + "/resume-boring-template.docx";

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found: ${templatePath}`);
  }

  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);

  const transformedData = transformData(resume);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true
  });

  try {
    doc.render(transformedData);
  } catch (error) {
    console.error("Rendering error:", error);
    if (error.properties && error.properties.errors) {
      const errorMessages = error.properties.errors.map(e => e.message).join("\n");
      throw new Error(`Template rendering error:\n${errorMessages}`);
    }
    throw error;
  }

  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE"
  });

  return buf;
}

module.exports = { render, transformData };
