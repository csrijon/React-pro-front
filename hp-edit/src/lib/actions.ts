"use server";

import { prisma } from "@/lib/prisma";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { sanitizeInput, checkRateLimit, logSecurityThreat, logVisitorEvent } from "@/lib/securityShield";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
  OrganizationData,
  ServiceData,
  ProjectData,
  BlogPostData,
  TeamMemberData,
  FaqData,
  TestimonialData,
  AdminRole,
  AdminUserData,
  AdminNotificationData,
  AuditLogData,
  AccessRequestData,
  LeadCommunicationData,
  BookingData,
  ClientProjectData,
  ProjectMilestoneData
} from "@/types";

export async function getOrganization(): Promise<OrganizationData | null> {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: "default" },
    });
    return org as unknown as OrganizationData;
  } catch (error) {
    console.error("Error fetching organization:", error);
    return null;
  }
}

export async function getPublishedServices(): Promise<ServiceData[]> {
  try {
    const services = await prisma.serviceOffering.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return services as unknown as ServiceData[];
  } catch (error) {
    console.error("Error fetching published services:", error);
    return [];
  }
}

export async function recordAuditLog(action: string, resource: string, details: string) {
  try {
    const session = await getSession();
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";
    await prisma.auditLog.create({
      data: {
        adminUsername: session?.username || "SYSTEM",
        adminRole: session?.role || "SYSTEM",
        action,
        resource,
        details,
        ipAddress: ip,
      },
    });
  } catch (e) {
    console.error("Audit log error:", e);
  }
}

// ----------------- OUTBOUND ALERT DISPATCHER (WEBHOOK & META WHATSAPP) -----------------
export async function dispatchOutboundAlert(title: string, message: string, payload: Record<string, unknown>) {
  try {
    const org = await prisma.organization.findUnique({ where: { id: "default" } });
    if (!org) return;

    // 1. Dispatch Webhook (e.g. Discord, Telegram, Zapier, n8n, Make)
    if (org.outboundWebhookUrl && org.outboundWebhookUrl.startsWith("http")) {
      fetch(org.outboundWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: title,
          summary: message,
          timestamp: new Date().toISOString(),
          data: payload,
        }),
      }).catch((err) => console.error("Webhook dispatch error:", err));
    }

    // 2. Dispatch Meta WhatsApp Cloud API (if credentials configured)
    if (org.metaWhatsappApiToken && org.metaWhatsappPhoneId && org.founderAlertWhatsapp) {
      const recipient = org.founderAlertWhatsapp.replace(/[^0-9]/g, "");
      const metaUrl = `https://graph.facebook.com/v21.0/${org.metaWhatsappPhoneId}/messages`;

      fetch(metaUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${org.metaWhatsappApiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipient,
          type: "text",
          text: {
            body: `🚀 *HP EDIT ALERT: ${title}*\n\n${message}\n\n_Check admin dashboard for full details._`,
          },
        }),
      }).catch((err) => console.error("Meta WhatsApp dispatch error:", err));
    }
  } catch (e) {
    console.error("Outbound alert error:", e);
  }
}

export async function trackClientEvent(data: {
  sessionId?: string;
  eventType: "PAGE_VIEW" | "ESTIMATOR_CALC" | "AI_DEMO_RUN" | "WHATSAPP_CLICK" | "PDF_DOWNLOAD" | "FORM_SUBMIT" | "BOOKING_SUBMIT";
  path: string;
  details?: Record<string, unknown> | string;
  device?: string;
  browser?: string;
  os?: string;
}) {
  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";
    await logVisitorEvent({
      ...data,
      ip,
    });

    if (data.eventType === "PDF_DOWNLOAD") {
      await prisma.adminNotification.create({
        data: {
          type: "PROPOSAL",
          title: "PDF Scope Proposal Downloaded",
          message: `Visitor downloaded proposal asset from ${data.path}.`,
          linkTab: "analytics",
        },
      });
    }

    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function updateOrganization(data: Partial<OrganizationData>) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const updated = await prisma.organization.upsert({
    where: { id: "default" },
    update: {
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      logoUrl: data.logoUrl,
      adminPortalSlug: data.adminPortalSlug,
      
      themeMode: data.themeMode,
      darkBgColor: data.darkBgColor,
      darkTextColor: data.darkTextColor,
      darkCardColor: data.darkCardColor,
      darkAccentColor: data.darkAccentColor,
      darkSecondaryAccent: data.darkSecondaryAccent,
      
      lightBgColor: data.lightBgColor,
      lightTextColor: data.lightTextColor,
      lightCardColor: data.lightCardColor,
      lightAccentColor: data.lightAccentColor,
      lightSecondaryAccent: data.lightSecondaryAccent,

      themeColor: data.themeColor,
      fontFamily: data.fontFamily,
      fontSizeScale: data.fontSizeScale,
      enableSoundFX: data.enableSoundFX,
      
      customFontType: data.customFontType,
      googleFontUrl: data.googleFontUrl,
      googleFontName: data.googleFontName,
      uploadedFontData: data.uploadedFontData,
      uploadedFontName: data.uploadedFontName,

      address: data.address,
      city: data.city,
      country: data.country,
      postalCode: data.postalCode,
      primaryPhone: data.primaryPhone,
      secondaryPhone: data.secondaryPhone,
      whatsappNumber: data.whatsappNumber,
      whatsappDefaultMessage: data.whatsappDefaultMessage,
      primaryEmail: data.primaryEmail,
      salesEmail: data.salesEmail,
      supportEmail: data.supportEmail,
      googleMapsEmbed: data.googleMapsEmbed,
      businessHours: data.businessHours,
      availabilityStatus: data.availabilityStatus,

      customSocials: data.customSocials,
      linkedinUrl: data.linkedinUrl,
      githubUrl: data.githubUrl,
      twitterUrl: data.twitterUrl,
      instagramUrl: data.instagramUrl,
      youtubeUrl: data.youtubeUrl,

      aboutHeading: data.aboutHeading,
      aboutStory: data.aboutStory,
      aboutMission: data.aboutMission,
      aboutStats: data.aboutStats,

      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      seoKeywords: data.seoKeywords,

      calEmbedUrl: data.calEmbedUrl,
      geminiApiKey: data.geminiApiKey,
      geminiModelName: data.geminiModelName || "gemini-2.0-flash",
      geminiSystemPrompt: data.geminiSystemPrompt,
      outboundWebhookUrl: data.outboundWebhookUrl,
      founderAlertWhatsapp: data.founderAlertWhatsapp,
      metaWhatsappApiToken: data.metaWhatsappApiToken,
      metaWhatsappPhoneId: data.metaWhatsappPhoneId,
    },
    create: {
      id: "default",
      name: data.name || "HP Edit Enterprise",
      tagline: data.tagline || "Architecting Intelligent Digital Systems",
      description: data.description || "Next-gen engineering studio.",
      adminPortalSlug: data.adminPortalSlug || "admin",
      themeMode: data.themeMode || "system",
      themeColor: data.themeColor || "cyan",
      fontFamily: data.fontFamily || "inter",
      fontSizeScale: data.fontSizeScale || "normal",
      enableSoundFX: data.enableSoundFX ?? true,
    },
  });

  await recordAuditLog("SETTINGS_UPDATED", "Organization", "Updated studio profile, AI, and alert configurations.");

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/team");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/book");
  return { success: true, organization: updated as unknown as OrganizationData };
}

