"use client";

import { useState } from "react";
import {
  Building,
  Layers,
  Award,
  Inbox,
  Key,
  Palette,
  Share2,
  Compass,
  BookOpen,
  Users,
  HelpCircle,
  Globe,
  Briefcase,
  TrendingUp,
  Sparkles,
  BarChart3,
  Activity,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
  Calendar,
  Bot
} from "lucide-react";
import AnalyticsDashboard from "./AnalyticsDashboard";
import LiveActivityFeed from "./LiveActivityFeed";
import SecurityThreatsFeed from "./SecurityThreatsFeed";
import OrgSettingsForm from "./OrgSettingsForm";
import ThemeCustomizer from "./ThemeCustomizer";
import SocialsManager from "./SocialsManager";
import AboutUsManager from "./AboutUsManager";
import ServicesManager from "./ServicesManager";
import ProjectsManager from "./ProjectsManager";
import BlogManager from "./BlogManager";
import TeamManager from "./TeamManager";
import FaqManager from "./FaqManager";
import InquiriesInbox from "./InquiriesInbox";
import JobApplicationsManager from "./JobApplicationsManager";
import SeoManager from "./SeoManager";
import SecuritySettings from "./SecuritySettings";
import TeamRbacManager from "./TeamRbacManager";
import AuditLogsManager from "./AuditLogsManager";
import BookingsManager from "./BookingsManager";
import AiChatbotSettings from "./AiChatbotSettings";
import ClientProjectsManager from "./ClientProjectsManager";
import SiteTogglesManager from "./SiteTogglesManager";
import CrmKanbanBoard from "./CrmKanbanBoard";
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
  AdminRole,
  AuditLogData,
  AccessRequestData,
  BookingData,
  ClientProjectData
} from "@/types";

interface AdminDashboardTabsProps {
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
  clientProjects?: ClientProjectData[];
  userRole?: string;
  currentUserId?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export default function AdminDashboardTabs({
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
  clientProjects = [],
  userRole = "SUPER_ADMIN",
  currentUserId,
  activeTab: controlledActiveTab,
  onTabChange,
}: AdminDashboardTabsProps) {
  const [internalTab, setInternalTab] = useState<string>("analytics");
  const activeTab = controlledActiveTab || internalTab;

  const handleTabClick = (tabId: string) => {
    setInternalTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const newInquiriesCount = inquiries.filter((i) => i.status === "NEW").length;
  const newBookingsCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const newAppsCount = applications.filter((a) => a.status === "REVIEW").length;
  const pendingRequestsCount = accessRequests.filter((r) => r.status === "PENDING").length;

  return (
    <div className="w-full">
      {/* Tab Panels */}
      <div className="animate-in fade-in duration-200">
        {activeTab === "analytics" && (
          <AnalyticsDashboard
            inquiries={inquiries}
            applications={applications}
            services={services}
            projects={projects}
          />
        )}
        {activeTab === "activity" && <LiveActivityFeed initialActivities={activities} />}
        {activeTab === "threats" && <SecurityThreatsFeed initialThreats={threats} />}
        {activeTab === "kanban" && <CrmKanbanBoard inquiries={inquiries} />}
        {activeTab === "inquiries" && <InquiriesInbox initialInquiries={inquiries} />}
        {activeTab === "bookings" && <BookingsManager initialBookings={bookings} />}
        {activeTab === "client-projects" && <ClientProjectsManager initialProjects={clientProjects} />}
        {activeTab === "applications" && <JobApplicationsManager initialApplications={applications} />}
        {activeTab === "toggles" && <SiteTogglesManager organization={organization} />}
        {activeTab === "users" && (
          <TeamRbacManager
            users={users}
            accessRequests={accessRequests}
            currentUserId={currentUserId}
            userRole={userRole}
          />
        )}
        {activeTab === "audit" && <AuditLogsManager logs={logs} />}
        {activeTab === "ai-settings" && <AiChatbotSettings organization={organization} />}
        {activeTab === "org" && <OrgSettingsForm organization={organization} />}
        {activeTab === "theme" && <ThemeCustomizer organization={organization} />}
        {activeTab === "seo" && (
          <SeoManager
            organization={organization}
            services={services}
            projects={projects}
            blogs={blogs}
            faqs={faqs}
          />
        )}
        {activeTab === "socials" && <SocialsManager organization={organization} />}
        {activeTab === "about" && <AboutUsManager organization={organization} />}
        {activeTab === "services" && <ServicesManager initialServices={services} />}
        {activeTab === "projects" && <ProjectsManager initialProjects={projects} />}
        {activeTab === "blogs" && <BlogManager initialBlogs={blogs} />}
        {activeTab === "team" && <TeamManager initialTeam={team} />}
        {activeTab === "faqs" && <FaqManager initialFaqs={faqs} />}
        {activeTab === "security" && <SecuritySettings organization={organization} />}
      </div>
    </div>
  );
}
