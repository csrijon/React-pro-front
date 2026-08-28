document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================
     GOOGLE OAUTH REDIRECT & CALLBACK TOKEN CAPTURE
     ======================================================== */
  const urlParams = new URLSearchParams(window.location.search);
  const oauthToken = urlParams.get("token");
  const oauthName = urlParams.get("name");
  const oauthEmail = urlParams.get("email"); // UPDATED: Capturing the corrected email string parameter

  if (urlParams.get("error") === "auth_cancelled") {
    displayInlineError(
      "Google verification stream was cancelled or interrupted.",
    );
    const cleanUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
  }

  if (oauthToken) {
    localStorage.setItem("authToken", oauthToken);
    localStorage.setItem("userName", oauthName || "User Profile");

    // UPDATED: Persisting the precise authenticated email address so your other pages can safely grab it
    if (oauthEmail) {
      localStorage.setItem("userEmail", decodeURIComponent(oauthEmail));
    }

    const cleanUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
    triggerSuccessState(
      `Authenticated as ${oauthName || "User"}! Connecting...`,
      "index.html",
    );
    return;
  }

  /* ========================================================
     ORIGINAL DOM INTERFACE SELECTOR ASSIGNMENTS
     ======================================================== */
  const registerScope = document.getElementById("registerScope");
  const loginScope = document.getElementById("loginScope");
  const forgotPasswordScope = document.getElementById("forgotPasswordScope");

  const linkToLogin = document.getElementById("linkToLogin");
  const linkToRegister = document.getElementById("linkToRegister");
  const linkToForgot = document.getElementById("linkToForgot");
  const forgotToLogin = document.getElementById("forgotToLogin");

  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");

  const processingOverlay = document.getElementById("processingOverlay");
  const overlayText = document.getElementById("overlayText");
  const loaderSpinner = document.querySelector(".loader-spinner");
  const authErrorMessage = document.getElementById("authErrorMessage");

  const API_URL = "http://localhost:5000/api/auth";

  /* ========================================================
     PANEL TRANSITION SWITCH OVERRIDES
     ======================================================== */
  if (linkToLogin) {
    linkToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      clearInlineErrors();
      resetRecoveryWorkflow();
      changeAuthDirectory(registerScope, loginScope);
    });
  }

  if (linkToRegister) {
    linkToRegister.addEventListener("click", (e) => {
      e.preventDefault();
      clearInlineErrors();
      resetRecoveryWorkflow();
      changeAuthDirectory(loginScope, registerScope);
    });
  }

  if (linkToForgot) {
    linkToForgot.addEventListener("click", (e) => {
      e.preventDefault();
      clearInlineErrors();
      changeAuthDirectory(loginScope, forgotPasswordScope);
    });
  }

  if (forgotToLogin) {
    forgotToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      clearInlineErrors();
      resetRecoveryWorkflow();
      changeAuthDirectory(forgotPasswordScope, loginScope);
    });
  }

  function changeAuthDirectory(exitScope, enterScope) {
    if (exitScope) exitScope.classList.remove("active");
    setTimeout(() => {
      if (enterScope) enterScope.classList.add("active");
    }, 150);
  }

  // Helper function to restore the standard recovery UI when leaving the panel
  function resetRecoveryWorkflow() {
    if (forgotPasswordForm) forgotPasswordForm.reset();

    const emailGroup = document.getElementById("recoveryEmailGroup");
    const otpFieldsContainer = document.getElementById("otpFieldsContainer");
    const forgotSubmitBtn = document.getElementById("forgotSubmitBtn");
    const forgotEmailInput = document.getElementById("forgotEmail");
    const recoveryHeadingText = document.querySelector(
      "#forgotPasswordScope .hero-section p",
    );

    if (emailGroup && otpFieldsContainer && forgotSubmitBtn) {
      emailGroup.style.display = "block"; // Bring email container back
      otpFieldsContainer.style.display = "none"; // Hide OTP area
      forgotEmailInput.disabled = false;
      forgotSubmitBtn.textContent = "SEND VERIFICATION CODE";
      if (recoveryHeadingText) {
        recoveryHeadingText.textContent =
          "Enter your registered email address to receive a secure validation code.";
      }
    }
  }

  /* ========================================================
     VALIDATION & ENDPOINT SUBMISSION PIPELINES
     ======================================================== */

  // 1. Handle Registration Request
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearInlineErrors();
      if (!registerForm.checkValidity()) return registerForm.reportValidity();

      const nameValue = document.getElementById("regName").value.trim();
      const emailValue = document.getElementById("regEmail").value.trim();

      const userData = {
        name: nameValue,
        email: emailValue,
        phone: document.getElementById("regPhone").value.trim(),
        password: document.getElementById("regPassword").value,
      };

      initiateOverlay("Compiling User Profile Node...");

      try {
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok && data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userEmail", emailValue);
          localStorage.setItem("userName", nameValue);
          triggerSuccessState("Registered Successfully", "index.html");
        } else {
          terminateOverlay();
          displayInlineError(
            data.message || "Registration encountered an unexpected fault.",
          );
        }
      } catch (err) {
        console.error("NETWORK ERROR:", err);
        terminateOverlay();
        displayInlineError(
          "Unable to establish communication with the identity server.",
        );
      }
    });
  }

  // 2. Handle Login Request
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearInlineErrors();
      if (!loginForm.checkValidity()) return loginForm.reportValidity();

      const emailValue = document.getElementById("loginEmail").value.trim();
      const credentials = {
        email: emailValue,
        password: document.getElementById("loginPassword").value,
      };

      initiateOverlay("Verifying Portal Credentials...");

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (response.ok && data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userEmail", emailValue);
          localStorage.setItem("userName", data.name || "User Profile");
          triggerSuccessState(
            "Login Successfully! Welcome back.",
            "index.html",
          );
        } else {
          terminateOverlay();
          displayInlineError(
            data.message || "Invalid credentials. Please verify your data.",
          );
        }
      } catch (err) {
        console.error("NETWORK ERROR:", err);
        terminateOverlay();
        displayInlineError(
          "Unable to establish communication with the identity server.",
        );
      }
    });
  }

  // 3. TWO-PHASE IN-PLACE OTP PASSPORT RECOVERY WORKFLOW
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearInlineErrors();

      const recoveryEmail = document.getElementById("forgotEmail").value.trim();
      const emailGroup = document.getElementById("recoveryEmailGroup");
      const otpFieldsContainer = document.getElementById("otpFieldsContainer");
      const recoveryOtpInput = document.getElementById("recoveryOtp");
      const recoveryNewPasswordInput = document.getElementById(
        "recoveryNewPassword",
      );
      const forgotSubmitBtn = document.getElementById("forgotSubmitBtn");
      const recoveryHeadingText = document.querySelector(
        "#forgotPasswordScope .hero-section p",
      );

      // PHASE 2: Execute Overwrite and Directly Authorize Login Migration
      if (otpFieldsContainer && otpFieldsContainer.style.display === "block") {
        const otpValue = recoveryOtpInput.value.trim();
        const newPasswordValue = recoveryNewPasswordInput.value;

        if (!otpValue || !newPasswordValue) {
          return displayInlineError(
            "Verification code and new password fields are required.",
          );
        }

        initiateOverlay("Updating Database Security State...");

        try {
          const response = await fetch(`${API_URL}/reset-password-confirm`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: recoveryEmail,
              otp: otpValue,
              newPassword: newPasswordValue,
            }),
          });

          const data = await response.json();

          if (response.ok) {
            resetRecoveryWorkflow();
            // Fluidly move back to the interactive user portal log-in screen frame
            triggerSuccessState("Credentials Altered Successfully!", () => {
              changeAuthDirectory(forgotPasswordScope, loginScope);
            });
          } else {
            terminateOverlay();
            displayInlineError(
              data.message ||
                "Failed to finalize structural password transaction workflow.",
            );
          }
        } catch (err) {
          console.error("NETWORK ERROR:", err);
          terminateOverlay();
          displayInlineError(
            "Server processing error during credential overwrite pipeline.",
          );
        }
        return;
      }

      // PHASE 1: Fetch Verification Handshake from Backend Instance
      if (!forgotPasswordForm.checkValidity())
        return forgotPasswordForm.reportValidity();
      initiateOverlay("Dispatching Verification Code...");

      try {
        const response = await fetch(`${API_URL}/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: recoveryEmail }),
        });

        const data = await response.json();

        if (response.ok) {
          terminateOverlay();

          if (otpFieldsContainer && emailGroup && forgotSubmitBtn) {
            // SWAP ELEMENT FRAMES: Cleanly hide email inputs, drop verification parameters directly in place
            emailGroup.style.display = "none";
            otpFieldsContainer.style.display = "block";

            // Reconfigure form tracking constraints dynamically
            document.getElementById("forgotEmail").disabled = true;
            recoveryOtpInput.required = true;
            recoveryNewPasswordInput.required = true;

            // Adjust panel label details dynamically
            forgotSubmitBtn.textContent = "CONFIRM NEW CREDENTIALS";
            if (recoveryHeadingText) {
              recoveryHeadingText.textContent = `Verification mode active for ${recoveryEmail}. Please update your entry values below.`;
            }

            // Show inline banner configuration layout style rule
            authErrorMessage.textContent =
              "✓ Passcode dropped successfully! Check your inbox.";
            authErrorMessage.style.backgroundColor = "#f0fdf4";
            authErrorMessage.style.color = "#166534";
            authErrorMessage.style.border = "1px solid #bbf7d0";
            authErrorMessage.style.display = "block";
          } else {
            triggerSuccessState(
              "Passcode Sent! Check your configuration inbox.",
              () => {
                changeAuthDirectory(forgotPasswordScope, loginScope);
              },
            );
          }
        } else {
          terminateOverlay();
          displayInlineError(
            data.message ||
              "Failed to issue password recovery pipeline sequence.",
          );
        }
      } catch (err) {
        console.error("NETWORK ERROR:", err);
        terminateOverlay();
        displayInlineError(
          "Server communication drop encountered during recovery lookup.",
        );
      }
    });
  }

  /* ========================================================
     OVERLAY MECHANICS & IN-PAGE ERROR CONTROLLERS
     ======================================================== */
  function initiateOverlay(displayMsg) {
    if (!loaderSpinner || !overlayText || !processingOverlay) return;
    loaderSpinner.innerHTML =
      '<div class="spinner-ring"></div><div class="spinner-ring-inner"></div>';
    overlayText.textContent = displayMsg;
    processingOverlay.classList.add("active");
  }

  function triggerSuccessState(successMsg, destination) {
    if (!loaderSpinner || !overlayText) return;
    overlayText.textContent = successMsg;
    loaderSpinner.innerHTML =
      '<i class="fas fa-check-circle" style="font-size: 70px; color: #166534; animation: pulseCheck 0.5s ease forwards;"></i>';

    setTimeout(() => {
      terminateOverlay();
      if (typeof destination === "function") {
        destination();
      } else if (typeof destination === "string") {
        window.location.href = destination;
      }
    }, 2000);
  }

  function terminateOverlay() {
    if (processingOverlay) processingOverlay.classList.remove("active");
  }

  function displayInlineError(message) {
    if (!authErrorMessage) return;
    authErrorMessage.style.backgroundColor = "";
    authErrorMessage.style.color = "";
    authErrorMessage.style.border = "";
    authErrorMessage.style.display = "none";

    authErrorMessage.textContent = `⚠️ ${message}`;
    authErrorMessage.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearInlineErrors() {
    if (!authErrorMessage) return;
    authErrorMessage.textContent = "";
    authErrorMessage.style.display = "none";
  }
});

(() => {
  if (localStorage.getItem("authToken")) {
    window.location.href = "index.html";
  }
})();