export async function updateAdminPortalSlug(newSlug: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const cleanSlug = newSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "");
  if (!cleanSlug || cleanSlug.length < 3) {
    return { success: false, error: "Slug must be at least 3 alphanumeric characters." };
  }

  const reserved = ["services", "ai-lab", "case-studies", "estimator", "about", "team", "blog", "careers", "contact", "privacy", "terms", "security", "track", "api", "book"];
  if (reserved.includes(cleanSlug)) {
    return { success: false, error: `The slug '${cleanSlug}' is reserved for public pages.` };
  }

  await prisma.organization.update({
    where: { id: "default" },
    data: { adminPortalSlug: cleanSlug },
  });

  await recordAuditLog("SLUG_CHANGED", "Security", `Admin portal secret slug updated to /${cleanSlug}`);

  return { success: true, slug: cleanSlug };
}

export async function loginAdmin(_prevState: unknown, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Username and password are required." };
  }

  let user = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!user) {
    if (username === "admin" && password === "AdminPassword123!") {
      const defaultHash = await bcrypt.hash("AdminPassword123!", 10);
      user = await prisma.adminUser.create({
        data: {
          username: "admin",
          fullName: "Master Administrator",
          passwordHash: defaultHash,
          role: "SUPER_ADMIN",
          isActive: true,
          lastLoginAt: new Date(),
        },
      });
    } else {
      return { success: false, error: "Invalid credentials." };
    }
  }

  if (!user.isActive) {
    return { success: false, error: "This user account has been deactivated. Please contact your Super Admin." };
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    return { success: false, error: "Invalid credentials." };
  }

  // Update last login timestamp
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createSession({
    userId: user.id,
    username: user.username,
    role: user.role,
  });

  await recordAuditLog("LOGIN", "Authentication", `Admin user @${user.username} signed in successfully.`);

  return { success: true };
}

export async function logoutAdmin() {
  const session = await getSession();
  if (session) {
    await recordAuditLog("LOGOUT", "Authentication", `Admin user @${session.username} signed out.`);
  }
  await destroySession();
  return { success: true };
}

// ----------------- NOTIFICATIONS -----------------
export async function markNotificationAsRead(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.adminNotification.update({
    where: { id },
    data: { isRead: true },
  });

  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.adminNotification.updateMany({
    data: { isRead: true },
  });

  return { success: true };
}

export async function clearAllNotifications() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.adminNotification.deleteMany({});
  return { success: true };
}

// ----------------- TEAM RBAC MANAGEMENT & ACCESS REQUESTS -----------------
export async function createAdminUser(data: {
  username: string;
  fullName: string;
  role: string;
  password: string;
}) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can add new team members." };
  }

  const cleanUsername = data.username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: "Username must be at least 3 characters." };
  }

  if (!data.password || data.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters long." };
  }

  const existing = await prisma.adminUser.findUnique({
    where: { username: cleanUsername },
  });

  if (existing) {
    return { success: false, error: `A team user with username '${cleanUsername}' already exists.` };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const newUser = await prisma.adminUser.create({
    data: {
      username: cleanUsername,
      fullName: data.fullName.trim() || cleanUsername,
      role: data.role || "SALES_LEAD",
      passwordHash,
      isActive: true,
    },
  });

  await prisma.adminNotification.create({
    data: {
      type: "SYSTEM",
      title: "New Team Member Added",
      message: `${data.fullName} (@${cleanUsername}) was granted ${data.role} access.`,
      linkTab: "users",
    },
  });

  await recordAuditLog(
    "USER_CREATED",
    "RBAC",
    `Created team user @${cleanUsername} with role ${data.role}.`
  );

  return { success: true, user: newUser };
}

export async function updateAdminUserRole(id: string, role: string, isActive: boolean) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can modify team roles." };
  }

  const user = await prisma.adminUser.update({
    where: { id },
    data: {
      role,
      isActive,
    },
  });

  await recordAuditLog(
    "ROLE_CHANGED",
    "RBAC",
    `Updated @${user.username} role to ${role}, active status: ${isActive}.`
  );

  return { success: true };
}

export async function deleteAdminUser(id: string) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can remove team members." };
  }

  if (session.userId === id) {
    return { success: false, error: "You cannot delete your own active master account." };
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });

  await prisma.adminUser.delete({
    where: { id },
  });

  if (target) {
    await recordAuditLog("USER_DELETED", "RBAC", `Revoked and deleted team user @${target.username}.`);
  }

  return { success: true };
}

export async function updateAdminUserDetailsAction(data: {
  id: string;
  fullName: string;
  username: string;
  role: string;
  isActive: boolean;
  newPassword?: string;
}) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can update team credentials and roles." };
  }

  const cleanName = sanitizeInput(data.fullName);
  const cleanUsername = sanitizeInput(data.username).toLowerCase().replace(/[^a-z0-9_.-]/g, "");

  if (!cleanName || !cleanUsername) {
    return { success: false, error: "Full name and valid username are required." };
  }

  // Check username uniqueness if changed
  const existing = await prisma.adminUser.findUnique({
    where: { username: cleanUsername },
  });
  if (existing && existing.id !== data.id) {
    return { success: false, error: `Username @${cleanUsername} is already registered.` };
  }

  const updatePayload: {
    fullName: string;
    username: string;
    role: string;
    isActive: boolean;
    passwordHash?: string;
  } = {
    fullName: cleanName,
    username: cleanUsername,
    role: data.role,
    isActive: data.isActive,
  };

  if (data.newPassword && data.newPassword.trim().length >= 8) {
    updatePayload.passwordHash = await bcrypt.hash(data.newPassword.trim(), 10);
  }

  const updatedUser = await prisma.adminUser.update({
    where: { id: data.id },
    data: updatePayload,
  });

  await recordAuditLog(
    "USER_UPDATED",
    "RBAC",
    `Super Admin @${session.username} updated profile, role (${data.role}), and credentials for @${updatedUser.username}.`
  );

  return { success: true, user: updatedUser };
}

export async function resetAdminUserPassword(id: string, newPass: string) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can reset user passwords." };
  }

  if (newPass.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  const passwordHash = await bcrypt.hash(newPass, 10);
  const user = await prisma.adminUser.update({
    where: { id },
    data: { passwordHash },
  });

  await recordAuditLog("PASSWORD_RESET", "RBAC", `Reset credentials for user @${user.username}.`);

  return { success: true };
}

// ----------------- AUDIT & SECURITY LOG ARCHIVAL (IMMUTABLE LOGS) -----------------
export async function archiveAuditLogAction(logId: string) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can archive audit compliance records." };
  }

  await prisma.auditLog.update({
    where: { id: logId },
    data: { isArchived: true },
  });

  return { success: true };
}

export async function unarchiveAuditLogAction(logId: string) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can unarchive audit compliance records." };
  }

  await prisma.auditLog.update({
    where: { id: logId },
    data: { isArchived: false },
  });

  return { success: true };
}

export async function archiveSecurityEventAction(eventId: string) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can archive threat intelligence records." };
  }

  await prisma.securityEvent.update({
    where: { id: eventId },
    data: { isArchived: true },
  });

  return { success: true };
}

export async function unarchiveSecurityEventAction(eventId: string) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can unarchive threat intelligence records." };
  }

  await prisma.securityEvent.update({
    where: { id: eventId },
    data: { isArchived: false },
  });

  return { success: true };
}

