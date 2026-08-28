import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function removeEmptySections(html, data) {
  const hasRealContent = (arr) => {
    if (!arr || !arr.length) return false;
    return arr.some((item) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object") {
        return Object.values(item).some(
          (val) =>
            val && (typeof val === "string" ? val.trim().length > 0 : Array.isArray(val) ? val.length > 0 : false)
        );
      }
      return false;
    });
  };

  if (!hasRealContent(data.education))
    html = html.replace(/<section class="info-section" id="educationSection">[\s\S]*?<\/section>/, "");
  if (!data.skills?.length)
    html = html.replace(/<section class="info-section" id="skillsSection">[\s\S]*?<\/section>/, "");
  if (!hasRealContent(data.projects))
    html = html.replace(/<section class="info-section" id="projectsSection">[\s\S]*?<\/section>/, "");
  if (!hasRealContent(data.artworks))
    html = html.replace(/<section class="info-section" id="artworksSectionBlock">[\s\S]*?<\/section>/, "");
  if (!hasRealContent(data.experience))
    html = html.replace(/<section class="info-section" id="experienceSection">[\s\S]*?<\/section>/, "");
  if (!data.achievements?.length)
    html = html.replace(/<section class="info-section" id="achievementsSection">[\s\S]*?<\/section>/, "");
  if (!hasRealContent(data.additionalDetails))
    html = html.replace(/<section class="info-section" id="additionalDetailsSectionBlock">[\s\S]*?<\/section>/, "");

  if (!hasRealContent(data.socials))
    html = html.replace(/<div class="socials-wrapper" id="socialsWrapper">[\s\S]*?<\/div>/, "");
  if (!data.email)
    html = html.replace(/<div class="profile-item">[\s\S]*?EMAIL[\s\S]*?<\/div>\s*<\/div>/, "");
  if (!data.phone)
    html = html.replace(/<div class="profile-item">[\s\S]*?PHONE[\s\S]*?<\/div>\s*<\/div>/, "");
  if (!data.location)
    html = html.replace(/<div class="profile-item">[\s\S]*?LOCATION[\s\S]*?<\/div>\s*<\/div>/, "");
  return html;
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  return `${parseInt(hex.substring(0, 2), 16)},${parseInt(hex.substring(2, 4), 16)},${parseInt(hex.substring(4, 6), 16)}`;
}

