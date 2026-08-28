"use client";

import { useState } from "react";
import Link from "next/link";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeWrapper from "@/components/ThemeWrapper";
import Navbar from "@/components/Navbar";

// 10-ACT STORY-DRIVEN CINEMATIC HOMEPAGE MODULES (VERTICAL NARRATIVE FLOW)
import Act01Interruption from "@/components/StoryHome/Act01Interruption";
import Act02TheLeak from "@/components/StoryHome/Act02TheLeak";
import Act03RealityFlipCards from "@/components/StoryHome/Act03RealityFlipCards";
import Act04TurningPoint from "@/components/StoryHome/Act04TurningPoint";
import Act05BusinessOperatingSystem from "@/components/StoryHome/Act05BusinessOperatingSystem";
import Act06TransformationMatrix from "@/components/StoryHome/Act06TransformationMatrix";
import Act07Outcomes from "@/components/StoryHome/Act07Outcomes";
import Act08BottleneckDiagnostic from "@/components/StoryHome/Act08BottleneckDiagnostic";
import Act09ProofStories from "@/components/StoryHome/Act09ProofStories";
import Act10FinalConversation from "@/components/StoryHome/Act10FinalConversation";

import CostEstimator from "@/components/CostEstimator";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import FuturisticChatbot from "@/components/FuturisticChatbot";
import GuidedSessionModal from "@/components/GuidedSessionModal";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import GoogleReviewsSection from "@/components/GoogleReviewsSection";
import InstagramFeed from "@/components/InstagramFeed";
import {
  ArrowRight,
  Zap,
  HelpCircle,
  Sparkles
} from "lucide-react";
import {
  OrganizationData,
  ServiceData,
  ProjectData,
  BlogPostData,
  TeamMemberData,
  FaqData
} from "@/types";

import { parseFeatureToggles } from "@/lib/featureToggles";
import ComplianceTrustBadges from "@/components/ComplianceTrustBadges";

interface ClientHomeExperienceProps {
  organization: OrganizationData | null;
  services: ServiceData[];
  projects: ProjectData[];
  blogs: BlogPostData[];
  team: TeamMemberData[];
  faqs: FaqData[];
}

export default function ClientHomeExperience({
  organization,
  services,
  projects,
  blogs,
  team,
  faqs,
}: ClientHomeExperienceProps) {
  const [selectedServiceForEstimate, setSelectedServiceForEstimate] = useState<string>("");
  const [guidedSessionOpen, setGuidedSessionOpen] = useState<boolean>(false);
  const toggles = parseFeatureToggles(organization?.featureToggles);

  return (
    <ThemeWrapper organization={organization}>
      {toggles.widgetPreloader && <Preloader />}
      <ScrollProgress />
      <div className="flex flex-col min-h-screen bg-cyber-950 text-white relative selection:bg-cyan-500 selection:text-black">
        <Navbar organization={organization} services={services} />

        <main className="flex-grow">
          {/* ACT 01: THE INTERRUPTION */}
          {toggles.homeAct01Interruption && <Act01Interruption />}

          {/* ACT 02: THE SILENT LEAK */}
          {toggles.homeAct02TheLeak && (
            <div className="scroll-reveal">
              <Act02TheLeak />
            </div>
          )}

          {/* ACT 03: THE 3D PERSPECTIVE FLIP CARDS */}
          {toggles.homeAct03RealityFlipCards && (
            <div className="scroll-reveal">
              <Act03RealityFlipCards />
            </div>
          )}

          {/* ACT 04: THE TURNING POINT */}
          {toggles.homeAct04TurningPoint && (
            <div className="scroll-reveal">
              <Act04TurningPoint />
            </div>
          )}

          {/* ACT 05: THE DIGITAL MACHINERY */}
          {toggles.homeAct05OperatingSystem && (
            <div className="scroll-reveal">
              <Act05BusinessOperatingSystem />
            </div>
          )}

          {/* ACT 06: BEFORE VS. AFTER TRANSFORMATION */}
          {toggles.homeAct06TransformationMatrix && (
            <div className="scroll-reveal">
              <Act06TransformationMatrix />
            </div>
          )}

          {/* ACT 07: TANGIBLE BUSINESS OUTCOMES */}
          {toggles.homeAct07Outcomes && (
            <div className="scroll-reveal">
              <Act07Outcomes />
            </div>
          )}

          {/* ACT 08: INTERACTIVE BOTTLENECK DIAGNOSTIC */}
          {toggles.homeAct08BottleneckDiagnostic && (
            <div className="scroll-reveal">
              <Act08BottleneckDiagnostic />
            </div>
          )}

          {/* ACT 09: MINI TRANSFORMATION PROOF STORIES */}
          {toggles.homeAct09ProofStories && (
            <div className="scroll-reveal">
              <Act09ProofStories />
            </div>
          )}

          {/* DEDICATED ENGINEERING PROJECTS & PREVIOUS WORK SHOWCASE */}
          <div className="scroll-reveal">
            <ProjectsShowcase
              projects={projects}
              title="Verified Production Platforms & Previous Work"
              subtitle="Explore real systems built with sub-100ms response times, autonomous agent pipelines, and high-conversion funnels."
              limit={6}
              showFilters={true}
            />
          </div>

          {/* GOOGLE REVIEWS & VERIFIED 5-STAR RATINGS */}
          <div className="scroll-reveal">
            <GoogleReviewsSection />
          </div>

          {/* INSTAGRAM LIVE PULSE & ENGINEERING MEDIA GRID */}
          <div className="scroll-reveal">
            <InstagramFeed />
          </div>

          {/* TRANSPARENT SCOPE & COST ESTIMATOR */}
          {toggles.homeCostEstimator && (
            <section id="estimator" className="py-28 relative bg-cyber-950/80 border-t border-b border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Transparent Sizing &amp; Pricing</span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                      Instant Project Scope &amp; <span className="text-gradient-cyan">Pricing Estimator</span>
                    </h2>
                    <p className="mt-3 text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed">
                      Calculate ballpark investment ranges, timeline deliverables, and export pre-filled specifications with zero sales pressure.
                    </p>
                  </div>

                  <Link
                    href="/estimator"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
                  >
                    <span>Open Dedicated Full-Screen Estimator</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <CostEstimator
                  organization={organization}
                  initialService={selectedServiceForEstimate}
                />
              </div>
            </section>
          )}

          {/* FREQUENTLY ASKED QUESTIONS */}
          {toggles.homeFaqSection && (
            <div className="scroll-reveal">
              <FaqSection faqs={faqs} />
            </div>
          )}

          {/* ACT 10: THE FINAL CONVERSATION & BLUEPRINT CAPTURE */}
          {toggles.homeAct10FinalConversation && (
            <div className="scroll-reveal">
              <Act10FinalConversation organization={organization} />
            </div>
          )}

          {/* ENTERPRISE COMPLIANCE BADGES */}
          {toggles.widgetComplianceBadges && <ComplianceTrustBadges />}
        </main>

        <Footer organization={organization} />
        {toggles.widgetCommandPalette && <CommandPalette organization={organization} />}
        {toggles.widgetFuturisticChatbot && <FuturisticChatbot organization={organization} />}
        <GuidedSessionModal
          organization={organization}
          isOpen={guidedSessionOpen}
          onClose={() => setGuidedSessionOpen(false)}
        />
      </div>
    </ThemeWrapper>
  );
}