export async function createAccessRequest(requestedRole: string, reason: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const req = await prisma.accessRequest.create({
    data: {
      userId: session.userId,
      username: session.username,
      currentRole: session.role || "SALES_LEAD",
      requestedRole,
      reason,
      status: "PENDING",
    },
  });

  await prisma.adminNotification.create({
    data: {
      type: "ACCESS_REQUEST",
      title: `Access Request: @${session.username}`,
      message: `Requested role upgrade to ${requestedRole}. Reason: ${reason}`,
      linkTab: "users",
    },
  });

  await recordAuditLog(
    "ACCESS_REQUESTED",
    "RBAC",
    `User @${session.username} requested ${requestedRole} access. Reason: "${reason}"`
  );

  return { success: true, request: req };
}

export async function reviewAccessRequest(requestId: string, status: "APPROVED" | "REJECTED") {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, error: "Only a Super Admin can approve access requests." };
  }

  const req = await prisma.accessRequest.findUnique({
    where: { id: requestId },
  });

  if (!req) return { success: false, error: "Request not found." };

  await prisma.accessRequest.update({
    where: { id: requestId },
    data: {
      status,
      reviewedBy: session.username,
    },
  });

  if (status === "APPROVED") {
    await prisma.adminUser.update({
      where: { id: req.userId },
      data: { role: req.requestedRole },
    });
  }

  await recordAuditLog(
    status === "APPROVED" ? "ACCESS_GRANTED" : "ACCESS_REJECTED",
    "RBAC",
    `Super Admin @${session.username} ${status.toLowerCase()} access request for @${req.username} to ${req.requestedRole}.`
  );

  return { success: true };
}

// ----------------- MULTI-CHANNEL LEAD MESSAGING -----------------
export async function sendLeadMessage(data: {
  inquiryId: string;
  channel: "WHATSAPP" | "EMAIL" | "PHONE";
  messageContent: string;
  subject?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const comm = await prisma.leadCommunication.create({
    data: {
      inquiryId: data.inquiryId,
      channel: data.channel,
      subject: data.subject,
      messageContent: data.messageContent,
      sentByAdmin: session.username,
    },
  });

  await recordAuditLog(
    "MESSAGE_DISPATCHED",
    "Inquiries CRM",
    `Sent ${data.channel} message to lead #${data.inquiryId}.`
  );

  return { success: true, communication: comm };
}

// ----------------- BOOKING / DISCOVERY CALLS -----------------
export async function createBooking(data: {
  name: string;
  email: string;
  phone?: string;
  meetingType: string;
  platform: string;
  bookingDate: string;
  bookingTime: string;
  timezone: string;
  topic: string;
  botTrap?: string;
}) {
  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";

    // 1. Honeypot check
    if (data.botTrap && data.botTrap.trim().length > 0) {
      await logSecurityThreat({
        type: "HONEYPOT_TRIGGER",
        details: `Spam bot triggered hidden honeypot on /book. Name: "${data.name}"`,
        ip,
      });
      return { success: true, bookingId: "bk_trap_" + Math.random().toString(36).substring(2, 6) };
    }

    // 2. Rate limiting check (max 5 bookings / 5 mins per IP)
    const allowed = checkRateLimit(ip, 5, 300000);
    if (!allowed) {
      return { success: false, error: "Booking submission rate limit exceeded. Please try again shortly." };
    }

    // 3. Input Sanitization
    const cleanName = sanitizeInput(data.name);
    const cleanEmail = sanitizeInput(data.email);
    const cleanPhone = sanitizeInput(data.phone);
    const cleanTopic = sanitizeInput(data.topic);

    if (!cleanName || !cleanEmail || !data.bookingDate || !data.bookingTime) {
      return { success: false, error: "Please complete all required appointment details." };
    }

    // Generate unique Google Meet URL
    const meetCode = `hpe-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
    const meetUrl = `https://meet.google.com/${meetCode}`;

    const booking = await prisma.booking.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        meetingType: data.meetingType,
        platform: data.platform || "Google Meet",
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        timezone: data.timezone || "IST (UTC+5:30)",
        topic: cleanTopic || "General Architecture Consultation",
        meetingLink: meetUrl,
        status: "CONFIRMED",
      },
    });

    // 4. Create Notification
    await prisma.adminNotification.create({
      data: {
        type: "BOOKING",
        title: `Discovery Call: ${cleanName}`,
        message: `${data.meetingType} booked for ${data.bookingDate} at ${data.bookingTime} (${data.timezone}).`,
        linkTab: "bookings",
      },
    });

    // 5. Record Audit
    await recordAuditLog("BOOKING_CREATED", "Bookings", `New call booked by ${cleanName} for ${data.bookingDate} ${data.bookingTime}.`);

    // 6. Dispatch Outbound Alert
    await dispatchOutboundAlert(
      "New Video Discovery Call Booked",
      `${cleanName} (${cleanEmail}) scheduled a ${data.meetingType} on ${data.bookingDate} at ${data.bookingTime} (${data.timezone}). Platform: ${data.platform || "Google Meet"}.`,
      { bookingId: booking.id, name: cleanName, date: data.bookingDate, time: data.bookingTime }
    );

    return { success: true, booking, meetUrl };
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, error: "Failed to schedule appointment." };
  }
}

export async function updateBookingStatus(id: string, status: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.booking.update({
    where: { id },
    data: { status },
  });

  await recordAuditLog("BOOKING_UPDATED", "Bookings", `Updated booking #${id} status to ${status}.`);
  return { success: true };
}

export async function deleteBooking(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.booking.delete({
    where: { id },
  });

  await recordAuditLog("BOOKING_DELETED", "Bookings", `Deleted booking #${id}.`);
  return { success: true };
}

