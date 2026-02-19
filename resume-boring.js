const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { t } = require("./i18n");

function formatDate(dateStr, language = "en") {
  if (!dateStr) return "";

  if (language !== "en" && language !== "fr") {
    language = "en";
  }

  const locale = language === "fr" ? "fr-FR" : "en-US";

  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const date = new Date(dateStr + "-01");
    return date.toLocaleDateString(locale, {
      month: "short",
      year: "numeric",
    });
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString(locale, {
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
  
  if (parts.length === 0) {
    return { start: "", middle: "", end: "" };
  } else if (parts.length === 1) {
    return { start: parts[0], middle: "", end: "" };
  } else if (parts.length === 2) {
    return { start: parts[0], middle: "", end: parts[1] };
  } else if (parts.length === 3) {
    return { start: parts[0], middle: parts[1], end: parts[2] };
  } else {
    return { start: parts[0], middle: parts[1] + " | " + parts[2], end: parts[3] };
  }
}

function transformSkills(skills) {
  if (!skills || skills.length === 0) return [];
  
  return skills.map((skill, index) => ({
    skillName: skill.name || "",
    keywords: (skill.keywords || []).join(", "),
    hasMoreSkills: index < skills.length - 1
  }));
}

function transformWork(work, language) {
  if (!work || work.length === 0) return [];
  
  return work.map(job => {
    const highlights = (job.highlights || []).map((h, i, arr) => ({
      text: h,
      hasMoreHighlights: i < arr.length - 1
    }));
    
    return {
      position: job.position || "",
      companyName: job.name || "",
      startDate: formatDate(job.startDate, language),
      endDate: formatDate(job.endDate, language) || t("present", language),
      hasSummary: !!(job.summary && job.summary.trim()),
      summary: job.summary || "",
      hasHighlights: highlights.length > 0,
      highlights: highlights
    };
  });
}

function transformProjects(projects) {
  if (!projects || projects.length === 0) return [];
  
  return projects.map(project => {
    const highlights = (project.highlights || []).map((h, i, arr) => ({
      text: h,
      hasMoreHighlights: i < arr.length - 1
    }));
    
    return {
      projectName: project.name || "",
      hasUrl: !!(project.url && project.url.trim()),
      url: project.url || "",
      hasSummary: !!(project.description && project.description.trim()),
      summary: project.description || "",
      hasHighlights: highlights.length > 0,
      highlights: highlights
    };
  });
}

function transformData(resume) {
  const basics = resume.basics || {};
  const contactParts = formatContactInfoParts(basics);

  let language = (resume.meta && resume.meta.language) || "en";
  if (language !== "en" && language !== "fr") {
    language = "en";
  }

  const skills = transformSkills(resume.skills);
  const work = transformWork(resume.work, language);
  const projects = transformProjects(resume.projects);

  const data = {
    name: basics.name || "",
    label: basics.label || "",
    contactInfoStart: contactParts.start,
    contactInfoMiddle: contactParts.middle,
    contactInfoEnd: contactParts.end,
    summary: basics.summary || "",
    
    hasSkills: skills.length > 0,
    skills: skills,
    skillsHeader: t("skills", language),
    
    hasWork: work.length > 0,
    work: work,
    workHeader: t("work", language),
    
    hasProjects: projects.length > 0,
    projects: projects,
    projectsHeader: t("projects", language)
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
    linebreaks: true,
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
