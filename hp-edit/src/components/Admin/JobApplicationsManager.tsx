"use client";

import { useState } from "react";
import { JobApplicationData } from "@/types";
import { Briefcase, Trash2, Mail, ExternalLink, Clock, CheckCircle2 } from "lucide-react";

interface JobApplicationsManagerProps {
  initialApplications: JobApplicationData[];
}

export default function JobApplicationsManager({ initialApplications }: JobApplicationsManagerProps) {
  const [apps, setApps] = useState<JobApplicationData[]>(initialApplications);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Developer Job Applications Inbox</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Review incoming applications, GitHub profiles, and portfolio submissions from the Careers page.
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
          {apps.length} Total Applicants
        </span>
      </div>

      {apps.length === 0 ? (
        <div className="p-12 rounded-2xl glass-panel border border-white/10 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-sm font-bold text-gray-400">No Job Applications Yet</h3>
          <p className="text-xs text-gray-500">
            Candidate submissions from /careers will appear here with direct GitHub and portfolio links.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white">{app.name}</span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
                    {app.roleTitle}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{app.email} {app.phone && `• ${app.phone}`}</div>
                {app.resumeNotes && (
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2">{app.resumeNotes}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {app.githubUrl && (
                  <a
                    href={app.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {app.portfolioUrl && (
                  <a
                    href={app.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs flex items-center gap-1"
                  >
                    <span>Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <a
                  href={`mailto:${app.email}?subject=HP Edit Enterprise Application: ${app.roleTitle}`}
                  className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
