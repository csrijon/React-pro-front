import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendWelcomeEmail, sendResetEmail } from "../utils/mail.js";

function generateNumericOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/**
 * 1. STANDARD REGISTRATION (MANUAL FORM)
 */
export const registerUser = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secure_key_node_2026";
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All input nodes are required." });
    }
    let userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "Identity profile matching this email already exists." });
    }
    const cryptographicSalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, cryptographicSalt);
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password: encryptedPassword,
    });
    await newUser.save();

    // Synchronously await mail delivery completion
    try {
      await sendWelcomeEmail(newUser.email, newUser.name);
    } catch (mailErr) {
      console.error("[MAIL EXCEPTION LOG] Form signup email failed to send:", mailErr);
    }
    
    const sessionToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: "24h" });
    res.status(201).json({
      success: true,
      token: sessionToken,
      message: "User context established and welcome message dispatched successfully.",
    });
  } catch (err) {
    console.error("REGISTRATION FAULT:", err);
    res.status(500).json({ message: "Internal server authentication fault." });
  }
};

/**
 * 2. STANDARD LOGIN (MANUAL FORM)
 */
export const loginUser = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secure_key_node_2026";
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password properties required." });
    }
    const verifiedUser = await User.findOne({ email: email.toLowerCase() });
    if (!verifiedUser) {
      return res.status(400).json({ message: "Invalid access credentials provided." });
    }
    const passwordMatch = await bcrypt.compare(password, verifiedUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid access credentials provided." });
    }
    const sessionToken = jwt.sign({ userId: verifiedUser._id }, JWT_SECRET, { expiresIn: "24h" });
    res.status(200).json({
      success: true,
      token: sessionToken,
      name: verifiedUser.name,
      message: "Authorization verified safely.",
    });
  } catch (err) {
    console.error("LOGIN FAULT:", err);
    res.status(500).json({ message: "Internal server processing failure." });
  }
};

/**
 * 3. GOOGLE OAUTH HANDSHAKE INITIATION
 */
export const handleGoogleRedirect = (req, res) => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google/callback";

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: GOOGLE_REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent select_account",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" "),
  };
  const queryString = new URLSearchParams(options).toString();
  res.redirect(`${rootUrl}?${queryString}`);
};

/**
 * 4. GOOGLE OAUTH FLOW CALLBACK
 */
export const handleGoogleCallback = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secure_key_node_2026";
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google/callback";
  const FRONTEND_DASHBOARD_URL = process.env.FRONTEND_DASHBOARD_URL || "http://localhost:3000/index.html";

  const code = req.query.code;
  if (!code) {
    const baseFrontendUrl = FRONTEND_DASHBOARD_URL.includes('/index.html') 
      ? FRONTEND_DASHBOARD_URL.substring(0, FRONTEND_DASHBOARD_URL.lastIndexOf('/'))
      : FRONTEND_DASHBOARD_URL.split("/dashboard.html")[0];
    return res.redirect(`${baseFrontendUrl}/index.html?error=auth_cancelled`);
  }
  try {
    const tokenUrl = "https://oauth2.googleapis.com/token";
    const tokenOptions = { code, client_id: GOOGLE_CLIENT_ID, client_secret: GOOGLE_CLIENT_SECRET, redirect_uri: GOOGLE_REDIRECT_URI, grant_type: "authorization_code" };
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenOptions).toString(),
    });
    const tokenData = await tokenResponse.json();
    const profileResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${tokenData.access_token}`);
    const profile = await profileResponse.json();
    const userEmail = (profile.email || profile.user_email).toLowerCase().trim();
    const userName = profile.name || profile.given_name || "Google User";
    
    let targetUser = await User.findOne({ email: userEmail });
    if (!targetUser) {
      targetUser = new User({ name: userName, email: userEmail, phone: "N/A", password: "OAUTH_EXTERNAL_MANAGED_ACCOUNT_NODE" });
      await targetUser.save();
      
      // Explicitly await email delivery completion for first-time registrations
      try {
        await sendWelcomeEmail(targetUser.email, targetUser.name);
      } catch (mailErr) {
        console.error("[MAIL EXCEPTION LOG] Google OAuth welcome email failed to send:", mailErr);
      }
    }
    
    const appSessionToken = jwt.sign({ userId: targetUser._id }, JWT_SECRET, { expiresIn: "24h" });
    res.redirect(`${FRONTEND_DASHBOARD_URL}?token=${appSessionToken}&name=${encodeURIComponent(targetUser.name)}&email=${encodeURIComponent(targetUser.email)}`);
  } catch (error) {
    console.error("CRITICAL BACKEND OAUTH DEVIATION EXCEPTION:", error);
    res.status(500).send("Secure verification engine experienced a structural callback block.");
  }
};

/**
 * 5. RETRIEVE REQ USER STATE INFO
 */
export const getMe = async (req, res) => {
  try {
    const userProfile = await User.findById(req.user.userId).select("-password");
    if (!userProfile) return res.status(404).json({ message: "Active user identity could not be localized." });
    res.status(200).json({ success: true, name: userProfile.name, email: userProfile.email, phone: userProfile.phone });
  } catch (err) {
    res.status(500).json({ message: "Internal server verification mapping lookup breakdown." });
  }
};

/**
 * 6. PASSWORD RESET REQUEST (OTP TOKEN INJECTION)
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email target node is required." });
    const account = await User.findOne({ email: email.toLowerCase() });
    if (!account) return res.status(200).json({ success: true, message: "Verification code dispatched." });
    
    const structuralOTP = generateNumericOTP();
    account.resetPasswordToken = structuralOTP;
    account.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await account.save();

    // Explicitly await OTP email delivery completion before returning client response
    try {
      await sendResetEmail(account.email, account.name, structuralOTP);
    } catch (mailErr) {
      console.error("[MAIL EXCEPTION LOG] Forgot password OTP email failed to send:", mailErr);
    }
    
    res.status(200).json({ success: true, message: "Verification code dispatched." });
  } catch (err) {
    res.status(500).json({ message: "Database request processing errors occurred." });
  }
};

/**
 * 7. CONFIRM RECOVERY STATE FORM TARGET
 */
export const resetPasswordConfirm = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "Authentication validation fields missing." });
    const targetUser = await User.findOne({ email: email.toLowerCase(), resetPasswordToken: otp, resetPasswordExpires: { $gt: Date.now() } });
    if (!targetUser) return res.status(400).json({ message: "The verification code is invalid or has expired." });
    
    targetUser.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));
    targetUser.resetPasswordToken = undefined;
    targetUser.resetPasswordExpires = undefined;
    await targetUser.save();
    
    res.status(200).json({ success: true, message: "Password state updated inside database successfully. Please proceed to login." });
  } catch (err) {
    res.status(500).json({ message: "Database update handling error occurred." });
  }
};