// ----------------- GEMINI 2.0 FLASH DYNAMIC RAG CHATBOT -----------------
export async function chatWithAiAssistant(messages: Array<{ role: string; content: string }>) {
  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";

    // Rate limit chatbot requests (max 25 requests / min per IP)
    const allowed = checkRateLimit(`chat_${ip}`, 25, 60000);
    if (!allowed) {
      return {
        reply: "You have sent messages too quickly. Please pause for a moment before asking another question.",
      };
    }

    const org = await prisma.organization.findUnique({ where: { id: "default" } });
    const services = await prisma.serviceOffering.findMany({ select: { title: true, shortDescription: true, category: true } });
    const projects = await prisma.projectShowcase.findMany({ select: { title: true, metrics: true, category: true } });
    const faqs = await prisma.faqItem.findMany({ select: { question: true, answer: true } });

    const userLastMessage = messages[messages.length - 1]?.content || "";
    const cleanUserMsg = sanitizeInput(userLastMessage);

    // If Free Tier Gemini API Key is configured in Admin Settings
    if (org?.geminiApiKey && org.geminiApiKey.trim().length > 10) {
      const model = org.geminiModelName || "gemini-2.0-flash";
      const systemInstruction = org.geminiSystemPrompt ||
        "You are the Principal AI Architect of HP Edit Enterprise (www.hpedit.com), an elite engineering studio. Answer questions authoritatively, highlight our sub-100ms performance, 100% code IP ownership, and guide them to schedule a call at /book or chat on WhatsApp.";

      // Build live RAG Context
      const knowledgeContext = `
STUDIO CONTEXT:
- Name: ${org.name}
- Tagline: ${org.tagline}
- Phone/WhatsApp: ${org.whatsappNumber}
- Email: ${org.primaryEmail}
- Services Offered: ${services.map((s) => `${s.title} (${s.category}): ${s.shortDescription}`).join("; ")}
- Verified Case Studies: ${projects.map((p) => `${p.title}: ${p.metrics}`).join("; ")}
- Common FAQs: ${faqs.map((f) => `Q: ${f.question} A: ${f.answer}`).join("; ")}
- Discovery Booking URL: https://www.hpedit.com/book
`;

      const contents = [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\n${knowledgeContext}\n\nUser Question: ${cleanUserMsg}` }],
        },
      ];

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${org.geminiApiKey}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const generatedText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return { reply: generatedText };
        }
      }
    }

    // Smart Local Knowledge Engine Fallback (Instant Response)
    const lower = cleanUserMsg.toLowerCase();
    if (lower.includes("price") || lower.includes("cost") || lower.includes("estimate") || lower.includes("rate")) {
      return {
        reply: "Our project investments typically range from \$2,500 for rapid 2-week MVPs to \$15,000+ for hyper-scale multi-agent enterprise platforms. You can compute an exact real-time quote and download a branded PDF scope proposal on our interactive Estimator page (/estimator)!",
      };
    }
    if (lower.includes("book") || lower.includes("call") || lower.includes("meeting") || lower.includes("schedule")) {
      return {
        reply: "You can schedule a direct 15-minute Video Discovery Call with our Principal Architect on our booking portal (/book) or connect directly on WhatsApp!",
      };
    }
    if (lower.includes("service") || lower.includes("ai") || lower.includes("agent") || lower.includes("flutter")) {
      return {
        reply: "We architect 8 dedicated capabilities: Next.js 15 Web Platforms, Flutter Mobile Apps, Autonomous AI Agent Swarms (Claude 3.7 & Gemini 2.0), Meta WhatsApp Cloud API funnels, and ERP Automations. Check our full breakdown at /services!",
      };
    }
    if (lower.includes("time") || lower.includes("sprint") || lower.includes("fast")) {
      return {
        reply: "Our engineering sprints run in 2 to 3-week production cycles with working staging releases delivered every Friday and 100% full source code ownership handover on Day 1.",
      };
    }

    return {
      reply: `Hello! I am the HP Edit AI Architect. We build high-speed software, native mobile apps, and autonomous AI agents. How can I help you today? You can also schedule a discovery call at /book or chat on WhatsApp at ${org?.whatsappNumber || "+91 98765 43210"}.`,
    };
  } catch (error) {
    console.error("AI assistant error:", error);
    return {
      reply: "I am ready to help. You can explore our services at /services, calculate pricing at /estimator, or schedule a video call at /book!",
    };
  }
}

// ----------------- INQUIRIES & APPLICATIONS -----------------
export async function submitInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  projectBudget?: string;
  timeline?: string;
  message?: string;
  painPoints?: string[];
  botTrap?: string; // Honeypot
}) {
  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";

    // 1. Honeypot check
    if (data.botTrap && data.botTrap.trim().length > 0) {
      await logSecurityThreat({
        type: "HONEYPOT_TRIGGER",
        details: `Spam bot triggered hidden honeypot field. Name entered: "${data.name}"`,
        ip,
      });

      await prisma.adminNotification.create({
        data: {
          type: "THREAT",
          title: "Bot Honeypot Trap Defused",
          message: `Spam bot attempt from IP ${ip.substring(0, 8)}... was intercepted.`,
          linkTab: "threats",
        },
      });

      return { success: true, inquiryId: "trap_" + Math.random().toString(36).substring(2, 7) };
    }

    // 2. Rate limiting check
    const allowed = checkRateLimit(ip, 5, 300000);
    if (!allowed) {
      await logSecurityThreat({
        type: "RATE_LIMIT_BLOCKED",
        details: `Rate limit threshold exceeded for IP: ${ip}`,
        ip,
      });

      await prisma.adminNotification.create({
        data: {
          type: "THREAT",
          title: "Rate Limit Violation Blocked",
          message: `Excessive submissions blocked from IP ${ip.substring(0, 8)}...`,
          linkTab: "threats",
        },
      });

      return { success: false, error: "Submission rate limit exceeded. Please wait a few moments before trying again." };
    }

    // 3. Sanitize inputs
    const cleanName = sanitizeInput(data.name);
    const cleanEmail = sanitizeInput(data.email);
    const cleanPhone = sanitizeInput(data.phone);
    const cleanService = sanitizeInput(data.serviceType);
    const cleanBudget = sanitizeInput(data.projectBudget);
    const cleanTimeline = sanitizeInput(data.timeline);
    
    // Process pain points
    const validPainPoints = (data.painPoints || [])
      .map((p) => sanitizeInput(p).trim())
      .filter((p) => p.length > 0);

    let assembledMessage = "";
    if (validPainPoints.length > 0) {
      assembledMessage += `🎯 IDENTIFIED OPERATIONAL PAIN POINTS (${validPainPoints.length}):\n` +
        validPainPoints.map((p, idx) => `• [Point ${idx + 1}] ${p}`).join("\n") + "\n\n";
    }

    if (data.message && sanitizeInput(data.message).trim()) {
      assembledMessage += `📝 ADDITIONAL SCOPE & CONTEXT:\n` + sanitizeInput(data.message).trim();
    }

    const cleanMessage = assembledMessage.trim();

    if (!cleanName || !cleanEmail || (!cleanMessage && validPainPoints.length === 0)) {
      return { success: false, error: "Please provide valid contact information and at least one pain point or project requirement." };
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        serviceType: cleanService,
        projectBudget: cleanBudget,
        timeline: cleanTimeline,
        message: cleanMessage || "Discovery consultation requested.",
        status: "NEW",
      },
    });

    // 4. Create Admin Notification
    await prisma.adminNotification.create({
      data: {
        type: "LEAD",
        title: `New Lead: ${cleanName}`,
        message: `Requested ${cleanService} (${validPainPoints.length > 0 ? `${validPainPoints.length} pain points listed` : cleanBudget || "Custom scope"}).`,
        linkTab: "inquiries",
      },
    });

    // 5. Dispatch Outbound Alert (Webhook / WhatsApp)
    const alertPainPointSummary = validPainPoints.length > 0
      ? ` [${validPainPoints.length} Pain Points: ${validPainPoints.slice(0, 2).join("; ")}${validPainPoints.length > 2 ? "..." : ""}]`
      : "";

    await dispatchOutboundAlert(
      "New Project Discovery Lead",
      `${cleanName} (${cleanEmail} / ${cleanPhone || "No phone"}) requested ${cleanService}.${alertPainPointSummary} Budget: ${cleanBudget || "Custom"}. Target: ${cleanTimeline || "Standard"}.`,
      { inquiryId: inquiry.id, name: cleanName, email: cleanEmail, service: cleanService, painPointsCount: validPainPoints.length }
    );

    // 6. Log telemetry activity
    await logVisitorEvent({
      eventType: "FORM_SUBMIT",
      path: "/contact",
      details: { service: cleanService, budget: cleanBudget, painPointsCount: validPainPoints.length },
      ip,
    });

    return { success: true, inquiryId: inquiry.id };
  } catch (error) {
    console.error("Inquiry error:", error);
    return { success: false, error: "Failed to submit inquiry." };
  }
}

// ----------------- 1-CLICK AI PROPOSAL GENERATOR -----------------
export async function generateAiProposalDraft(data: {
  inquiryId?: string;
  name: string;
  serviceType: string;
  painPoints: string[];
  message: string;
  budget?: string;
  timeline?: string;
}) {
  try {
    const org = await prisma.organization.findUnique({ where: { id: "default" } });
    const painPointsList = data.painPoints || [];
    const painPointsText = painPointsList.length > 0
      ? painPointsList.map((p, i) => `${i + 1}. ${p}`).join("\n")
      : "Standard digital transformation and performance optimization.";

    const prompt = `You are the Principal Solutions Architect at HP Edit Enterprise (www.hpedit.com), Kolkata, India.
Generate a comprehensive, executive-level Architectural Scoping & Solution Proposal for a prospective client.

CLIENT DETAILS:
- Client Name / Company: ${data.name}
- Requested Domain: ${data.serviceType}
- Target Budget: ${data.budget || "Enterprise Scope"}
- Target Timeline: ${data.timeline || "3-6 Weeks"}
- Specific Operational Pain Points & Bottlenecks:
${painPointsText}
- Additional Client Requirements:
${data.message || "None specified"}

PROPOSAL STRUCTURE REQUIREMENTS:
Format the output in clear, professional Markdown with these exact sections:
1. # HP EDIT ENTERPRISE — ARCHITECTURAL SOLUTION BLUEPRINT
2. ## 1. EXECUTIVE DIAGNOSIS & SCOPE OF ENGAGEMENT (Summarize client's core problem statement and how HP Edit will resolve it)
3. ## 2. PROPOSED SYSTEM ARCHITECTURE & TECH STACK (Recommend exact stack e.g., Next.js 15, FastAPI, PostgreSQL, pgvector, Redis, Meta WhatsApp Cloud API)
4. ## 3. SPRINT PHASES & EXECUTION MILESTONES (Breakdown into 3-4 structured sprints with deliverables)
5. ## 4. NON-FUNCTIONAL PERFORMANCE & SECURITY SLAS (Sub-100ms TTFB, 99.99% uptime, 100% Perpetual IP Ownership Handover)
6. ## 5. INVESTMENT & HANDOVER TERMS (Recommended budget tier and milestone payment structure: 40% Kickoff / 30% Alpha / 30% Handover)

Tone: Authoritative, elite engineering, concise, and structured.`;

    if (org?.geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${org.geminiModelName || "gemini-2.0-flash"}:generateContent?key=${org.geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 2048 },
            }),
          }
        );

        if (response.ok) {
          const resJson = await response.json();
          const generated = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generated) {
            return { success: true, proposalMarkdown: generated };
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, using deterministic high-precision template fallback", err);
      }
    }

    // Deterministic High-Precision Template Fallback
    const fallbackProposal = `# HP EDIT ENTERPRISE — ARCHITECTURAL SOLUTION BLUEPRINT
**Prepared for:** ${data.name}
**Domain:** ${data.serviceType} | **Target Horizon:** ${data.timeline || "4-6 Weeks"}
**Investment Tier:** ${data.budget || "Fixed Enterprise Scope"}
**Architectural Lead:** Principal Systems Architect, HP Edit Enterprise (Kolkata HQ)

---

## 1. EXECUTIVE DIAGNOSIS & SCOPE OF ENGAGEMENT
HP Edit Enterprise has completed preliminary architectural diagnosis for **${data.name}**. Based on the identified operational friction points:
${painPointsList.length > 0 ? painPointsList.map((p, i) => `* **Bottleneck ${i + 1}:** ${p}`).join("\n") : "* Core operational workflow modernization and scalability upgrade."}

**Prescribed Architectural Remedy:**
We prescribe deploying an isolated, high-velocity sprint cluster executing a modern **${data.serviceType}** platform. This directly eliminates manual operational bottlenecks, guarantees sub-100ms response latencies, and transfers 100% intellectual property ownership upon milestone handover.

---

## 2. PROPOSED PRODUCTION STACK & PROTOCOLS
* **Frontend Experience:** Next.js 15 (App Router, Server Actions, Tailwind CSS, 120Hz micro-interactions).
* **Backend & Automation Engine:** FastAPI / Node.js TypeScript Microservices with isolated asynchronous job workers.
* **Data Tier & Cache:** Managed PostgreSQL (connection-pooled) + Redis In-Memory Cache.
* **Integrations:** Meta Cloud WhatsApp API / Secure Stripe & Razorpay Webhooks.
* **Hosting & CI/CD:** Dockerized Container Clustered Deployment on AWS / Vercel Edge with automated zero-downtime rollouts.

---

## 3. SPRINT PHASES & EXECUTION MILESTONES
* **Sprint 1 (Week 1–2): Core System Blueprint & Infrastructure Setup**
  * Finalized DB schema, bilateral NDA counter-signatures, core API scaffold, and staging CI/CD pipeline.
* **Sprint 2 (Week 3–4): Feature Implementation & Diagnostic Remediation**
  * Full integration of automated workflows, pain-point remediation engines, and live staging dashboard.
* **Sprint 3 (Week 5–6): Security Hardening, QA & Perpetual IP Handover**
  * Load testing (> 10,000 req/min), automated penetration audit, production DNS cutover, and 100% source repository transfer.

---

## 4. SECURITY, SLAS & COMPLIANCE
* **Performance:** Sub-100ms average API response time; 99.99% availability SLA.
* **Confidentiality:** 100% Perpetual IP ownership transfer, bilateral Mutual NDA, zero client training on public AI models.
* **Warranty:** 30 days of post-handover priority warranty and production telemetry monitoring.

---

## 5. INVESTMENT & PAYMENT MILESTONES
* **Target Budget Range:** ${data.budget || "$3,000 - $8,000 (Fixed Milestone Contract)"}
* **Milestone Structure:**
  * **40% Kickoff Deposit:** Commences Sprint 1 & infrastructure provisioning.
  * **30% Alpha Staging Sign-Off:** Reviewable functional build on private staging domain.
  * **30% Final Production Handover:** Full GitHub repo transfer, DNS deployment & documentation.

---
*HP Edit Enterprise | ST 24, Awfis 4th Floor, Siddha Esplanade, Kolkata - 700013 | info@hpedit.com*`;

    return { success: true, proposalMarkdown: fallbackProposal };
  } catch (error) {
    console.error("Error generating proposal:", error);
    return { success: false, error: "Failed to generate AI proposal draft." };
  }
}

export async function submitJobApplication(data: {
  name: string;
  email: string;
  phone?: string;
  roleTitle: string;
  portfolioUrl?: string;
  githubUrl?: string;
  resumeNotes?: string;
}) {
  try {
    const cleanName = sanitizeInput(data.name);
    const cleanEmail = sanitizeInput(data.email);
    const cleanPhone = sanitizeInput(data.phone);
    const cleanRole = sanitizeInput(data.roleTitle);
    const cleanPortfolio = sanitizeInput(data.portfolioUrl);
    const cleanGithub = sanitizeInput(data.githubUrl);
    const cleanResume = sanitizeInput(data.resumeNotes);

    if (!cleanName || !cleanEmail || !cleanRole) {
      return { success: false, error: "Please provide your name, email, and role." };
    }

    const app = await prisma.jobApplication.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        roleTitle: cleanRole,
        portfolioUrl: cleanPortfolio,
        githubUrl: cleanGithub,
        resumeNotes: cleanResume,
        status: "REVIEW",
      },
    });

    await prisma.adminNotification.create({
      data: {
        type: "APPLICANT",
        title: `Job Applicant: ${cleanName}`,
        message: `Applied for ${cleanRole}.`,
        linkTab: "applications",
      },
    });

    await dispatchOutboundAlert(
      "New Engineering Job Application",
      `${cleanName} (${cleanEmail}) applied for ${cleanRole}. Portfolio: ${cleanPortfolio || "N/A"}, GitHub: ${cleanGithub || "N/A"}.`,
      { applicationId: app.id, name: cleanName, role: cleanRole }
    );

    return { success: true, applicationId: app.id };
  } catch {
    return { success: false, error: "Failed to submit application." };
  }
}

export async function updateInquiryStatus(id: string, status: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.inquiry.update({
    where: { id },
    data: { status },
  });

  await recordAuditLog("INQUIRY_STATUS_CHANGED", "Inquiries CRM", `Updated status of lead #${id} to ${status}.`);

  return { success: true };
}

export async function deleteInquiry(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.inquiry.delete({
    where: { id },
  });

  await recordAuditLog("INQUIRY_DELETED", "Inquiries CRM", `Deleted lead #${id}.`);

  return { success: true };
}

export async function updateApplicationStatus(id: string, status: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.jobApplication.update({
    where: { id },
    data: { status },
  });

  await recordAuditLog("APPLICATION_STATUS_CHANGED", "Careers", `Updated status of applicant #${id} to ${status}.`);

  return { success: true };
}

export async function deleteApplication(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.jobApplication.delete({
    where: { id },
  });

  await recordAuditLog("APPLICATION_DELETED", "Careers", `Deleted application #${id}.`);

  return { success: true };
}

// ----------------- SERVICES CRUD -----------------
export async function upsertService(data: Partial<ServiceData>) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  if (data.id) {
    await prisma.serviceOffering.update({
      where: { id: data.id },
      data: {
        title: data.title!,
        slug: data.slug!,
        shortDescription: data.shortDescription!,
        fullDescription: data.fullDescription!,
        category: data.category!,
        icon: data.icon || "Globe",
        features: data.features || "[]",
        order: data.order ?? 0,
        isFeatured: data.isFeatured ?? true,
        isActive: data.isActive ?? true,
      },
    });
    await recordAuditLog("SERVICE_UPDATED", "Services", `Updated capability '${data.title}'.`);
  } else {
    await prisma.serviceOffering.create({
      data: {
        title: data.title!,
        slug: data.slug || data.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        shortDescription: data.shortDescription!,
        fullDescription: data.fullDescription!,
        category: data.category || "Web & Cloud",
        icon: data.icon || "Globe",
        features: data.features || "[]",
        order: data.order ?? 0,
        isFeatured: data.isFeatured ?? true,
        isActive: data.isActive ?? true,
      },
    });
    await recordAuditLog("SERVICE_CREATED", "Services", `Created new capability '${data.title}'.`);
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function reorderServicesAction(orderedIds: string[]) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Perform sequential update for each item in new order
  for (let i = 0; i < orderedIds.length; i++) {
    await prisma.serviceOffering.update({
      where: { id: orderedIds[i] },
      data: { order: i + 1 },
    });
  }

  await recordAuditLog(
    "SERVICES_REORDERED",
    "Services",
    `Reordered ${orderedIds.length} service offerings via drag-and-drop / ordering tool.`
  );

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function toggleServiceVisibilityAction(id: string, isActive: boolean) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const s = await prisma.serviceOffering.update({
    where: { id },
    data: { isActive },
  });

  await recordAuditLog(
    "SERVICE_VISIBILITY_TOGGLED",
    "Services",
    `Set visibility of service '${s.title}' to ${isActive ? "PUBLISHED (Visible)" : "HIDDEN"}.`
  );

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/dashboard");
  return { success: true, isActive: s.isActive };
}

export async function deleteService(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const target = await prisma.serviceOffering.findUnique({ where: { id } });
  await prisma.serviceOffering.delete({
    where: { id },
  });

  if (target) {
    await recordAuditLog("SERVICE_DELETED", "Services", `Deleted capability '${target.title}'.`);
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

// ----------------- PROJECTS CRUD -----------------
export async function upsertProject(data: Partial<ProjectData>) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  if (data.id) {
    await prisma.projectShowcase.update({
      where: { id: data.id },
      data: {
        title: data.title!,
        client: data.client!,
        category: data.category!,
        description: data.description!,
        metrics: data.metrics!,
        techStack: data.techStack || "[]",
        demoUrl: data.demoUrl,
        featured: data.featured ?? true,
        order: data.order ?? 0,
      },
    });
    await recordAuditLog("PROJECT_UPDATED", "Projects", `Updated case study '${data.title}'.`);
  } else {
    await prisma.projectShowcase.create({
      data: {
        title: data.title!,
        client: data.client!,
        category: data.category!,
        description: data.description!,
        metrics: data.metrics!,
        techStack: data.techStack || "[]",
        demoUrl: data.demoUrl,
        featured: data.featured ?? true,
        order: data.order ?? 0,
      },
    });
    await recordAuditLog("PROJECT_CREATED", "Projects", `Created new case study '${data.title}'.`);
  }

  revalidatePath("/");
  revalidatePath("/case-studies");
  return { success: true };
}

export async function deleteProject(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const target = await prisma.projectShowcase.findUnique({ where: { id } });
  await prisma.projectShowcase.delete({
    where: { id },
  });

  if (target) {
    await recordAuditLog("PROJECT_DELETED", "Projects", `Deleted case study '${target.title}'.`);
  }

  revalidatePath("/");
  revalidatePath("/case-studies");
  return { success: true };
}

// ----------------- BLOG CRUD -----------------
export async function upsertBlog(data: Partial<BlogPostData>) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  if (data.id) {
    await prisma.blogPost.update({
      where: { id: data.id },
      data: {
        title: data.title!,
        slug: data.slug!,
        excerpt: data.excerpt!,
        content: data.content!,
        coverImage: data.coverImage,
        authorName: data.authorName || "HP Edit Engineering Team",
        authorRole: data.authorRole,
        authorAvatar: data.authorAvatar,
        tags: data.tags || "[]",
        readTime: data.readTime || "4 min read",
        published: data.published ?? true,
        order: data.order ?? 0,
      },
    });
    await recordAuditLog("BLOG_UPDATED", "Blogs", `Updated research post '${data.title}'.`);
  } else {
    await prisma.blogPost.create({
      data: {
        title: data.title!,
        slug: data.slug || data.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        excerpt: data.excerpt!,
        content: data.content!,
        coverImage: data.coverImage,
        authorName: data.authorName || "HP Edit Engineering Team",
        authorRole: data.authorRole,
        authorAvatar: data.authorAvatar,
        tags: data.tags || "[]",
        readTime: data.readTime || "4 min read",
        published: data.published ?? true,
        order: data.order ?? 0,
      },
    });
    await recordAuditLog("BLOG_CREATED", "Blogs", `Created research post '${data.title}'.`);
  }

  revalidatePath("/");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlog(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const target = await prisma.blogPost.findUnique({ where: { id } });
  await prisma.blogPost.delete({
    where: { id },
  });

  if (target) {
    await recordAuditLog("BLOG_DELETED", "Blogs", `Deleted research post '${target.title}'.`);
  }

  revalidatePath("/");
  revalidatePath("/blog");
  return { success: true };
}

export async function upsertBlogPost(data: Partial<BlogPostData>) {
  return upsertBlog(data);
}

export async function deleteBlogPost(id: string) {
  return deleteBlog(id);
}

// ----------------- TEAM CRUD -----------------
export async function upsertTeamMember(data: Partial<TeamMemberData>) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  if (data.id) {
    await prisma.teamMember.update({
      where: { id: data.id },
      data: {
        name: data.name!,
        designation: data.designation!,
        bio: data.bio!,
        photoUrl: data.photoUrl,
        email: data.email,
        phone: data.phone,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        twitterUrl: data.twitterUrl,
        order: data.order ?? 0,
        active: data.active ?? true,
      },
    });
    await recordAuditLog("TEAM_UPDATED", "Team", `Updated team profile for '${data.name}'.`);
  } else {
    await prisma.teamMember.create({
      data: {
        name: data.name!,
        designation: data.designation!,
        bio: data.bio!,
        photoUrl: data.photoUrl,
        email: data.email,
        phone: data.phone,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
        twitterUrl: data.twitterUrl,
        order: data.order ?? 0,
        active: data.active ?? true,
      },
    });
    await recordAuditLog("TEAM_CREATED", "Team", `Added team member '${data.name}'.`);
  }

  revalidatePath("/");
  revalidatePath("/team");
  return { success: true };
}

export async function deleteTeamMember(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const target = await prisma.teamMember.findUnique({ where: { id } });
  await prisma.teamMember.delete({
    where: { id },
  });

  if (target) {
    await recordAuditLog("TEAM_DELETED", "Team", `Removed team member '${target.name}'.`);
  }

  revalidatePath("/");
  revalidatePath("/team");
  return { success: true };
}

// ----------------- FAQ CRUD -----------------
export async function upsertFaq(data: Partial<FaqData>) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  if (data.id) {
    await prisma.faqItem.update({
      where: { id: data.id },
      data: {
        question: data.question!,
        answer: data.answer!,
        category: data.category || "General",
        order: data.order ?? 0,
      },
    });
    await recordAuditLog("FAQ_UPDATED", "FAQs", `Updated FAQ item #${data.id}.`);
  } else {
    await prisma.faqItem.create({
      data: {
        question: data.question!,
        answer: data.answer!,
        category: data.category || "General",
        order: data.order ?? 0,
      },
    });
    await recordAuditLog("FAQ_CREATED", "FAQs", `Added new FAQ item.`);
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteFaq(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.faqItem.delete({
    where: { id },
  });

  await recordAuditLog("FAQ_DELETED", "FAQs", `Deleted FAQ item #${id}.`);

  revalidatePath("/");
  return { success: true };
}

export async function updateAdminPassword(currentPass: string, newPass: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const user = await prisma.adminUser.findUnique({
    where: { id: session.userId },
  });

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(currentPass, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect." };
  }

  if (newPass.length < 8) {
    return { success: false, error: "New password must be at least 8 characters." };
  }

  const newHash = await bcrypt.hash(newPass, 10);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash: newHash },
  });

  await recordAuditLog("PASSWORD_CHANGED", "Security", `Admin @${user.username} updated their master password.`);

  return { success: true };
}

