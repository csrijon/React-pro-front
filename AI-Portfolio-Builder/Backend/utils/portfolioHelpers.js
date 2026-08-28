export const fallbackPortfolio = {
  name: "",
  role: "",
  tagline: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  links: { linkedin: "", github: "", portfolio: "" },
  skills: [],
  skillGroups: [],
  projects: [],
  artworks: [],          // ─── FIX 1: Default properties established for complete pipeline pathing ───
  experience: [],
  achievements: [],
  education: [],
  stats: [],
  socials: [],          // ─── FIX 2: Prevents missing schema references on empty form initialization ───
  additionalDetails: [] // ─── FIX 3: Ensures nested component wrappers don't read as undefined ───
};

export function purgeEmptyFormPayloads(body) {
  if (!body) return body;
  const sanitizedData = { ...body };

  const isObjectEmpty = (obj) => {
    if (!obj || typeof obj !== "object") return true;
    return Object.entries(obj).every(([key, value]) => {
      if (key === "_id" || key === "platform" || key === "display") return true;
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === "string") return value.trim() === "";
      return !value;
    });
  };

  const sanitizeArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) => {
      if (typeof item === "string") return item.trim() !== "";
      if (typeof item === "object") return !isObjectEmpty(item);
      return !!item;
    });
  };

  if (sanitizedData.education) sanitizedData.education = sanitizeArray(sanitizedData.education);
  if (sanitizedData.skills) sanitizedData.skills = sanitizeArray(sanitizedData.skills);
  if (sanitizedData.projects) sanitizedData.projects = sanitizeArray(sanitizedData.projects);
  if (sanitizedData.artworks) sanitizedData.artworks = sanitizeArray(sanitizedData.artworks);
  if (sanitizedData.experience) sanitizedData.experience = sanitizeArray(sanitizedData.experience);
  if (sanitizedData.achievements) sanitizedData.achievements = sanitizeArray(sanitizedData.achievements);
  if (sanitizedData.socials) sanitizedData.socials = sanitizeArray(sanitizedData.socials);

  if (sanitizedData.additionalDetails) {
    fontFamily: 
    sanitizedData.additionalDetails = sanitizeArray(sanitizedData.additionalDetails).filter((section) => {
      if (section.contents) section.contents = sanitizeArray(section.contents);
      return (
        section.heading?.trim() !== "" || (section.contents && section.contents.length > 0)
      );
    });
  }

  return sanitizedData;
}

export function cleanAndMergePortfolios(local, ai) {
  const target = { ...fallbackPortfolio };

  target.name = ai.name || local.name || "";
  target.role = ai.role || local.role || "Creative Professional";
  target.tagline = ai.tagline || local.tagline || "";
  target.summary = ai.summary || local.summary || "";
  target.email = ai.email || local.email || "";
  target.phone = ai.phone || local.phone || "";
  target.location = ai.location || local.location || "";

  target.links = {
    linkedin: ai.links?.linkedin || local.links?.linkedin || "",
    github: ai.links?.github || local.links?.github || "",
    portfolio: ai.links?.portfolio || local.links?.portfolio || "",
  };

  if (ai.skills && ai.skills.length) {
    target.skills = ai.skills;
  } else if (ai.skillGroups && ai.skillGroups.length) {
    const harvestedSkills = [];
    ai.skillGroups.forEach((group) => {
      if (Array.isArray(group.items)) {
        group.items.forEach((item) => {
          if (item && !harvestedSkills.includes(item)) {
            harvestedSkills.push(item);
          }
        });
      }
    });
    target.skills = harvestedSkills;
  } else {
    target.skills = local.skills;
  }

  target.skillGroups = ai.skillGroups && ai.skillGroups.length ? ai.skillGroups : local.skillGroups;
  target.projects = ai.projects && ai.projects.length ? ai.projects : local.projects;
  target.experience = ai.experience && ai.experience.length ? ai.experience : local.experience;
  target.achievements = ai.achievements && ai.achievements.length ? ai.achievements : local.achievements;
  
  // ─── FIX 4: Securely copies template-dependent data arrays over to your saved MongoDB target ───
  target.artworks = ai.artworks && ai.artworks.length ? ai.artworks : local.artworks || [];
  target.socials = ai.socials && ai.socials.length ? ai.socials : local.socials || [];
  target.additionalDetails = ai.additionalDetails && ai.additionalDetails.length ? ai.additionalDetails : local.additionalDetails || [];

  if (Array.isArray(ai.education)) {
    target.education = ai.education.map((edu) => {
      if (typeof edu === "string") {
        const parts = edu.split("—");
        const school = parts[0]?.trim() || "Institute Details";
        const degreeWithDate = parts[1]?.trim() || "";
        const dateMatch = degreeWithDate.match(/\(([^)]+)\)/);
        let duration = dateMatch ? dateMatch[1] : "";
        if (duration && !duration.includes("-")) {
          duration = duration.replace(/(\d{4})\s+(\d{4})/, "$1 - $2");
        }
        const degree = degreeWithDate.replace(/\([^)]+\)/, "").trim();

        return { school, degree, duration: duration || "Present" };
      }

      let formattedDuration = edu.duration || edu.year || "";
      if (formattedDuration && !formattedDuration.includes("-")) {
        formattedDuration = formattedDuration.replace(/(\d{4})\s+(\d{4})/, "$1 - $2");
      }

      return {
        school: edu.school || edu.institution || "",
        degree: edu.degree || "",
        duration: formattedDuration || "Present",
      };
    });
  } else {
    target.education = local.education;
  }

  if (ai.stats && ai.stats.length) {
    target.stats = ai.stats;
  } else {
    target.stats = [
      ...(target.projects.length ? [{ value: String(target.projects.length), label: "Portfolio Items" }] : []),
      ...(target.skills.length ? [{ value: String(target.skills.length), label: "Core Competencies" }] : []),
    ].filter((s) => s.value !== "0");
  }

  return target;
}

export function buildPortfolioFromTextFallback(rawText) {
  const text = rawText.replace(/\s+/g, " ");
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  const phone = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() || "";
  const linkedin = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+/i)?.[0] || "";
  const github = text.match(/https?:\/\/(?:www\.)?github\.com\/[^\s]+/i)?.[0] || "";

  let extractedName = "";
  if (lines.length > 0) {
    const cleanLine = lines[0].replace(/[^a-zA-Z\s]/g, "").trim();
    if (cleanLine.split(/\s+/).length <= 4 && cleanLine.length > 2)
      extractedName = titleCase(cleanLine);
  }
  return {
    ...fallbackPortfolio,
    name: extractedName,
    email,
    phone,
    links: { linkedin, github, portfolio: "" },
  };
}

export function titleCase(text) {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\bUi\b/g, "UI")
    .replace(/\bUx\b/g, "UX");
}