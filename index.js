const fs = require("fs");
const Handlebars = require("handlebars");
const { marked } = require("marked");
const { minify } = require("html-minifier");

const renderer = {
  heading(text) {
    return text;
  },
  html(html) {
    return html;
  },
  hr() {
    return "";
  },
  list(body) {
    return body;
  },
  listitem(text) {
    return text;
  },
  br() {
    return "";
  },
  paragraph(text) {
    return text;
  },
};

marked.use({ renderer });

const minifyOptions = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  decodeEntities: true,
  minifyCSS: true,
  removeComments: true,
  removeRedundantAttributes: true,
  sortAttributes: true,
  sortClassName: true,
};

function noSchemaURL(url) {
  if (!url) return "";
  url = url.replace(/https?:\/\//, "");
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  return url;
}

function formatLocation(loc) {
  if (!loc) return "";
  const cityToCountry = ["city", "postalCode", "region", "countryCode"]
    .map((key) => loc[key])
    .filter((v) => v)
    .join(", ");
  if (!loc.address) return cityToCountry;
  return `${loc.address}. ${cityToCountry}`;
}

function hasItems(arr) {
  return arr && arr.length > 0;
}

function formatDate(dateStr, format = "MMM YYYY") {
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

  if (format === "MMM YYYY") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return dateStr;
}

Handlebars.registerHelper("hasItems", hasItems);

Handlebars.registerHelper("formatLocation", formatLocation);

Handlebars.registerHelper("noSchemaURL", noSchemaURL);

Handlebars.registerHelper("dateRange", function (item) {
  let { startDate, endDate } = item;
  if (!startDate && !endDate) return "";

  const formattedStart = startDate ? formatDate(startDate) : "";
  const formattedEnd = endDate ? formatDate(endDate) : "";

  let result = "";
  if (formattedStart && formattedEnd) {
    result = `${formattedStart} – ${formattedEnd}`;
  } else if (formattedStart) {
    result = `${formattedStart} – Present`;
  } else if (formattedEnd) {
    result = `Until ${formattedEnd}`;
  }

  return result ? `<div class="date-range">${result}</div>` : "";
});

Handlebars.registerHelper("date", function (item, fieldName = "date") {
  const dateValue = item[fieldName];
  if (!dateValue) return "";

  const formatted = formatDate(dateValue);
  return `<div class="date-range">${formatted}</div>`;
});

Handlebars.registerHelper("markdown", function (text, inline = false) {
  if (!text) return "";
  return inline ? marked.parseInline(text) : marked.parse(text);
});

Handlebars.registerHelper("linkInDiv", function (url) {
  if (!url) return "";
  return `<div class="url row"><a href="${url}" target="_blank">${noSchemaURL(url)}</a></div>`;
});

// TODO: add proper SVG eventually
Handlebars.registerHelper("getIconSVG", function (iconName) {
  const icons = {
    "mdi:email":
      '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>',
    "mdi:phone":
      '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/></svg>',
    "mdi:location":
      '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>',
    "mdi:link-variant":
      '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.76,13.38L7.76,13.38C7.36,13 7.36,12.35 7.76,11.94L9.19,10.5C9.6,10.1 10.2,10.1 10.59,10.5C11,10.9 11,11.5 10.59,11.91L10.24,12.26L11.65,13.67L12,13.32C13.2,12.1 13.2,10.1 12,8.88L10.59,7.47C9.4,6.26 7.4,6.26 6.18,7.47L4.77,8.88C3.55,10.1 3.55,12.1 4.77,13.32L6.18,14.73C6.4,14.95 6.62,15.16 6.87,15.34C7.13,15.53 7.4,15.68 7.68,15.81C7.83,15.87 7.99,15.92 8.14,15.96C8.29,16 8.44,16 8.59,16C9.4,16 10.2,15.64 10.81,15.03L10.59,13.41M14.83,9.17C14.57,8.98 14.3,8.83 14.02,8.7C13.87,8.64 13.71,8.59 13.56,8.55C13.41,8.51 13.26,8.51 13.11,8.51C12.3,8.51 11.5,8.87 10.89,9.48L11.11,11.1C10.7,10.71 10.7,10.11 11.11,9.7C11.5,9.31 12.1,9.31 12.51,9.7L13.92,11.11C15.14,12.33 15.14,14.33 13.92,15.55L12.51,16.96C11.3,18.17 9.3,18.17 8.08,16.96L6.67,15.55L5.26,16.96L6.67,18.37C7.88,19.58 9.88,19.58 11.1,18.37L12.51,16.96C13.73,15.74 13.73,13.74 12.51,12.53L11.1,11.12C10.9,10.9 10.68,10.69 10.43,10.51L14.83,9.17Z"/></svg>',
  };
  return icons[iconName] || "";
});

Handlebars.registerHelper("join", function (array, separator) {
  return array ? array.join(separator) : "";
});

Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper("subtract", function (a, b) {
  return a - b;
});

Handlebars.registerHelper("first", function (array) {
  return array && array.length > 0 ? array[0] : "";
});

Handlebars.registerHelper("formatDate", function (dateStr) {
  return formatDate(dateStr);
});

Handlebars.registerHelper("substring", function (str, start, end) {
  return str ? str.substring(start, end) : "";
});

Handlebars.registerHelper("lookup", function (obj, key, prop) {
  if (!obj || !obj[key]) return null;
  return prop ? obj[key][prop] : obj[key];
});

Handlebars.registerHelper("hasMultipleEntries", function (array) {
  return array && array.length > 1;
});

Handlebars.registerHelper("conditionalUnderline", function (array, options) {
  if (array && array.length > 1) {
    return "has-underline";
  }
  return "";
});

Handlebars.registerHelper(
  "workUnderline",
  function (workArray, currentIndex, currentName) {
    if (!workArray || workArray.length <= 1) return "";

    const companyCount = workArray.filter(
      (item) => item.name === currentName,
    ).length;
    return companyCount > 1 ? "has-underline" : "";
  },
);

Handlebars.registerHelper(
  "educationUnderline",
  function (eduArray, currentIndex, currentInstitution) {
    if (!eduArray || eduArray.length <= 1) return "";

    const institutionCount = eduArray.filter(
      (item) => item.institution === currentInstitution,
    ).length;
    return institutionCount > 1 ? "has-underline" : "";
  },
);

function render(resume) {
  const css = fs.readFileSync(__dirname + "/style.css", "utf-8");
  const template = fs.readFileSync(__dirname + "/resume.handlebars", "utf-8");

  if (resume.sideProjects && !resume.projects) {
    resume.projects = resume.sideProjects;
  }

  const html = Handlebars.compile(template)({
    css,
    resume,
  });

  return minify(html, minifyOptions);
}

module.exports = {
  render,
};

