"use client";

import { useState, useEffect } from "react";
import { Terminal, Cpu, Sparkles } from "lucide-react";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("INITIALIZING NEURAL CORE...");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check session storage so preloader only shows once per session
    const hasSeen = sessionStorage.getItem("hp_preloader_seen");
    if (hasSeen) {
      setIsDone(true);
      return;
    }

    const stages = [
      { p: 25, text: "ALLOCATING COMPUTE NODES..." },
      { p: 60, text: "CONNECTING AI AGENT BRIDGES..." },
      { p: 90, text: "CALIBRATING 120HZ ENGINE..." },
      { p: 100, text: "HP EDIT ENTERPRISE READY" },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 18) + 12;
        if (next >= 100) {
          clearInterval(interval);
          setStage("HP EDIT ENTERPRISE READY");
          setTimeout(() => {
            setIsDone(true);
            sessionStorage.setItem("hp_preloader_seen", "true");
          }, 150);
          return 100;
        }

        const matched = stages.find((s) => next >= s.p && next <= s.p + 35);
        if (matched) setStage(matched.text);

        return next;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setIsDone(true);
    sessionStorage.setItem("hp_preloader_seen", "true");
  };

  if (isDone) return null;

  return (
    <div className="fixed inset-0 z-50 bg-cyber-950 flex flex-col items-center justify-center p-6 select-none transition-opacity duration-300 animate-in fade-in">
      {/* Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        {/* Animated Cyber Badge */}
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] mx-auto shadow-glow-cyan animate-pulse">
          <div className="w-full h-full bg-cyber-950 rounded-[14px] flex items-center justify-center">
            <Terminal className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold font-mono tracking-wider mb-2">
            <span>HP EDIT ENTERPRISE</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/20 px-1.5 py-0.5 rounded">v2.6</span>
          </div>
          <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
            {stage}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden p-[1px]">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full transition-all duration-75 shadow-glow-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 px-1">
          <span>SYSTEM_BOOT</span>
          <span className="text-cyan-400 font-bold">{progress}%</span>
        </div>

        <button
          onClick={handleSkip}
          className="text-xs font-mono text-gray-400 hover:text-white transition-colors cursor-pointer border-b border-gray-600 hover:border-white pb-0.5"
        >
          Skip Intro &rarr;
        </button>
      </div>
    </div>
  );
}
