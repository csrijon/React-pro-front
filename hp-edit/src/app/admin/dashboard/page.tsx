import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "@/components/Admin/AdminDashboardClient";
import {
  OrganizationData,
  ServiceData,
  ProjectData,
  InquiryData,
  JobApplicationData,
  BlogPostData,
  TeamMemberData,
  FaqData,
  VisitorActivityData,
  SecurityEventData,
  AdminUserData,
  AdminNotificationData,
  AuditLogData,
  AccessRequestData,
  BookingData,
  ClientProjectData
} from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/admin");
  }

  let org = await prisma.organization.findUnique({
    where: { id: "default" },
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        id: "default",
        name: "HP Edit Enterprise",
        tagline: "Architecting Intelligent Software, AI Agents & Enterprise Systems",
        description: "We are an elite software engineering studio crafting high-speed web apps, mobile solutions, autonomous AI agents, enterprise automation pipelines, and WhatsApp growth engines.",
      },
    });
  }

  const services = await prisma.serviceOffering.findMany({
    orderBy: { order: "asc" },
  });

  const projects = await prisma.projectShowcase.findMany({
    orderBy: { order: "asc" },
  });

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const communications = await prisma.leadCommunication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const inquiriesWithComms = inquiries.map((inq) => ({
    ...inq,
    communications: communications.filter((c) => c.inquiryId === inq.id),
  }));

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });

  const applications = await prisma.jobApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const blogs = await prisma.blogPost.findMany({
    orderBy: { order: "asc" },
  });

  const team = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  const faqs = await prisma.faqItem.findMany({
    orderBy: { order: "asc" },
  });

  const activities = await prisma.visitorActivity.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  const threats = await prisma.securityEvent.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
  });

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      username: true,
      fullName: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const notifications = await prisma.adminNotification.findMany({
    take: 40,
    orderBy: { createdAt: "desc" },
  });

  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
  });

  const accessRequests = await prisma.accessRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const clientProjects = await prisma.clientProject.findMany({
    include: {
      milestones: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminDashboardClient
      username={session.username}
      userRole={session.role || "SUPER_ADMIN"}
      currentUserId={session.userId}
      organization={org as unknown as OrganizationData}
      services={services as unknown as ServiceData[]}
      projects={projects as unknown as ProjectData[]}
      inquiries={inquiriesWithComms as unknown as InquiryData[]}
      bookings={bookings as unknown as BookingData[]}
      applications={applications as unknown as JobApplicationData[]}
      blogs={blogs as unknown as BlogPostData[]}
      team={team as unknown as TeamMemberData[]}
      faqs={faqs as unknown as FaqData[]}
      activities={activities as unknown as VisitorActivityData[]}
      threats={threats as unknown as SecurityEventData[]}
      users={users as unknown as AdminUserData[]}
      logs={logs as unknown as AuditLogData[]}
      accessRequests={accessRequests as unknown as AccessRequestData[]}
      notifications={notifications as unknown as AdminNotificationData[]}
      clientProjects={clientProjects as unknown as ClientProjectData[]}
    />
  );
}
