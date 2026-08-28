export interface SocialLinkItem {
  platform: string;
  icon: string;
  url: string;
  active: boolean;
}

export interface AboutStatItem {
  label: string;
  value: string;
}

export interface OrganizationData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logoUrl?: string | null;
  
  // Secret Admin Portal Slug
  adminPortalSlug: string;
  
  // Theme Mode
  themeMode: string;
  
  // Dark Mode Custom Palette
  darkBgColor: string;
  darkTextColor: string;
  darkCardColor: string;
  darkAccentColor: string;
  darkSecondaryAccent: string;
  
  // Light Mode Custom Palette
  lightBgColor: string;
  lightTextColor: string;
  lightCardColor: string;
  lightAccentColor: string;
  lightSecondaryAccent: string;
  
  // Preset Theme Color & Font Family
  themeColor: string;
  fontFamily: string;
  fontSizeScale: string;
  enableSoundFX: boolean;
  
  // Custom Fonts
  customFontType: string;
  googleFontUrl?: string | null;
  googleFontName?: string | null;
  uploadedFontData?: string | null;
  uploadedFontName?: string | null;

  // Contact
  address: string;
  city: string;
  country: string;
  postalCode: string;
  primaryPhone: string;
  secondaryPhone?: string | null;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  primaryEmail: string;
  salesEmail?: string | null;
  supportEmail?: string | null;
  googleMapsEmbed?: string | null;
  businessHours: string;
  availabilityStatus: string;
  
  // Socials
  customSocials?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  youtubeUrl?: string | null;
  
  // About Us
  aboutHeading?: string | null;
  aboutStory?: string | null;
  aboutMission?: string | null;
  aboutStats?: string | null;
  
  // SEO
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;

  // Cal.com / Direct Booking Integration
  calEmbedUrl?: string | null;

  // Gemini 2.0 Free Tier AI Chatbot Integration
  geminiApiKey?: string | null;
  geminiModelName?: string;
  geminiSystemPrompt?: string | null;

  // Outbound Webhook & Meta WhatsApp Alerts
  outboundWebhookUrl?: string | null;
  founderAlertWhatsapp?: string | null;
  metaWhatsappApiToken?: string | null;
  metaWhatsappPhoneId?: string | null;
  
  // Granular Site Modules & Section Toggles
  featureToggles?: string | null;
  
  updatedAt?: Date | string;
}

export interface FeatureToggles {
  // Homepage Story Acts (1-10)
  homeAct01Interruption: boolean;
  homeAct02TheLeak: boolean;
  homeAct03RealityFlipCards: boolean;
  homeAct04TurningPoint: boolean;
  homeAct05OperatingSystem: boolean;
  homeAct06TransformationMatrix: boolean;
  homeAct07Outcomes: boolean;
  homeAct08BottleneckDiagnostic: boolean;
  homeAct09ProofStories: boolean;
  homeCostEstimator: boolean;
  homeFaqSection: boolean;
  homeAct10FinalConversation: boolean;
  
  // Interactive Lab & Tech Modules
  moduleSystemTopology: boolean;
  moduleAiAgentSandbox: boolean;
  moduleMaturityScorecard: boolean;
  moduleRoiCalculator: boolean;
  moduleClientPortal: boolean;
  moduleCaseStudies: boolean;
  moduleDedicatedEstimator: boolean;
  
  // Global Experience & Floating Widgets
  widgetPreloader: boolean;
  widgetFuturisticChatbot: boolean;
  widgetCommandPalette: boolean;
  widgetWhatsappPopup: boolean;
  widgetSoundFX: boolean;
  widgetComplianceBadges: boolean;
}

export type AdminRole = "SUPER_ADMIN" | "SALES_LEAD" | "CONTENT_MANAGER" | "TALENT_HR" | "SECURITY_AUDITOR";