function buildProjectHTMLComponent(projects) {
  return (projects || [])
    .map((project, index) => {
      const projectPoints = (project.description || "")
        .split(/[\n•.,]+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 5)
        .map((p) => `<li>${p}</li>`)
        .join("");
      return `
      <div class="flip-card" style="--project-bg: url('${project.image || ""}');">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div>
              <div class="project-title">${project.title || `Project ${index + 1}`}</div>
              <div class="project-tech">${project.technologies?.length ? project.technologies.join(" • ") : project.tech || ""}</div>
            </div>
            <div class="tap-indicator">CLICK FOR DETAILS</div>
          </div>
          <div class="flip-card-back">
            <div class="project-back-content-wrapper">
              <div class="project-back-scrollable">
                <div class="project-title">${project.title || `Project ${index + 1}`}</div>
                <div class="project-description">${project.description || ""}</div>
                <ul class="project-details">${projectPoints}</ul>
              </div>
              <div class="project-back-fixed-footer">
                ${project.link ? `<a href="${project.link}" target="_blank" class="project-external-link">LIVE DEMO <i class="fas fa-external-link-alt"></i></a>` : ""}
                <div class="tap-indicator">TAP TO CLOSE</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

function buildArtworkHTMLComponent(artworks) {
  return (artworks || [])
    .map((art, index) => {
      return `
      <div class="artwork-block">
        <div class="artwork-title">${art.title || `Artwork ${index + 1}`}</div>
        <div class="artwork-gallery">${(art.images || []).map((img) => `<div class="artwork-image"><div class="artwork-image-inner"><img src="${img}" alt="Artwork" /></div></div>`).join("")}</div>
      </div>`;
    })
    .join("");
}

function applyGoogleFontStyles(html, rawFontFamily) {
  if (!rawFontFamily) return html;
  const cleanFontName = rawFontFamily.split(",")[0].replace(/['"]/g, "").trim();
  const cssStyleBlock = `<style>:root { --font-main: ${rawFontFamily} !important; } body, h1, h2, h3, h4, p, span, div, li, a { font-family: ${rawFontFamily} !important; }</style>`;
  const linkTag = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFontName)}:wght@300;400;500;600;700&display=swap" rel="stylesheet">`;
  return html.includes("</head>") ? html.replace("</head>", `${linkTag}${cssStyleBlock}</head>`) : cssStyleBlock + linkTag + html;
}

export function compileUnifiedPortfolioHtml(data) {
  const selectedTemplate = data.template || "template1";
  const templatePath = path.join(
    __dirname,
    "../../Frontend",
    `${selectedTemplate}.html`
  );
  let html = fs.readFileSync(templatePath, "utf-8");

  const bgColor = data.theme?.backgroundColor || "#050505";
  const textColor = data.theme?.textColor || "#ffffff";
  const cardColor = bgColor === "#ffffff" ? "#f3f4f6" : "#111111";
  const accentColor = textColor;
  const accent2Color = textColor;
  const mutedColor = textColor === "#ffffff" ? "#9ca3af" : "#4b5563";
  const accentRgb = hexToRgb(accentColor);
  const selectedFont = data.theme?.fontFamily || "'Space Grotesk', sans-serif";

  const fontSizes = data.theme?.fontSizes?.layers || {
    title: 8,
    subtitle: 6,
    heading1: 5,
    heading2: 4,
    body: 2
  };

  html = html
    .replace(/{{bgColor}}/g, bgColor)
    .replace(/{{cardColor}}/g, cardColor)
    .replace(/{{accentColor}}/g, accentColor)
    .replace(/{{accent2Color}}/g, accent2Color)
    .replace(/{{accentRgb}}/g, accentRgb)
    .replace(/{{textColor}}/g, textColor)
    .replace(/{{mutedColor}}/g, mutedColor)
    .replace(/{{fontFamily}}/g, selectedFont)
    .replace(/{{fontSizeTitle}}/g, fontSizes.title)
    .replace(/{{fontSizeSubtitle}}/g, fontSizes.subtitle)
    .replace(/{{fontSizeHeading1}}/g, fontSizes.heading1)
    .replace(/{{fontSizeHeading2}}/g, fontSizes.heading2)
    .replace(/{{fontSizeBody}}/g, fontSizes.body)
    .replace(/{{name}}/g, data.name || "")
    .replace(/{{email}}/g, data.email || "")
    .replace(/{{phone}}/g, data.phone || "")
    .replace(/{{location}}/g, data.location || "")
    .replace(/{{profileImage}}/g, data.profileImage || "");

  // ─── SEGREGATING SIZES WITHIN EDUCATION CARDS ACCORDING TO HIERARCHY LAWS ───
  const educationHTML = (data.education || [])
    .map((edu) => {
      if (typeof edu === "string") {
        return `<div class="education-card"><div class="edu-school" style="font-size: var(--size-h1);">${edu}</div></div>`;
      }
      return `
      <div class="education-card">
        <div class="edu-school" style="font-size: var(--size-h1); font-weight: 700;">${edu.school || ""}</div>
        <div class="edu-degree" style="font-size: var(--size-h2); font-weight: 600;">${edu.degree || ""}</div>
        <div class="edu-duration" style="font-size: var(--size-body); font-weight: 400;">${edu.duration || ""}</div>
      </div>`;
    })
    .join("");

  const skillsHTML = (data.skills || [])
    .map((skill) => `<span class="skill-chip">${skill}</span>`)
    .join("");

  const experienceHTML = (data.experience || [])
    .map((exp) => {
      const points = (exp.description || "").split(/[\n•.,]+/).map((p) => p.trim()).filter((p) => p.length > 5).map((p) => `<li>${p}</li>`).join("");
      return `
      <div class="experience-card">
        <div class="exp-role">${exp.role || ""}</div>
        <div class="exp-company">${exp.company || ""}</div>
        <div class="exp-duration">${exp.duration || ""}</div>
        <ul class="exp-points">${points}</ul>
      </div>`;
    })
    .join("");

  const achievementsHTML = (data.achievements || [])
    .map((ach) => `<li>${ach}</li>`)
    .join("");

  const additionalDetailsHTML = (data.additionalDetails || [])
    .map((section) => {
      const contents = (section.contents || [])
        .map((c) => c.type === "long" ? `<div class="additional-long">${c.value || ""}</div>` : `<div class="additional-short">• ${c.value || ""}</div>`)
        .join("");
      return `
      <div class="additional-block">
        <div class="additional-heading">${section.heading || ""}</div>
        <div class="additional-description">${contents}</div>
      </div>`;
    })
    .join("");

  const socialsHTML = (data.socials || [])
    .map((social) => {
      let icon = `<i class="fa-solid fa-link"></i>`;
      if (social.platform === "linkedin") icon = `<i class="fa-brands fa-linkedin-in"></i>`;
      else if (social.platform === "github") icon = `<i class="fa-brands fa-github"></i>`;
      return `<a href="${social.link}" target="_blank" class="social-link-card"><span class="social-icon">${icon}</span><span class="social-name">${social.platform}</span></a>`;
    })
    .join("");

  html = html
    .replace(/{{education}}/g, educationHTML)
    .replace(/{{skills}}/g, skillsHTML)
    .replace(/{{projects}}/g, buildProjectHTMLComponent(data.projects))
    .replace(/{{artworksSection}}/g, buildArtworkHTMLComponent(data.artworks))
    .replace(/{{experience}}/g, experienceHTML)
    .replace(/{{achievements}}/g, achievementsHTML)
    .replace(/{{socials}}/g, socialsHTML)
    .replace(/{{additionalDetailsSection}}/g, additionalDetailsHTML);

  html = removeEmptySections(html, data);
  html = applyGoogleFontStyles(html, data.theme?.fontFamily);
  return html;
}