// ----------------- CLIENT PORTAL & MILESTONES ACTIONS -----------------

export async function lookupClientProject(codeOrEmail: string) {
  try {
    const clean = codeOrEmail.trim();
    if (!clean) return { success: false, error: "Please enter a valid project reference code or email." };

    const project = await prisma.clientProject.findFirst({
      where: {
        OR: [
          { projectCode: { equals: clean } },
          { clientEmail: { equals: clean.toLowerCase() } },
        ],
      },
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!project) {
      return {
        success: false,
        error: `No active project found matching "${clean}". Please verify your Project Code (e.g. HPE-7849) or contact your engineering lead.`,
      };
    }

    return {
      success: true,
      project: project as unknown as ClientProjectData,
    };
  } catch (error) {
    console.error("Error looking up client project:", error);
    return { success: false, error: "An unexpected error occurred during project verification." };
  }
}

export async function signOffClientMilestone(
  projectId: string,
  milestoneId: string,
  clientName: string,
  signOffNotes: string = ""
) {
  try {
    if (!clientName.trim()) {
      return { success: false, error: "Authorized client name is required for digital sign-off." };
    }

    const milestone = await prisma.projectMilestone.findUnique({
      where: { id: milestoneId },
      include: { project: true },
    });

    if (!milestone || milestone.projectId !== projectId) {
      return { success: false, error: "Milestone not found." };
    }

    // Update milestone to completed & signed off
    await prisma.projectMilestone.update({
      where: { id: milestoneId },
      data: {
        status: "COMPLETED",
        signedOffByClient: true,
        signOffClientName: clientName.trim(),
        signOffNotes: signOffNotes.trim(),
        signOffDate: new Date(),
        completedAt: new Date(),
      },
    });

    // Recompute project overall progress percentage
    const allMilestones = await prisma.projectMilestone.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
    });

    const completedCount = allMilestones.filter((m) => m.status === "COMPLETED").length;
    const progressPercent = Math.round((completedCount / allMilestones.length) * 100);

    const isAllCompleted = completedCount === allMilestones.length;

    await prisma.clientProject.update({
      where: { id: projectId },
      data: {
        progressPercent,
        status: isAllCompleted ? "COMPLETED" : "IN_PROGRESS",
        completedDate: isAllCompleted ? new Date().toISOString().split("T")[0] : null,
      },
    });

    // Send admin notification & outbound alert
    await prisma.adminNotification.create({
      data: {
        type: "SYSTEM",
        title: `Milestone Signed Off: ${milestone.title}`,
        message: `Client ${clientName} officially signed off milestone "${milestone.title}" for ${milestone.project.title} (${milestone.project.projectCode}). Notes: ${signOffNotes || "None"}`,
        linkTab: "client-projects",
      },
    });

    await dispatchOutboundAlert(
      `Milestone Sign-Off: ${milestone.project.projectCode}`,
      `Client ${clientName} digitally signed off milestone "${milestone.title}". Project progress is now ${progressPercent}%.`,
      {
        projectCode: milestone.project.projectCode,
        milestoneTitle: milestone.title,
        clientName,
        progressPercent,
      }
    );

    revalidatePath("/portal");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: `Milestone "${milestone.title}" successfully approved and recorded!`,
    };
  } catch (error) {
    console.error("Error signing off milestone:", error);
    return { success: false, error: "Failed to sign off milestone." };
  }
}