export interface AdminUserData {
  id: string;
  username: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface AdminNotificationData {
  id: string;
  type: string; // LEAD, APPLICANT, THREAT, PROPOSAL, SYSTEM, ACCESS_REQUEST, BOOKING
  title: string;
  message: string;
  linkTab: string;
  isRead: boolean;
  createdAt: Date | string;
}

export interface AuditLogData {
  id: string;
  adminUsername: string;
  adminRole: string;
  action: string;
  resource: string;
  details: string;
  ipAddress?: string | null;
  isArchived?: boolean;
  createdAt: Date | string;
}

export interface AccessRequestData {
  id: string;
  userId: string;
  username: string;
  currentRole: string;
  requestedRole: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedBy?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface LeadCommunicationData {
  id: string;
  inquiryId: string;
  channel: "WHATSAPP" | "EMAIL" | "PHONE";
  subject?: string | null;
  messageContent: string;
  sentByAdmin: string;
  createdAt: Date | string;
}

export interface BookingData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  meetingType: string;
  platform: string;
  bookingDate: string;
  bookingTime: string;
  timezone: string;
  topic: string;
  meetingLink?: string | null;
  status: string;
  createdAt: Date | string;
}

export interface InquiryData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  serviceType: string;
  projectBudget?: string | null;
  timeline?: string | null;
  message: string;
  status: string;
  pipelineStage?: string | null;
  createdAt: Date | string;
  communications?: LeadCommunicationData[];
}

export interface JobApplicationData {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  roleTitle: string;
  portfolioUrl?: string | null;
  githubUrl?: string | null;
  resumeNotes?: string | null;
  status: string;
  createdAt: Date | string;
}

export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  icon: string;
  features: string;
  order: number;
  isFeatured: boolean;
  isActive?: boolean;
}

export interface ProjectData {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  metrics: string;
  techStack: string;
  demoUrl?: string | null;
  featured: boolean;
  order: number;
}

export interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  authorName: string;
  authorRole?: string | null;
  authorAvatar?: string | null;
  tags: string;
  readTime: string;
  published: boolean;
  order: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface TeamMemberData {
  id: string;
  name: string;
  designation: string;
  bio: string;
  photoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  twitterUrl?: string | null;
  order: number;
  active: boolean;
}

export interface FaqData {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface TestimonialData {
  id: string;
  author: string;
  role: string;
  company: string;
  quote: string;
  highlight: string;
  rating: number;
  avatarUrl?: string | null;
  order: number;
}

export interface VisitorActivityData {
  id: string;
  sessionId: string;
  eventType: string;
  path: string;
  details?: string | null;
  device?: string | null;
  browser?: string | null;
  os?: string | null;
  ipHash?: string | null;
  createdAt: Date | string;
}

export interface SecurityEventData {
  id: string;
  type: string;
  details: string;
  ipHash?: string | null;
  isArchived?: boolean;
  createdAt: Date | string;
}

export interface ProjectMilestoneData {
  id: string;
  projectId: string;
  title: string;
  description: string;
  deliverables: string;
  status: "PENDING" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | string;
  targetDate?: string | null;
  completedAt?: Date | string | null;
  signedOffByClient: boolean;
  signOffClientName?: string | null;
  signOffNotes?: string | null;
  signOffDate?: Date | string | null;
  invoiceAmount?: string | null;
  invoiceStatus?: "UNPAID" | "PAID" | "WAIVED" | string | null;
  paymentLink?: string | null;
  clientFeedback?: string | null;
  order: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ClientProjectData {
  id: string;
  projectCode: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string | null;
  title: string;
  description: string;
  tier: string;
  status: "DISCOVERY" | "ARCHITECTURE" | "IN_PROGRESS" | "STAGING" | "COMPLETED" | "DELIVERED" | string;
  progressPercent: number;
  stagingUrl?: string | null;
  figmaUrl?: string | null;
  repoUrl?: string | null;
  startDate?: string | null;
  targetDelivery?: string | null;
  completedDate?: string | null;
  milestones: ProjectMilestoneData[];
  createdAt: Date | string;
  updatedAt?: Date | string;
}

