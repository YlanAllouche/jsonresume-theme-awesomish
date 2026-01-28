const translations = {
  en: {
    work: "Experience",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
    volunteer: "Volunteer",
    publications: "Publications",
    languages: "Languages",
    interests: "Interests",
    references: "References",
    certificates: "Certificates",
    awards: "Awards",
    present: "Present",
  },
  fr: {
    work: "Expérience",
    projects: "Projets",
    skills: "Compétences",
    education: "Formation",
    volunteer: "Bénévolat",
    publications: "Publications",
    languages: "Langues",
    interests: "Centres d'intérêt",
    references: "Références",
    certificates: "Certificats",
    awards: "Distinctions",
    present: "Actuellement",
  },
};

function t(key, language = "en") {
  const lang = translations[language] || translations.en;
  return lang[key] || key;
}

module.exports = {
  translations,
  t,
};