export async function getAllClientProjects() {
  try {
    const session = await getSession();
    if (!session) return [];

    const projects = await prisma.clientProject.findMany({
      include: {
        milestones: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return projects as unknown as ClientProjectData[];
  } catch (e) {
    console.error("Error fetching client projects:", e);
    return [];
  }
}

export async function createClientProjectAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const projectCode = (formData.get("projectCode") as string)?.trim() || "HPE-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  const clientName = formData.get("clientName") as string;
  const clientEmail = (formData.get("clientEmail") as string)?.toLowerCase();
  const clientCompany = formData.get("clientCompany") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tier = (formData.get("tier") as string) || "Enterprise Sprint";
  const status = (formData.get("status") as string) || "IN_PROGRESS";
  const progressPercent = parseInt(formData.get("progressPercent") as string) || 0;
  const stagingUrl = formData.get("stagingUrl") as string;
  const figmaUrl = formData.get("figmaUrl") as string;
  const repoUrl = formData.get("repoUrl") as string;
  const targetDelivery = formData.get("targetDelivery") as string;

  const project = await prisma.clientProject.create({
    data: {
      projectCode,
      clientName,
      clientEmail,
      clientCompany,
      title,
      description,
      tier,
      status,
      progressPercent,
      stagingUrl,
      figmaUrl,
      repoUrl,
      startDate: new Date().toISOString().split("T")[0],
      targetDelivery,
    },
  });

  await recordAuditLog("PROJECT_CREATED", "ClientPortal", `Created Client Project ${projectCode} (${title}) for ${clientName}.`);

  revalidatePath("/admin/dashboard");
  revalidatePath("/portal");
  return { success: true, project };
}

export async function updateClientProjectAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const clientName = formData.get("clientName") as string;
  const clientEmail = (formData.get("clientEmail") as string)?.toLowerCase();
  const clientCompany = formData.get("clientCompany") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tier = formData.get("tier") as string;
  const status = formData.get("status") as string;
  const progressPercent = parseInt(formData.get("progressPercent") as string) || 0;
  const stagingUrl = formData.get("stagingUrl") as string;
  const figmaUrl = formData.get("figmaUrl") as string;
  const repoUrl = formData.get("repoUrl") as string;
  const targetDelivery = formData.get("targetDelivery") as string;

  await prisma.clientProject.update({
    where: { id },
    data: {
      clientName,
      clientEmail,
      clientCompany,
      title,
      description,
      tier,
      status,
      progressPercent,
      stagingUrl,
      figmaUrl,
      repoUrl,
      targetDelivery,
    },
  });

  await recordAuditLog("PROJECT_UPDATED", "ClientPortal", `Updated Client Project #${id} (${title}).`);

  revalidatePath("/admin/dashboard");
  revalidatePath("/portal");
  return { success: true };
}

export async function deleteClientProjectAction(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.clientProject.delete({ where: { id } });
  await recordAuditLog("PROJECT_DELETED", "ClientPortal", `Deleted Client Project #${id}.`);

  revalidatePath("/admin/dashboard");
  revalidatePath("/portal");
  return { success: true };
}

export async function addProjectMilestoneAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const projectId = formData.get("projectId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const deliverables = formData.get("deliverables") as string;
  const status = (formData.get("status") as string) || "PENDING";
  const targetDate = formData.get("targetDate") as string;
  const order = parseInt(formData.get("order") as string) || 0;

  await prisma.projectMilestone.create({
    data: {
      projectId,
      title,
      description,
      deliverables,
      status,
      targetDate,
      order,
    },
  });

  await recordAuditLog("MILESTONE_CREATED", "ClientPortal", `Added milestone "${title}" to project #${projectId}.`);

  revalidatePath("/admin/dashboard");
  revalidatePath("/portal");
  return { success: true };
}

export async function deleteProjectMilestoneAction(milestoneId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.projectMilestone.delete({ where: { id: milestoneId } });
  await recordAuditLog("MILESTONE_DELETED", "ClientPortal", `Deleted milestone #${milestoneId}.`);

  revalidatePath("/admin/dashboard");
  revalidatePath("/portal");
  return { success: true };
}

// ----------------- FEATURE TOGGLES & SECTION MANAGEMENT -----------------
export async function updateFeatureTogglesAction(toggles: Record<string, boolean>) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const togglesJson = JSON.stringify(toggles);

  await prisma.organization.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      featureToggles: togglesJson,
    },
    update: {
      featureToggles: togglesJson,
    },
  });

  await recordAuditLog(
    "FEATURE_TOGGLES_UPDATED",
    "SiteConfiguration",
    `Updated granular site section toggles (${Object.keys(toggles).length} items configured).`
  );

  revalidatePath("/");
  revalidatePath("/admin/dashboard");
  revalidatePath("/architecture");
  revalidatePath("/ai-lab");
  revalidatePath("/scorecard");
  return { success: true };
}

