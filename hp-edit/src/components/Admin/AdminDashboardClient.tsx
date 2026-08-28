"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import AdminDashboardTabs from "./AdminDashboardTabs";
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

interface AdminDashboardClientProps {
  username: string;
  userRole: string;
  currentUserId: string;
  organization: OrganizationData;
  services: ServiceData[];
  projects: ProjectData[];
  inquiries: InquiryData[];
  bookings: BookingData[];
  applications: JobApplicationData[];
  blogs: BlogPostData[];
  team: TeamMemberData[];
  faqs: FaqData[];
  activities: VisitorActivityData[];
  threats: SecurityEventData[];
  users: AdminUserData[];
  logs: AuditLogData[];
  accessRequests: AccessRequestData[];
  notifications: AdminNotificationData[];
  clientProjects?: ClientProjectData[];
}

export default function AdminDashboardClient({
  username,
  userRole,
  currentUserId,
  organization,
  services,
  projects,
  inquiries,
  bookings,
  applications,
  blogs,
  team,
  faqs,
  activities,
  threats,
  users,
  logs,
  accessRequests,
  notifications,
  clientProjects = [],
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState("analytics");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const newInquiriesCount = inquiries.filter((i) => i.status === "NEW").length;
  const newBookingsCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const newAppsCount = applications.filter((a) => a.status === "REVIEW").length;
  const pendingRequestsCount = accessRequests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-cyber-950 text-gray-100 flex selection:bg-cyan-500 selection:text-black">
      {/* Enterprise Left Sidebar */}
      <AdminSidebar
        username={username}
        userRole={userRole}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        counts={{
          newInquiries: newInquiriesCount,
          newBookings: newBookingsCount,
          newApplications: newAppsCount,
          pendingRequests: pendingRequestsCount,
          activitiesCount: activities.length,
          threatsCount: threats.length,
          servicesCount: services.length,
          projectsCount: projects.length,
          blogsCount: blogs.length,
          teamCount: team.length,
          faqsCount: faqs.length,
          logsCount: logs.length,
          usersCount: users.length,
        }}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0 transition-all duration-300">
        {/* Top Bar with Breadcrumbs, Live Telemetry & Notifications */}
        <AdminTopBar
          activeTab={activeTab}
          notifications={notifications}
          onSelectTab={(tab) => setActiveTab(tab)}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          username={username}
          userRole={userRole}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboardTabs
            organization={organization}
            services={services}
            projects={projects}
            inquiries={inquiries}
            bookings={bookings}
            applications={applications}
            blogs={blogs}
            team={team}
            faqs={faqs}
            activities={activities}
            threats={threats}
            users={users}
            logs={logs}
            accessRequests={accessRequests}
            clientProjects={clientProjects}
            userRole={userRole}
            currentUserId={currentUserId}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />
        </main>
      </div>
    </div>
  );
}
