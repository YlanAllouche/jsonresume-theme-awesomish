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
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-business-icon lucide-briefcase-business"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>',
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
