"use client";

import { TeamMemberData } from "@/types";
import { Users, Mail, Phone, ExternalLink } from "lucide-react";
import Image from "next/image";

interface TeamSectionProps {
  team: TeamMemberData[];
}

export default function TeamSection({ team }: TeamSectionProps) {
  if (!team || team.length === 0) return null;

  return (
    <section id="team" className="py-24 relative bg-cyber-950 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>Master Craftsmen &amp; Engineers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Meet the <span className="text-gradient-purple">Engineering Minds</span>
          </h2>
          <p className="mt-4 text-gray-400 text-base sm:text-lg">
            Our multidisciplinary team combines deep distributed systems engineering, AI research, and conversion growth expertise.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="group rounded-2xl glass-panel-interactive p-6 border border-white/10 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Photo container */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-5 bg-cyber-900 border border-white/10">
                  {member.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-cyber-900">
                      <Users className="w-12 h-12" />
                    </div>
                  )}

                  {/* Luminous overlay badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-cyan-400 border border-white/10">
                    Lead
                  </div>
                </div>

                {/* Name & Role */}
                <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  {member.name}
                </h3>
                <div className="text-xs font-semibold text-purple-400 mt-0.5">
                  {member.designation}
                </div>

                <p className="text-xs text-gray-400 mt-3 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Social & Direct Contact row */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 flex items-center justify-center transition-colors border border-white/5 text-[11px]"
                      title="LinkedIn Profile"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 flex items-center justify-center transition-colors border border-white/5 text-[11px]"
                      title="GitHub Profile"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                      </svg>
                    </a>
                  )}
                  {member.twitterUrl && (
                    <a
                      href={member.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 flex items-center justify-center transition-colors border border-white/5 text-[11px]"
                      title="Twitter / X Profile"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 transition-colors"
                      title={member.email}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 transition-colors"
                      title={member.phone}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
