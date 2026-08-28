// ========================================================
// INITIAL OAUTH INTERCEPTOR & SESSION GUARD ROUTINE
// ========================================================
(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const oauthToken = urlParams.get("token");
  const oauthName = urlParams.get("name");
  const oauthEmail = urlParams.get("email");

  if (oauthToken) {
    localStorage.setItem("authToken", oauthToken);

    if (oauthName) {
      localStorage.setItem("userName", decodeURIComponent(oauthName));
    }
    if (oauthEmail) {
      localStorage.setItem("userEmail", decodeURIComponent(oauthEmail));
    }

    const cleanUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.replaceState({ path: cleanUrl }, "", cleanUrl);

    console.log(
      "Google Client Identity Session parsed and established successfully.",
    );
    return;
  }

  if (!localStorage.getItem("authToken")) {
    window.location.href = "registration.html";
  }
})();

// ========================================================
// CORE DOCUMENT MOTORS & PARSING PIPELINES
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const uploadResumeBtn = document.getElementById("uploadResumeBtn");
  const fileInfo = document.getElementById("fileInfo");
  const customCvBtn = document.getElementById("customCvBtn");

  const logoutBtn = document.getElementById("logoutBtn");
  const userAvatarBadge = document.getElementById("userAvatarBadge");

  const loadingOverlay = document.getElementById("loadingOverlay");
  const loaderText = document.getElementById("loaderText");

  const API_BASE_URL =
    window.location.port === "5000" ? "" : "http://localhost:5000";

  /* ========================================================
      1. SESSION CONTROLLER DEPLOYMENT & DYNAMIC LOOKUP
     ======================================================== */
  async function initializeUserSession() {
    const token = localStorage.getItem("authToken");

    let currentEmail = localStorage.getItem("userEmail") || "user@example.com";
    let currentName = localStorage.getItem("userName") || "Ayan Sinha";

    updateAvatarUI(currentName, currentEmail);

    if (token) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          currentName = profileData.name;
          currentEmail = profileData.email;

          localStorage.setItem("userName", currentName);
          localStorage.setItem("userEmail", currentEmail);

          updateAvatarUI(currentName, currentEmail);
        }
      } catch (err) {
        console.error(
          "Profile sync dropped. Operating under local data context:",
          err,
        );
      }
    }
  }

  function updateAvatarUI(name, email) {
    if (userAvatarBadge) {
      userAvatarBadge.textContent = email.charAt(0).toUpperCase();
      const metadataString = `Name: ${name}\nEmail: ${email}`;
      userAvatarBadge.setAttribute("data-profile-info", metadataString);
    }
  }

  initializeUserSession();

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      window.location.href = "registration.html";
    });
  }

  /* ========================================================
      2. PARSING LAYOUT GENERATION MOTOR
     ======================================================== */
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
  }

  if (uploadResumeBtn) {
    uploadResumeBtn.addEventListener("click", () => {
      fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        handleFile(file);
      }
    });
  }

  if (customCvBtn) {
    customCvBtn.addEventListener("click", () => {
      window.location.href = "index2.html";
    });
  }

  function handleFile(file) {
    if (!isPdf(file)) {
      alert("Please upload a PDF resume.");
      return;
    }

    fileInfo.textContent = `Selected: ${file.name}`;

    if (loadingOverlay) {
      loadingOverlay.classList.add("active");
      if (loaderText)
        loaderText.innerText = "Initializing PDF reader engine...";
    }

    extractPDFText(file);
  }

  async function extractPDFText(file) {
    if (!window.pdfjsLib) {
      showUnreadablePdfMessage(
        "PDF reader could not load. Check your internet connection, then refresh the page.",
      );
      if (loadingOverlay) loadingOverlay.classList.remove("active");
      return;
    }

    const reader = new FileReader();

    reader.onload = async function () {
      try {
        if (loaderText)
          loaderText.innerText = "Extracting raw document text matrix...";
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let completeExtractedText = "";

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const textContent = await page.getTextContent();

          let lastY = -1;
          let pageTextString = "";

          for (const item of textContent.items) {
            if (!item.str || item.str.trim() === "") continue;

            const currentY = item.transform[5];

            if (lastY === -1 || Math.abs(currentY - lastY) < 4) {
              pageTextString += (pageTextString ? " " : "") + item.str;
            } else {
              pageTextString += "\n" + item.str;
            }
            lastY = currentY;
          }

          completeExtractedText += pageTextString + "\n\n";
        }

        if (completeExtractedText.trim().length < 40) {
          showUnreadablePdfMessage(
            "This PDF does not contain enough selectable text layers. It may be scanned or image-based.",
          );
          if (loadingOverlay) loadingOverlay.classList.remove("active");
          return;
        }

        fileInfo.textContent = `Selected: ${file.name} - structural context verified successfully.`;
        await generateFromResumeText(completeExtractedText);
      } catch (error) {
        console.error("PDF Error Extraction Failure:", error);
        showUnreadablePdfMessage(
          "The PDF could not be read. Try another PDF format with selectable text vectors.",
        );
        if (loadingOverlay) loadingOverlay.classList.remove("active");
      }
    };

    reader.onerror = () => {
      showUnreadablePdfMessage(
        "The selected file could not be opened by the browser.",
      );
      if (loadingOverlay) loadingOverlay.classList.remove("active");
    };

    reader.readAsArrayBuffer(file);
  }

  function isPdf(file) {
    return (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    );
  }

  function showUnreadablePdfMessage(message) {
    fileInfo.textContent = message;
  }

  async function generateFromResumeText(text) {
    if (!text || text.trim().length < 40) {
      alert("Please provide valid resume text details.");
      if (loadingOverlay) loadingOverlay.classList.remove("active");
      return;
    }

    const token = localStorage.getItem("authToken");
    fileInfo.innerHTML = "Generating Portfolio...";

    if (loaderText)
      loaderText.innerText = "AI parsing application structural data...";

    try {
      const response = await fetch(`${API_BASE_URL}/parse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: text }),
      });

      if (response.status === 401 || response.status === 403) {
        alert("Session validation expired. Please log back in.");
        window.location.href = "registration.html";
        return;
      }

      if (!response.ok) {
        alert(
          "Backend network error. Make sure the backend server layout is live.",
        );
        if (loadingOverlay) loadingOverlay.classList.remove("active");
        return;
      }

      if (loaderText)
        loaderText.innerText = "Redirecting to review workstation...";

      const result = await response.json();

      // ─── DYNAMIC DIRECT AUTOREDIRECT TO CV WORKSPACE HANDOFF ───
      if (result.success && result.resumeId) {
        window.location.href = `index2.html?resumeId=${result.resumeId}`;
      } else {
        alert(
          "Parsing completed but failed to allocate reference identifier token keys.",
        );
        if (loadingOverlay) loadingOverlay.classList.remove("active");
      }
    } catch (error) {
      console.error("Portfolio generation fault trace:", error);
      alert("Could not connect to the system backend infrastructure safely.");
      if (loadingOverlay) loadingOverlay.classList.remove("active");
    }
  }
});
