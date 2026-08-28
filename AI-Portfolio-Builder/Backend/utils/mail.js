import nodemailer from "nodemailer";
import "dotenv/config";
import { text } from "express";

// Helper to create the transporter dynamically when needed

// Dispatch Welcome Email
export const sendWelcomeEmail = async (userEmail, userName) => {
  // Simple, friendly HTML layout
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; margin: auto;">
      <h2 style="color: #2563eb; margin-top: 0;">Welcome to WebBuilder, ${userName}! 🎉</h2>
      <p style="color: #334155; font-size: 16px; line-height: 1.6;">Thanks for signing up! Your account is ready to go.</p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6;">You can now log in to your dashboard and start building your portfolio website.</p>
      <p style="color: #334155; font-size: 16px; line-height: 1.6;">Cheers,<br>The WebBuilder Team</p>
    </div>
  `;

  // Straightforward, plain-text fallback
  const textContent = `Welcome to WebBuilder, ${userName}!

Thanks for signing up! Your account is ready to go. You can now log in to your dashboard and start building your portfolio website.

Cheers,
The WebBuilder Team`;

  try {
    const transpoter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const sendwelcomemaildata = {
      from: `"WebBuilder Team" ${process.env.EMAIL_USER}`,
      to: `${userEmail}`,
      subject: "Welcome to our website",
      text: textContent
    }

    await transpoter.sendMail(sendwelcomemaildata)
    console.log(`[MAIL SUCCESS] Welcome mail sent to: ${userEmail}`);
  } catch (error) {
    console.error("[MAIL EXCEPTION] Failed to send welcome email:", error);
    throw error;
  }
};

// Secure Reset Password OTP Verification Code
export const sendResetEmail = async (userEmail, userName, otpCode) => {
  // Conversational HTML without intense red colors or security alerts
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; margin: auto;">
      <h2 style="color: #1e293b; margin-top: 0;">Reset your password</h2>
      <p style="color: #334155; font-size: 16px;">Hi ${userName},</p>
      <p style="color: #334155; font-size: 16px;">We received a request to reset your WebBuilder password. Use the verification code below to proceed:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #2563eb; font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 4px; padding: 12px 35px; border-radius: 6px;">
          ${otpCode}
        </div>
      </div>
      
      <p style="color: #334155; font-size: 15px; line-height: 1.5;">This code will expire in 15 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  // Clean plain-text fallback for OTP
  const textContent = `Hi ${userName},

We received a request to reset your WebBuilder password. Use the verification code below to proceed:

Verification Code: ${otpCode}

This code will expire in 15 minutes. If you didn't request a password reset, you can safely ignore this email.

Thanks,
The WebBuilder Team`;

  try {

    const transpoter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });


    const sendresetmaildata = {
      from: `"WebBuilder" <${process.env.EMAIL_USER}>`,
      to: `${userEmail}`,
      subject: "Your WebBuilder password reset code",
      text: textContent,
      html: htmlContent
    }

    await transpoter.sendMail(sendresetmaildata)

    console.log(`[MAIL SUCCESS] Reset OTP mail sent to: ${userEmail}`);

  } catch (error) {
    console.error("[MAIL EXCEPTION] Failed to send reset OTP email:", error);
    throw error;
  }
};