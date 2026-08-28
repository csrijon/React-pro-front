import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { registerUser, loginUser, handleGoogleRedirect, handleGoogleCallback, getMe, forgotPassword, resetPasswordConfirm } from "../controllers/authController.js";
import { parseResume, getUploadedResume, createManualResume, getResumes, viewResume, downloadResume } from "../controllers/resumeController.js";

const router = express.Router();

// Authentication Endpoints
router.post("/api/auth/register", registerUser);
router.post("/api/auth/login", loginUser);
router.get("/auth/google", handleGoogleRedirect);
router.get("/auth/google/callback", handleGoogleCallback);
router.get("/api/auth/me", authenticateToken, getMe);
router.post("/api/auth/forgot-password", forgotPassword);
router.post("/api/auth/reset-password-confirm", resetPasswordConfirm);

// Parsing & Data Generation Endpoints
router.post("/parse", authenticateToken, parseResume);
router.get("/api/uploaded-resume/:id", authenticateToken, getUploadedResume);
router.post("/create-resume", createManualResume);
router.get("/resumes", getResumes);

// HTML Compiler Engine Endpoints
router.get("/resume/:id", viewResume);
router.get("/download/:id", downloadResume);

export default router;