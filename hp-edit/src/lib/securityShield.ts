import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// In-memory sliding window rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false; // Rate limit exceeded
  }

  entry.count += 1;
  return true;
}

// Sanitize inputs against XSS, HTML injection, and malicious scripts
export function sanitizeInput(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // Remove HTML tag brackets
    .replace(/javascript:/gi, "") // Remove javascript protocol
    .replace(/on\w+=/gi, "") // Remove inline event handlers like onclick=, onerror=
    .replace(/eval\((.*?)\)/gi, "")
    .trim();
}

// Anonymize IP hash for privacy-preserving security logs
export function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + "hpe-security-salt").digest("hex").slice(0, 16);
}

// Log visitor activity
export async function logVisitorEvent(data: {
  sessionId?: string;
  eventType: "PAGE_VIEW" | "ESTIMATOR_CALC" | "AI_DEMO_RUN" | "WHATSAPP_CLICK" | "PDF_DOWNLOAD" | "FORM_SUBMIT" | "BOOKING_SUBMIT";
  path: string;
  details?: Record<string, unknown> | string;
  device?: string;
  browser?: string;
  os?: string;
  ip?: string;
}) {
  try {
    const sId = data.sessionId || "sess_" + Math.random().toString(36).substring(2, 9);
    const ipHash = data.ip ? hashIp(data.ip) : null;
    const detailsStr = typeof data.details === "object" ? JSON.stringify(data.details) : data.details || null;

    await prisma.visitorActivity.create({
      data: {
        sessionId: sId,
        eventType: data.eventType,
        path: data.path,
        details: detailsStr,
        device: data.device || "Desktop",
        browser: data.browser || "Chrome",
        os: data.os || "Windows",
        ipHash,
      },
    });
  } catch {
    // Fail silently so client UX is never interrupted
  }
}

// Log blocked security event (bot, honeypot, injection)
export async function logSecurityThreat(data: {
  type: "HONEYPOT_TRIGGER" | "RATE_LIMIT_BLOCKED" | "XSS_ATTEMPT_BLOCKED" | "BOT_REJECTED";
  details: string;
  ip?: string;
}) {
  try {
    const ipHash = data.ip ? hashIp(data.ip) : null;
    await prisma.securityEvent.create({
      data: {
        type: data.type,
        details: data.details,
        ipHash,
      },
    });
  } catch {
    // Fail silently
  }
}
