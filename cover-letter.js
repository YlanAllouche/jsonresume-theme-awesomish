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
  const parts = [];
  
  if (loc.city) parts.push(loc.city);
  if (loc.postalCode) parts.push(loc.postalCode);
  if (loc.region) parts.push(loc.region);
  if (loc.countryCode) parts.push(loc.countryCode);
  
  const cityToCountry = parts.join(", ");
  if (!loc.address) return cityToCountry;
  return `${loc.address}. ${cityToCountry}`;
}

function formatDate(dateStr, format = "MMM DD, YYYY") {
  if (!dateStr) return "";

  if (/^\d{4}$/.test(dateStr)) {
    return dateStr;
  }

  if (/^\d{4}-\d{2}$/.test(dateStr)) {
    const date = new Date(dateStr + "-01");
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  if (format === "MMM DD, YYYY") {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return dateStr;
}

Handlebars.registerHelper("formatLocation", formatLocation);

Handlebars.registerHelper("noSchemaURL", noSchemaURL);

Handlebars.registerHelper("markdown", function (text, inline = false) {
  if (!text) return "";
  return inline ? marked.parseInline(text) : marked.parse(text);
});

Handlebars.registerHelper("getIconSVG", function (iconName) {
  const icons = {
    "mdi:email":
      '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>',
    "mdi:phone":
      '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/></svg>',
    "mdi:location":
      '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>',
    "mdi:link-variant":
      '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>',
  };
  return icons[iconName] || "";
});

Handlebars.registerHelper("formatDate", function (dateStr) {
  return formatDate(dateStr);
});

Handlebars.registerHelper("or", function (...args) {
  const options = args.pop();
  return args.some(arg => !!arg);
});

function render(coverLetterData) {
  const css = fs.readFileSync(__dirname + "/style.css", "utf-8");
  const template = fs.readFileSync(__dirname + "/cover-letter.handlebars", "utf-8");

  const html = Handlebars.compile(template)({
    css,
    ...coverLetterData,
  });

  return minify(html, minifyOptions);
}

module.exports = {
  render,
};