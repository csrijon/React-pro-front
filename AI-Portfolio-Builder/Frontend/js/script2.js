document.addEventListener("DOMContentLoaded", async () => {
  // =========================================
  // CORE FORM AND INTERFACE DOM SELECTORS
  // =========================================
  const cvForm = document.getElementById("cvForm");
  const successPopup = document.getElementById("successPopup");
  const viewCvBtn = document.getElementById("viewCvBtn");
  const downloadCvBtn = document.getElementById("downloadCvBtn");
  const backBtn = document.getElementById("backBtn");
  const previewModal = document.getElementById("previewModal");
  const previewFrame = document.getElementById("previewFrame");
  const closePreview = document.getElementById("closePreview");

  // Header Widget Target Selectors
  const logoutBtn = document.getElementById("logoutBtn");
  const userAvatarBadge = document.getElementById("userAvatarBadge");

  const loadingOverlay = document.getElementById("loadingOverlay");
  const loaderText = document.getElementById("loaderText");

  let generatedResumeUrl = "";
  let profileImageBase64 = "";

  /* =========================================
      0. USER PROFILE SESSION TRACKER MECHANICS
  ========================================= */
  const storedEmail = localStorage.getItem("userEmail") || "User";
  const storedName = localStorage.getItem("userName") || "Ayan Sinha";

  if (userAvatarBadge) {
    userAvatarBadge.textContent = storedEmail.charAt(0).toUpperCase();
    const metadataString = `Name: ${storedName}\nEmail: ${storedEmail}`;
    userAvatarBadge.setAttribute("data-profile-info", metadataString);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      window.location.href = "registration.html";
    });
  }

  /* =========================================
      0b. AUTOMATED HIGH-YIELD AI DATA FEED MOTOR
  ========================================= */
  const urlParams = new URLSearchParams(window.location.search);
  const resumeId = urlParams.get("resumeId");

  if (resumeId && loadingOverlay && loaderText) {
    try {
      loadingOverlay.classList.add("active");
      loaderText.innerText = "Auto-feeding resume details into fields...";

      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/uploaded-resume/${resumeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;

        // Feed Basic Profile Information
        if (data.name) document.getElementById("name").value = data.name;
        if (data.email) document.getElementById("email").value = data.email;
        if (data.phone) document.getElementById("phone").value = data.phone;
        if (data.location)
          document.getElementById("location").value = data.location;

        // Auto-Feed Structured Education Dynamic Cards
        if (Array.isArray(data.education) && data.education.length > 0) {
          const educationContainer = document.getElementById("educationContainer");
          if (educationContainer) {
            educationContainer.innerHTML = "";
            data.education.forEach((edu) => {
              let school = "", degree = "", duration = "";

              if (typeof edu === "object" && edu !== null) {
                school = edu.school || "";
                degree = edu.degree || "";
                duration = edu.duration || "";
              } else if (typeof edu === "string") {
                school = edu;
                if (edu.includes(" — ")) {
                  const parts = edu.split(" — ");
                  school = parts[0].trim();
                  if (parts[1] && parts[1].includes(" (")) {
                    const subParts = parts[1].split(" (");
                    degree = subParts[0].trim();
                    duration = subParts[1].replace(")", "").trim();
                  } else {
                    degree = parts[1].trim();
                  }
                }
              }

              educationContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div class="dynamic-card education-item">
                  <div class="input-group">
                    <label>Institution Name</label>
                    <input type="text" class="education-school" value="${school}" placeholder="Institution Name">
                  </div>
                  <div class="input-group">
                    <label>Degree / Course</label>
                    <input type="text" class="education-degree" value="${degree}" placeholder="B.Tech in CSE">
                  </div>
                  <div class="input-group">
                    <label>Duration</label>
                    <input type="text" class="education-duration" value="${duration}" placeholder="2023 - 2027">
                  </div>
                </div>
              `,
              );
            });
          }
        }

        // Auto-Feed Skills List Items
        if (Array.isArray(data.skills) && data.skills.length > 0) {
          const skillsContainer = document.getElementById("skillsContainer");
          if (skillsContainer) {
            skillsContainer.innerHTML = "";
            data.skills.forEach((skill) => {
              skillsContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div class="dynamic-card skill-item">
                  <div class="input-group">
                    <label>Skill</label>
                    <input type="text" class="skill-input" value="${skill}" placeholder="React.js">
                  </div>
                </div>
              `,
              );
            });
          }
        }

        // Auto-Feed Rich Projects Layout Blocks
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          const projectsContainer = document.getElementById("projectsContainer");
          if (projectsContainer) {
            projectsContainer.innerHTML = "";
            data.projects.forEach((project) => {
              const techs = Array.isArray(project.technologies)
                ? project.technologies.join(", ")
                : project.tech
                  ? Array.isArray(project.tech)
                    ? project.tech.join(", ")
                    : project.tech
                  : "";

              let description = project.description || "";
              if (Array.isArray(project.highlights) && project.highlights.length > 0) {
                description += (description ? "\n" : "") + project.highlights.map((h) => `• ${h}`).join("\n");
              }

              projectsContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div class="dynamic-card project-item">
                  <div class="input-group">
                    <label>Project Title</label>
                    <input type="text" class="project-title" value="${project.title || ""}" placeholder="AI Resume Builder">
                  </div>
                  <div class="input-group">
                    <label>Tech Stack</label>
                    <input type="text" class="project-tech" value="${techs}" placeholder="React, Node.js, MongoDB">
                  </div>
                  <div class="input-group">
                    <label>Project Link (Live Demo / GitHub)</label>
                    <input type="url" class="project-link-input" value="${project.link || ""}" placeholder="https://github.com/yourusername/project">
                  </div>
                  <div class="input-group">
                    <label>Project Details</label>
                    <textarea class="project-description" placeholder="Describe your project...">${description}</textarea>
                  </div>
                  <div class="input-group">
                    <label>Project Background Image</label>
                    <input type="file" class="project-image-input" accept="image/*">
                  </div>
                </div>
              `,
              );
            });
          }
        }

        // Auto-Feed Professional Experiences Matrix Loops
        if (Array.isArray(data.experience) && data.experience.length > 0) {
          const experienceContainer = document.getElementById("experienceContainer");
          if (experienceContainer) {
            experienceContainer.innerHTML = "";
            data.experience.forEach((exp) => {
              let description = exp.description || "";
              if (Array.isArray(exp.highlights) && exp.highlights.length > 0) {
                description += (description ? "\n" : "") + exp.highlights.map((h) => `• ${h}`).join("\n");
              }

              experienceContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div class="dynamic-card experience-item">
                  <div class="input-group">
                    <label>Company</label>
                    <input type="text" class="experience-company" value="${exp.company || ""}" placeholder="Google">
                  </div>
                  <div class="input-group">
                    <label>Role</label>
                    <input type="text" class="experience-role" value="${exp.role || ""}" placeholder="Frontend Developer Intern">
                  </div>
                  <div class="input-group">
                    <label>Duration</label>
                    <input type="text" class="experience-duration" value="${exp.duration || ""}" placeholder="Jan 2025 - Present">
                  </div>
                  <div class="input-group">
                    <label>Experience Details</label>
                    <textarea class="experience-description" placeholder="Describe your experience...">${description}</textarea>
                  </div>
                </div>
              `,
              );
            });
          }
        }

        // Auto-Feed Achievements Array Block
        if (Array.isArray(data.achievements) && data.achievements.length > 0) {
          const achievementsContainer = document.getElementById("achievementsContainer");
          if (achievementsContainer) {
            achievementsContainer.innerHTML = "";
            data.achievements.forEach((ach) => {
              achievementsContainer.insertAdjacentHTML(
                "beforeend",
                `
                <div class="dynamic-card achievement-item">
                  <div class="input-group">
                    <label>Achievement</label>
                    <textarea class="achievement-input" placeholder="Describe your achievement...">${ach}</textarea>
                  </div>
                </div>
              `,
              );
            });
          }
        }
        console.log("[AUTO-FEED MOTOR] Form successfully loaded with high-yield context settings.");
      }
    } catch (err) {
      console.error("Critical auto-fill parsing extraction dropped natively:", err);
    } finally {
      loadingOverlay.classList.remove("active");
    }
  }

  /* =========================================
      THEME COLORS & TYPOGRAPHY STATE
  ========================================= */
  let selectedBackgroundColor = "#f5f1eb";
  let selectedTextColor = "#17201c";
  let selectedFontFamily = "'Inter', sans-serif";

  const fontSelector = document.getElementById("fontFamilySelector");
  const fontSearch = document.getElementById("fontSearch");
  const fontTester = document.getElementById("fontTesterInput");
  const fontCountLabel = document.getElementById("fontCount");
  let allFonts = [];

  /* =========================================
      DYNAMIC GOOGLE FONTS STREAMING LOGIC
  ========================================= */
  if (fontSelector) {
    selectedFontFamily = fontSelector.value;

    fetch("https://unpkg.com/google-fonts-complete@2.0.0/google-fonts.json")
      .then((response) => {
        if (!response.ok) throw new Error("Network issues parsing systemic font lists.");
        return response.json();
      })
      .then((data) => {
        allFonts = Object.keys(data).sort();
        if (fontCountLabel) fontCountLabel.innerText = `${allFonts.length} Fonts available`;
        renderFontOptions(allFonts);
      })
      .catch((err) => {
        console.error("Failed to fetch Google Fonts directory payload:", err);
        if (fontCountLabel) fontCountLabel.innerText = "Error loading list";
      });
  }

  function renderFontOptions(fontList) {
    if (!fontSelector) return;
    fontSelector.innerHTML = "";

    fontList.forEach((fontName) => {
      const option = document.createElement("option");
      option.value = `"${fontName}", sans-serif`;
      option.textContent = fontName;
      if (`"${fontName}", sans-serif` === selectedFontFamily) {
        option.selected = true;
      }
      fontSelector.appendChild(option);
    });
  }

  if (fontSearch) {
    fontSearch.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      const filteredFonts = allFonts.filter((font) =>
        font.toLowerCase().includes(searchTerm),
      );
      renderFontOptions(filteredFonts);
    });
  }

  if (fontSelector) {
    fontSelector.addEventListener("change", function () {
      selectedFontFamily = this.value;
      const cleanFontName = selectedFontFamily.split(",")[0].replace(/"/g, "");

      const fontLinkID = `gf-${cleanFontName.replace(/\s+/g, "-").toLowerCase()}`;
      if (!document.getElementById(fontLinkID)) {
        const linkTag = document.createElement("link");
        linkTag.id = fontLinkID;
        linkTag.rel = "stylesheet";
        linkTag.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFontName)}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(linkTag);
      }

      if (fontTester) {
        fontTester.style.fontFamily = selectedFontFamily;
      }
    });
  }

  /* =========================================
      PROFILE IMAGE PREVIEW
  ========================================= */
  const profileImage = document.getElementById("profileImage");
  const profilePreview = document.getElementById("profilePreview");

  if (profileImage) {
    profileImage.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (event) {
        profileImageBase64 = event.target.result;
        profilePreview.src = profileImageBase64;
      };
      reader.readAsDataURL(file);
    });
  }

  // =========================================
  // DYNAMIC SECTION BUILD ENGINE INJECTIONS
  // =========================================
  const educationContainer = document.getElementById("educationContainer");
  const addEducationBtn = document.getElementById("addEducation");
  if (addEducationBtn && educationContainer) {
    addEducationBtn.addEventListener("click", () => {
      educationContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="dynamic-card education-item">
          <div class="input-group">
            <label>Institution Name</label>
            <input type="text" class="education-school" placeholder="Institution Name">
          </div>
          <div class="input-group">
            <label>Degree / Course</label>
            <input type="text" class="education-degree" placeholder="B.Tech in CSE">
          </div>
          <div class="input-group">
            <label>Duration</label>
            <input type="text" class="education-duration" placeholder="2023 - 2027">
          </div>
        </div>
        `,
      );
    });
  }

  const skillsContainer = document.getElementById("skillsContainer");
  const addSkillBtn = document.getElementById("addSkill");
  if (addSkillBtn && skillsContainer) {
    addSkillBtn.addEventListener("click", () => {
      skillsContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="dynamic-card skill-item">
          <div class="input-group">
            <label>Skill</label>
            <input type="text" class="skill-input" placeholder="React.js">
          </div>
        </div>
        `,
      );
    });
  }

  const projectsContainer = document.getElementById("projectsContainer");
  const addProjectBtn = document.getElementById("addProject");
  if (addProjectBtn && projectsContainer) {
    addProjectBtn.addEventListener("click", () => {
      projectsContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="dynamic-card project-item">
          <div class="input-group">
            <label>Project Title</label>
            <input type="text" class="project-title" placeholder="AI Resume Builder">
          </div>
          <div class="input-group">
            <label>Tech Stack</label>
            <input type="text" class="project-tech" placeholder="React, Node.js, MongoDB">
          </div>
          <div class="input-group">
            <label>Project Link (Live Demo / GitHub)</label>
            <input type="url" class="project-link-input" placeholder="https://github.com/yourusername/project">
          </div>
          <div class="input-group">
            <label>Project Details</label>
            <textarea class="project-description" placeholder="Describe your project..."></textarea>
          </div>
          <div class="input-group">
            <label>Project Background Image</label>
            <input type="file" class="project-image-input" accept="image/*">
          </div>
        </div>
        `,
      );
    });
  }

  const experienceContainer = document.getElementById("experienceContainer");
  const addExperienceBtn = document.getElementById("addExperience");
  if (addExperienceBtn && experienceContainer) {
    addExperienceBtn.addEventListener("click", () => {
      experienceContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="dynamic-card experience-item">
          <div class="input-group">
            <label>Company</label>
            <input type="text" class="experience-company" placeholder="Google">
          </div>
          <div class="input-group">
            <label>Role</label>
            <input type="text" class="experience-role" placeholder="Frontend Developer Intern">
          </div>
          <div class="input-group">
            <label>Duration</label>
            <input type="text" class="experience-duration" placeholder="Jan 2025 - Present">
          </div>
          <div class="input-group">
            <label>Experience Details</label>
            <textarea class="experience-description" placeholder="Describe your experience..."></textarea>
          </div>
        </div>
        `,
      );
    });
  }

  const achievementsContainer = document.getElementById("achievementsContainer");
  const addAchievementBtn = document.getElementById("addAchievement");
  if (addAchievementBtn && achievementsContainer) {
    addAchievementBtn.addEventListener("click", () => {
      achievementsContainer.insertAdjacentHTML(
        "beforeend",
        `
        <div class="dynamic-card achievement-item">
          <div class="input-group">
            <label>Achievement</label>
            <textarea class="achievement-input" placeholder="Describe your achievement..."></textarea>
          </div>
        </div>
        `,
      );
    });
  }

  const addSocialBtn = document.getElementById("addSocial");
  if (addSocialBtn) {
    addSocialBtn.addEventListener("click", () => {
      const socialContainer = document.getElementById("socialContainer");
      if (socialContainer) {
        const socialCard = document.createElement("div");
        socialCard.className = "dynamic-card social-item";
        socialCard.innerHTML = `
          <div class="input-group">
            <label>Platform</label>
            <select class="social-platform">
              <option value="linkedin">LinkedIn</option>
              <option value="github">GitHub</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter / X</option>
              <option value="portfolio">Portfolio Website</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="input-group">
            <label>Profile Link</label>
            <input type="text" class="social-link" placeholder="https://yourprofile.com">
          </div>
          <div class="input-group">
            <label>Display Style</label>
            <select class="social-display">
              <option value="logo">Logo Only</option>
              <option value="name">Name Only</option>
              <option value="both">Logo + Name</option>
            </select>
          </div>
        `;
        socialContainer.appendChild(socialCard);
      }
    });
  }

  // =========================================
  // ADDITIONAL CUSTOM SECTIONS HANDLING
  // =========================================
  const addFieldBtn = document.getElementById("addFieldBtn");
  const customSectionsContainer = document.getElementById("customSectionsContainer");

  function createSection() {
    if (!customSectionsContainer) return;
    const card = document.createElement("div");
    card.className = "premium-additional-card";
    card.innerHTML = `
      <div class="premium-card-top">
        <div class="input-group">
          <label>Section Heading</label>
          <input type="text" class="custom-heading" placeholder="Certifications">
        </div>
      </div>
      <div class="textbox-container">
        <div class="premium-textbox">
          <div class="input-group">
            <label>Content Type</label>
            <select class="textbox-type">
              <option value="short">Short Text</option>
              <option value="long">Long Description</option>
            </select>
          </div>
          <div class="textbox-wrapper">
            <input type="text" class="short-box" placeholder="Enter content...">
          </div>
        </div>
      </div>
      <button type="button" class="minimal-add-btn addTextboxBtn">+ Add Content Box</button>
    `;
    customSectionsContainer.appendChild(card);
    initializeTextboxTypes();
  }

  if (addFieldBtn) {
    addFieldBtn.addEventListener("click", createSection);
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("addTextboxBtn")) {
      const card = e.target.closest(".premium-additional-card");
      const container = card.querySelector(".textbox-container");

      const box = document.createElement("div");
      box.className = "premium-textbox";
      box.innerHTML = `
        <div class="input-group">
          <label>Content Type</label>
          <select class="textbox-type">
            <option value="short">Short Text</option>
            <option value="long">Long Description</option>
          </select>
        </div>
        <div class="textbox-wrapper">
          <input type="text" class="short-box" placeholder="Enter content...">
        </div>
      `;
      container.appendChild(box);
      initializeTextboxTypes();
    }
  });

  function initializeTextboxTypes() {
    document.querySelectorAll(".textbox-type").forEach((select) => {
      select.onchange = function () {
        const box = this.closest(".premium-textbox");
        const wrapper = box.querySelector(".textbox-wrapper");

        if (this.value === "long") {
          wrapper.innerHTML = `<textarea class="long-box" placeholder="Enter detailed content..."></textarea>`;
        } else {
          wrapper.innerHTML = `<input type="text" class="short-box" placeholder="Enter content...">`;
        }
      };
    });
  }

  /* =========================================
      DECOUPLED SWATCH THEME PICKERS LOGIC
  ========================================= */
  const backgroundPicker = document.getElementById("backgroundPicker");
  const textPicker = document.getElementById("textPicker");
  const matchFill = document.getElementById("matchFill");
  const matchText = document.getElementById("matchText");
  const contrastFill = document.getElementById("contrastFill");
  const contrastText = document.getElementById("contrastText");

  if (backgroundPicker && textPicker) {
    selectedBackgroundColor = backgroundPicker.value;
    selectedTextColor = textPicker.value;

    backgroundPicker.addEventListener("input", function () {
      selectedBackgroundColor = this.value;
      updateThemeAnalysis();
    });

    textPicker.addEventListener("input", function () {
      selectedTextColor = this.value;
      updateThemeAnalysis();
    });
  }

  // Event Delegation for Layout Swatch Buttons
  const bgContainer = document.getElementById("backgroundSwatchesContainer");
  if (bgContainer && backgroundPicker) {
    bgContainer.addEventListener("click", (e) => {
      const swatch = e.target.closest("[class^='color-swatch-']");
      if (swatch) {
        const color = swatch.getAttribute("data-color");
        backgroundPicker.value = color;
        selectedBackgroundColor = color;
        updateThemeAnalysis();
      }
    });
  }

  const textContainer = document.getElementById("textSwatchesContainer");
  if (textContainer && textPicker) {
    textContainer.addEventListener("click", (e) => {
      const swatch = e.target.closest("[class^='text-swatch-']");
      if (swatch) {
        const color = swatch.getAttribute("data-color");
        textPicker.value = color;
        selectedTextColor = color;
        updateThemeAnalysis();
      }
    });
  }

  // Recommended Generator Sync Rules Delegation
  const syncBgContainer = document.getElementById("syncBgContainer");
  const syncStatusMsg = document.getElementById("syncStatusMsg");
  if (syncBgContainer && backgroundPicker && textPicker) {
    syncBgContainer.addEventListener("click", (e) => {
      const swatch = e.target.closest("[class^='sync-swatch-']");
      if (swatch) {
        const bg = swatch.getAttribute("data-bg");
        const text = swatch.getAttribute("data-text");
        backgroundPicker.value = bg;
        textPicker.value = text;
        selectedBackgroundColor = bg;
        selectedTextColor = text;
        updateThemeAnalysis();
        
        if (syncStatusMsg) {
          syncStatusMsg.innerText = '✓ Canvas Background & Typography synced perfectly! Contrast score optimized.';
          syncStatusMsg.style.color = '#0f766e';
        }
      }
    });
  }

  const syncTextContainer = document.getElementById("syncTextContainer");
  if (syncTextContainer && backgroundPicker && textPicker) {
    syncTextContainer.addEventListener("click", (e) => {
      const swatch = e.target.closest("[class^='sync-text-']");
      if (swatch) {
        const bg = swatch.getAttribute("data-bg");
        const text = swatch.getAttribute("data-text");
        backgroundPicker.value = bg;
        textPicker.value = text;
        selectedBackgroundColor = bg;
        selectedTextColor = text;
        updateThemeAnalysis();

        if (syncStatusMsg) {
          syncStatusMsg.innerText = '✓ Canvas Background & Typography synced perfectly! Contrast score optimized.';
          syncStatusMsg.style.color = '#0f766e';
        }
      }
    });
  }

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
  }

  function luminance(r, g, b) {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function contrastRatio(bg, text) {
    const bgRgb = hexToRgb(bg);
    const textRgb = hexToRgb(text);
    const L1 = luminance(bgRgb.r, bgRgb.g, bgRgb.b);
    const L2 = luminance(textRgb.r, textRgb.g, textRgb.b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }

  function calculateMatch() {
    const bg = hexToRgb(selectedBackgroundColor);
    const text = hexToRgb(selectedTextColor);
    const diff = Math.abs(bg.r - text.r) + Math.abs(bg.g - text.g) + Math.abs(bg.b - text.b);
    const percentage = Math.floor((diff / 765) * 100);

    if (matchFill) matchFill.style.width = percentage + "%";
    if (!matchText) return;

    if (percentage < 35) {
      matchText.textContent = "Colors not matching well. Choose some other combination";
      matchText.style.color = "#dc2626";
    } else if (percentage < 70) {
      matchText.textContent = `Theme Match: ${percentage}%`;
      matchText.style.color = "#d97706";
    } else {
      matchText.textContent = `Theme Match: ${percentage}%`;
      matchText.style.color = "#16a34a";
    }
  }

  function calculateContrast() {
    const ratio = contrastRatio(selectedBackgroundColor, selectedTextColor);
    const percentage = Math.floor(((ratio - 1) / 20) * 100);

    if (contrastFill) contrastFill.style.width = percentage + "%";
    if (!contrastText) return;

    let label = "";
    if (percentage < 15) { label = "Invisible"; contrastText.style.color = "#dc2626"; } 
    else if (percentage < 30) { label = "Very Poor"; contrastText.style.color = "#ea580c"; } 
    else if (percentage < 50) { label = "Poor"; contrastText.style.color = "#d97706"; } 
    else if (percentage < 70) { label = "Good"; contrastText.style.color = "#65a30d"; } 
    else if (percentage < 90) { label = "Excellent"; contrastText.style.color = "#16a34a"; } 
    else { label = "Perfect"; contrastText.style.color = "#15803d"; }

    contrastText.textContent = `Contrast Score: ${percentage}% (${label})`;
  }

  function updateThemeAnalysis() {
    calculateMatch();
    calculateContrast();
  }

  updateThemeAnalysis();

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 900;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.55);
          resolve(compressedBase64);
        };
      };
      reader.onerror = reject;
    });
  }

  /* =========================================
      REAL-TIME TYPOGRAPHIC SCALING MATRIX
  ========================================= */
  const fontInputs = ["sizeTitle", "sizeSubtitle", "sizeHeading1", "sizeHeading2", "sizeBody"];
  const typoScaleFill = document.getElementById("typoScaleFill");
  const typoScaleText = document.getElementById("typoScaleText");
  const typoSuggestionsList = document.getElementById("typoLayerSuggestionsList");

  function evaluateTypographicHierarchy() {
    const title = parseInt(document.getElementById("sizeTitle")?.value || "0");
    const subtitle = parseInt(document.getElementById("sizeSubtitle")?.value || "0");
    const h1 = parseInt(document.getElementById("sizeHeading1")?.value || "0");
    const h2 = parseInt(document.getElementById("sizeHeading2")?.value || "0");
    const body = parseInt(document.getElementById("sizeBody")?.value || "0");

    let passingPoints = 0;
    let issues = [];

    if (title > subtitle) { passingPoints += 25; } 
    else { issues.push({ layer: "Title", msg: "Title size should be strictly larger than Subtitle to establish clear hierarchy entry dominance." }); }

    if (subtitle > h1) { passingPoints += 25; } 
    else { issues.push({ layer: "Subtitle", msg: "Subtitle size should be larger than Heading 1 to balance section dividers." }); }

    if (h1 > h2) { passingPoints += 25; } 
    else { issues.push({ layer: "Heading 1", msg: "Heading 1 size should be larger than Heading 2 to differentiate sections clearly." }); }

    if (h2 > body) { passingPoints += 25; } 
    else { issues.push({ layer: "Heading 2", msg: "Heading 2 size should be larger than Body text to keep reading rhythm distinct." }); }

    if (typoScaleFill) typoScaleFill.style.width = passingPoints + "%";
    if (typoSuggestionsList) typoSuggestionsList.innerHTML = "";

    if (passingPoints === 100) {
      if (typoScaleText) {
        typoScaleText.textContent = "Typographic Scale Hierarchy: Perfect (100%)";
        typoScaleText.style.color = "#15803d";
      }
      const li = document.createElement("li");
      li.className = "success-item";
      li.textContent = "All layout levels are proportioned correctly for ideal reading rhythm.";
      typoSuggestionsList.appendChild(li);
    } else {
      if (typoScaleText) {
        typoScaleText.textContent = `Typographic Scale Hierarchy: Needs Adjustment (${passingPoints}%)`;
        typoScaleText.style.color = "#ea580c";
      }
      issues.forEach(issue => {
        const li = document.createElement("li");
        li.className = "error-item";
        li.innerHTML = `<strong>Change recommended for ${issue.layer}:</strong> ${issue.msg}`;
        typoSuggestionsList.appendChild(li);
      });
    }

    return { score: passingPoints, details: issues };
  }

  fontInputs.forEach(id => {
    const inputEl = document.getElementById(id);
    if (inputEl) {
      inputEl.addEventListener("input", evaluateTypographicHierarchy);
    }
  });

  evaluateTypographicHierarchy();

  // =========================================
  // SUBMISSION ENGINE DATA SCHEMA PACKAGER
  // =========================================
  if (cvForm) {
    cvForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const location = document.getElementById("location").value.trim();

      const hasSkills = Array.from(document.querySelectorAll(".skill-input")).some((input) => input.value.trim() !== "");
      const hasProjects = Array.from(document.querySelectorAll(".project-title")).some((input) => input.value.trim() !== "");
      const hasEducation = Array.from(document.querySelectorAll(".education-school")).some((input) => input.value.trim() !== "");

      if (name === "" && email === "" && phone === "" && location === "" && !hasSkills && !hasProjects && !hasEducation) {
        alert("Please enter some details before generating your CV.");
        return;
      }

      if (loadingOverlay && loaderText) {
        loadingOverlay.classList.add("active");
        loaderText.innerText = "Analyzing your profile data...";
      }

      const education = [];
      document.querySelectorAll(".education-item").forEach((item) => {
        education.push({
          school: item.querySelector(".education-school").value,
          degree: item.querySelector(".education-degree").value,
          duration: item.querySelector(".education-duration").value,
        });
      });

      const skills = [];
      document.querySelectorAll(".skill-input").forEach((item) => {
        if (item.value.trim() !== "") skills.push(item.value);
      });

      const projects = [];
      for (const item of document.querySelectorAll(".project-item")) {
        let projectImage = "";
        const imageInput = item.querySelector(".project-image-input");
        if (imageInput && imageInput.files.length > 0) {
          projectImage = await compressImage(imageInput.files[0]);
        }
        projects.push({
          title: item.querySelector(".project-title").value,
          technologies: item.querySelector(".project-tech").value.split(",").map((t) => t.trim()).filter(Boolean),
          link: item.querySelector(".project-link-input")?.value || "",
          description: item.querySelector(".project-description").value,
          image: projectImage,
        });
      }

      const experience = [];
      document.querySelectorAll(".experience-item").forEach((item) => {
        experience.push({
          company: item.querySelector(".experience-company").value,
          role: item.querySelector(".experience-role").value,
          duration: item.querySelector(".experience-duration").value,
          description: item.querySelector(".experience-description").value,
        });
      });

      const achievements = [];
      document.querySelectorAll(".achievement-input").forEach((item) => {
        if (item.value.trim() !== "") achievements.push(item.value);
      });

      const additionalDetails = [];
      document.querySelectorAll(".premium-additional-card").forEach((card) => {
        const heading = card.querySelector(".custom-heading")?.value || "";
        const contents = [];

        card.querySelectorAll(".premium-textbox").forEach((box) => {
          const type = box.querySelector(".textbox-type")?.value || "short";
          let value = (type === "long") ? box.querySelector(".long-box")?.value || "" : box.querySelector(".short-box")?.value || "";

          if (value.trim() !== "") contents.push({ type, value });
        });

        if (heading.trim() !== "" || contents.length > 0) additionalDetails.push({ heading, contents });
      });

      const artworks = [];
      for (const artCard of document.querySelectorAll(".art-item")) {
        const title = artCard.querySelector(".art-title")?.value || "";
        const imageInputs = artCard.querySelectorAll(".art-images");
        const images = [];
        for (const input of imageInputs) {
          if (input.files.length > 0) {
            for (const file of input.files) {
              const base64 = await compressImage(file);
              images.push(base64);
            }
          }
        }
        artworks.push({ title, images });
      }

      const socialLinks = [];
      document.querySelectorAll(".social-item").forEach((item) => {
        socialLinks.push({
          platform: item.querySelector(".social-platform").value,
          link: item.querySelector(".social-link").value,
          display: item.querySelector(".social-display").value,
        });
      });

      const scaleReport = evaluateTypographicHierarchy();

      const cvData = {
        profileImage: profileImageBase64,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        location: document.getElementById("location").value,
        education,
        skills,
        projects,
        artworks,
        experience,
        achievements,
        additionalDetails,
        socials: socialLinks,
        template: document.getElementById("template").value,
        theme: {
          backgroundColor: selectedBackgroundColor,
          textColor: selectedTextColor,
          fontFamily: selectedFontFamily,
          fontSizes: {
            layers: {
              title: parseInt(document.getElementById("sizeTitle")?.value || "8"),
              subtitle: parseInt(document.getElementById("sizeSubtitle")?.value || "6"),
              heading1: parseInt(document.getElementById("sizeHeading1")?.value || "5"),
              heading2: parseInt(document.getElementById("sizeHeading2")?.value || "4"),
              body: parseInt(document.getElementById("sizeBody")?.value || "2")
            },
            scaleScore: scaleReport.score,
            structuralIssues: scaleReport.details
          }
        },
      };

      console.log("Payload data submitted successfully:", cvData);

      try {
        const response = await fetch("http://localhost:5000/create-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cvData),
        });

        const result = await response.json();
        const resumeId = result.resume._id;
        generatedResumeUrl = `http://localhost:5000/resume/${resumeId}`;

        if (loadingOverlay) loadingOverlay.classList.remove("active");
        if (successPopup) successPopup.classList.add("active");
      } catch (error) {
        if (loadingOverlay) loadingOverlay.classList.remove("active");
        console.log(error);
        alert("Something went wrong");
      }
    });
  }

  // Multi-File Attachment Channel
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("addMoreArtBtn")) {
      const artCard = e.target.closest(".art-item");
      const uploadWrapper = artCard.querySelector(".art-upload-wrapper");

      if (uploadWrapper) {
        const newInput = document.createElement("input");
        newInput.type = "file";
        newInput.className = "art-images";
        newInput.accept = "image/*";
        newInput.multiple = true;
        newInput.style.marginTop = "18px";
        uploadWrapper.appendChild(newInput);
      }
    }
  });

  if (viewCvBtn) {
    viewCvBtn.addEventListener("click", () => {
      if (previewModal && previewFrame) {
        previewModal.style.display = "block";
        previewFrame.src = generatedResumeUrl;
      }
    });
  }

  if (downloadCvBtn) {
    downloadCvBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(generatedResumeUrl);
        const html = await response.text();

        const blob = new Blob([html], { type: "text/html" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "portfolio.html";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error(error);
        alert("Could not download portfolio");
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (successPopup) successPopup.classList.remove("active");
    });
  }

  if (closePreview) {
    closePreview.addEventListener("click", () => {
      if (previewModal && previewFrame) {
        previewModal.style.display = "none";
        previewFrame.src = "";
      }
    });
  }
});

(() => {
  if (!localStorage.getItem("authToken")) {
    window.location.href = "registration.html";
  }
})();