// ----------------- CRM KANBAN PIPELINE STAGE UPDATE -----------------
export async function updateInquiryPipelineStageAction(inquiryId: string, pipelineStage: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: {
      pipelineStage,
      status: pipelineStage === "CLOSED_WON" ? "CONVERTED" : pipelineStage === "ARCHIVED" ? "ARCHIVED" : "IN_PROGRESS",
    },
  });

  await recordAuditLog(
    "PIPELINE_STAGE_UPDATED",
    "CRM",
    `Moved inquiry #${inquiryId.slice(-6)} to stage "${pipelineStage}".`
  );

  revalidatePath("/admin/dashboard");
  return { success: true };
}

// ----------------- CLIENT PORTAL MILESTONE SIGN-OFF & REVISION -----------------
export async function approveProjectMilestoneAction(milestoneId: string, clientName: string, notes?: string) {
  const milestone = await prisma.projectMilestone.update({
    where: { id: milestoneId },
    data: {
      status: "COMPLETED",
      signedOffByClient: true,
      signOffClientName: clientName,
      signOffNotes: notes || "Approved by client via Portal",
      signOffDate: new Date(),
      completedAt: new Date(),
    },
    include: { project: true },
  });

  // Calculate new project progress percentage
  const allMilestones = await prisma.projectMilestone.findMany({
    where: { projectId: milestone.projectId },
  });
  const completedCount = allMilestones.filter((m) => m.status === "COMPLETED").length;
  const newPercent = Math.round((completedCount / allMilestones.length) * 100);

  await prisma.clientProject.update({
    where: { id: milestone.projectId },
    data: { progressPercent: newPercent },
  });

  // Admin Notification
  await prisma.adminNotification.create({
    data: {
      type: "SYSTEM",
      title: "Client Approved Milestone",
      message: `${clientName} approved deliverable "${milestone.title}" for ${milestone.project.title}.`,
      linkTab: "projects",
    },
  });

  await recordAuditLog(
    "MILESTONE_APPROVED",
    "ClientPortal",
    `Client "${clientName}" approved milestone "${milestone.title}".`
  );

  revalidatePath("/portal");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function requestProjectMilestoneRevisionAction(milestoneId: string, feedback: string) {
  const milestone = await prisma.projectMilestone.update({
    where: { id: milestoneId },
    data: {
      status: "REVIEW",
      clientFeedback: feedback,
    },
    include: { project: true },
  });

  await prisma.adminNotification.create({
    data: {
      type: "SYSTEM",
      title: "Milestone Revision Requested",
      message: `Revision requested on "${milestone.title}" for project ${milestone.project.title}: "${feedback.slice(0, 80)}..."`,
      linkTab: "projects",
    },
  });

  await recordAuditLog(
    "MILESTONE_REVISION_REQUESTED",
    "ClientPortal",
    `Client requested revision on milestone "${milestone.title}".`
  );

  revalidatePath("/portal");
  revalidatePath("/admin/dashboard");
  return { success: true };
}

export async function updateProjectMilestoneInvoiceAction(
  milestoneId: string,
  invoiceAmount: string,
  invoiceStatus: string,
  paymentLink?: string
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.projectMilestone.update({
    where: { id: milestoneId },
    data: {
      invoiceAmount,
      invoiceStatus,
      paymentLink: paymentLink || null,
    },
  });

  await recordAuditLog(
    "MILESTONE_INVOICE_UPDATED",
    "Billing",
    `Updated invoice for milestone #${milestoneId.slice(-6)}: ${invoiceAmount} (${invoiceStatus}).`
  );

  revalidatePath("/portal");
  revalidatePath("/admin/dashboard");
  return { success: true };
}


