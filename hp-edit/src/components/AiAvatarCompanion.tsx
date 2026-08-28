"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Zap,
  Volume2,
  VolumeX,
  RotateCcw,
  Cpu,
  ChevronDown,
  Activity,
  Mic,
  MicOff,
  Radio
} from "lucide-react";
import Link from "next/link";
import { soundFX } from "./CyberAudioFx";
import { OrganizationData } from "@/types";
import { chatWithAiAssistant } from "@/lib/actions";
import WhatsAppIcon from "./WhatsAppIcon";

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

interface AiAvatarCompanionProps {
  organization: OrganizationData | null;
}

type AvatarMood = "idle" | "listening" | "thinking" | "speaking";

const quickPrompts = [
  "Calculate estimated cost & timeline (/estimator)",
  "Schedule a 15-min discovery call (/book)",
  "What tech stack do you recommend for SaaS?",
  "Can you build autonomous AI swarms?",
];

export default function AiAvatarCompanion({ organization }: AiAvatarCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState<AvatarMood>("idle");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voicePlaybackEnabled, setVoicePlaybackEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showProactiveBubble, setShowProactiveBubble] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Greetings! I'm Nova, your AI System Architect companion. How can I assist you with your web platform, mobile app, or autonomous AI agent project today?",
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<unknown>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowProactiveBubble(false);
    }
  }, [messages, isOpen]);

  // Proactive speech bubble timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowProactiveBubble(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Text-to-Speech playback helper
  const speakText = (text: string) => {
    if (!voicePlaybackEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel previous utterance
      // Strip markdown formatting for cleaner speech
      const cleanText = text
        .replace(/[*_#`~[\]()]/g, "")
        .replace(/https?:\/\/\S+/g, "link")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) => (v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Neural")))
      );
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setMood("speaking");
      utterance.onend = () => setMood("idle");
      utterance.onerror = () => setMood("idle");

      window.speechSynthesis.speak(utterance);
    } catch {
      setMood("idle");
    }
  };

  // Speech-to-Text Voice Recognition
  const toggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in your current browser. Please try Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (recognitionRef.current) (recognitionRef.current as any).stop();
      setIsListening(false);
      setMood("idle");
      return;
    }

    try {
      soundFX.click();
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setMood("listening");
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((r: any) => r[0].transcript)
          .join("");

        setInputText(transcript);

        if (event.results[0].isFinal) {
          setIsListening(false);
          setMood("idle");
          if (transcript.trim()) {
            handleSend(transcript);
          }
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setMood("idle");
      };

      recognition.onend = () => {
        setIsListening(false);
        setMood("idle");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setMood("idle");
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    if (soundEnabled) soundFX.click();
    const userMsg: Message = {
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setMood("thinking");

    try {
      const historyPayload = messages.concat(userMsg).map((m) => ({
        role: m.sender === "bot" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await chatWithAiAssistant(historyPayload);
      if (soundEnabled) soundFX.success();

      const botReply = res.reply || "I am available to assist you with your software development and AI engineering questions.";

      setMood("speaking");
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      speakText(botReply);
    } catch {
      setMood("idle");
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I am ready to assist. You can also connect directly with our engineering lead on WhatsApp or schedule a 15-min discovery call at /book.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const waNumber = organization?.whatsappNumber?.replace(/[^0-9]/g, "") || "919876543210";
  const defaultMsg = encodeURIComponent(
    organization?.whatsappDefaultMessage ||
      "Hello HP Edit Enterprise! Consulting on custom software / AI architecture."
  );
  const whatsappUrl = `https://wa.me/${waNumber}?text=${defaultMsg}`;

  const [isMinimizedMobile, setIsMinimizedMobile] = useState(false);

  return (
    <>
      {/* 1. Floating Avatar Launcher & Proactive Companion Bubble */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-end gap-2.5 sm:gap-3 select-none">
        {/* Proactive Speech Bubble */}
        {!isOpen && showProactiveBubble && !isMinimizedMobile && (
          <div className="hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-cyber-900/95 backdrop-blur-xl border border-cyan-500/30 text-white shadow-2xl max-w-xs animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="text-xs">
              <span className="font-bold text-cyan-300">Nova AI Architect:</span>{" "}
              <span className="text-gray-300">
                Ready to scope your project or calculate timeline estimates?
              </span>
            </div>
            <button
              onClick={() => {
                if (soundEnabled) soundFX.click();
                setIsOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-[11px] shrink-0"
            >
              Chat
            </button>
            <button
              onClick={() => setShowProactiveBubble(false)}
              className="text-gray-500 hover:text-white p-0.5"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Interactive Holographic Avatar Head Button */}
        <button
          type="button"
          onClick={() => {
            if (soundEnabled) soundFX.click();
            setIsOpen(!isOpen);
          }}
          onMouseEnter={() => setMood("listening")}
          onMouseLeave={() => setMood("idle")}
          className={`relative group p-1 rounded-full transition-all duration-300 ${
            isOpen
              ? "scale-90 bg-rose-500/20 ring-2 ring-rose-500/40"
              : "hover:scale-110 shadow-2xl"
          }`}
          aria-label="Open AI Avatar Companion"
        >
          {/* Outer Pulsing Aura */}
          <div
            className={`absolute inset-0 rounded-full blur-md transition-all duration-500 ${
              mood === "thinking"
                ? "bg-purple-500/60 animate-spin"
                : mood === "speaking"
                ? "bg-cyan-400/60 animate-pulse"
                : mood === "listening"
                ? "bg-purple-500/40"
                : "bg-cyan-500/40 animate-pulse"
            }`}
          />

          {/* Avatar Face Orb */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 p-[2px] shadow-glow-cyan">
            <div className="w-full h-full rounded-full bg-cyber-950 flex flex-col items-center justify-center relative overflow-hidden">
              {/* Internal Mesh Background */}
              <div className="absolute inset-0 bg-grid-pattern opacity-30" />

              {/* Expressive Cyber Eyes */}
              <div className="flex items-center gap-2.5 z-10">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    mood === "thinking"
                      ? "bg-purple-400 animate-spin scale-125 border border-white"
                      : mood === "speaking"
                      ? "bg-cyan-300 animate-ping"
                      : mood === "listening"
                      ? "bg-purple-300 scale-110"
                      : "bg-cyan-400"
                  }`}
                />
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    mood === "thinking"
                      ? "bg-purple-400 animate-spin scale-125 border border-white"
                      : mood === "speaking"
                      ? "bg-cyan-300 animate-ping"
                      : mood === "listening"
                      ? "bg-purple-300 scale-110"
                      : "bg-cyan-400"
                  }`}
                />
              </div>

              {/* Equalizer Mouth / Speech Visualizer */}
              <div className="flex items-center gap-0.5 mt-1.5 z-10 h-2">
                <span
                  className={`w-0.5 bg-cyan-400 rounded-full transition-all ${
                    mood === "speaking" ? "h-3 animate-pulse" : "h-1 opacity-60"
                  }`}
                />
                <span
                  className={`w-0.5 bg-cyan-300 rounded-full transition-all ${
                    mood === "speaking" ? "h-4 animate-pulse delay-75" : "h-1 opacity-60"
                  }`}
                />
                <span
                  className={`w-0.5 bg-cyan-400 rounded-full transition-all ${
                    mood === "speaking" ? "h-3.5 animate-pulse delay-150" : "h-1 opacity-60"
                  }`}
                />
                <span
                  className={`w-0.5 bg-cyan-300 rounded-full transition-all ${
                    mood === "speaking" ? "h-2 animate-pulse" : "h-1 opacity-60"
                  }`}
                />
              </div>

              {/* Live Status Pip */}
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-cyber-950 z-20 animate-pulse" />
            </div>
          </div>
        </button>
      </div>

      {/* 2. Expanded AI Avatar Companion Cockpit */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] max-h-[640px] h-[82vh] rounded-3xl bg-cyber-950/95 backdrop-blur-2xl border border-cyan-500/30 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
          {/* Cockpit Top Header */}
          <div className="p-4 bg-cyber-900/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mini Interactive Avatar */}
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-cyber-950 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-cyber-950" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">Nova AI Architect</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Companion v2.6
                  </span>
                </div>
                <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="capitalize">Status: {mood}</span>
                </div>
              </div>
            </div>

            {/* Header Action Tools */}
            <div className="flex items-center gap-1.5">
              {/* Voice Readout Toggle */}
              <button
                onClick={() => setVoicePlaybackEnabled(!voicePlaybackEnabled)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  voicePlaybackEnabled
                    ? "bg-purple-500/15 border-purple-500/30 text-purple-300"
                    : "bg-white/5 border-white/5 text-gray-500"
                }`}
                title={voicePlaybackEnabled ? "AI Voice Readout: ON" : "AI Voice Readout: OFF"}
              >
                {voicePlaybackEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  soundEnabled
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    : "bg-white/5 border-white/5 text-gray-500"
                }`}
                title={soundEnabled ? "Mute Audio SFX" : "Enable Audio SFX"}
              >
                {soundEnabled ? <Radio className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  if (soundEnabled) soundFX.click();
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="px-3 py-2 bg-cyber-900/50 border-b border-white/5 flex items-center justify-between gap-1 text-[10px] font-medium text-gray-300 overflow-x-auto no-scrollbar">
            <Link
              href="/book"
              onClick={() => {
                if (soundEnabled) soundFX.click();
                setIsOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-cyan-300 transition-colors flex items-center gap-1 shrink-0"
            >
              <Calendar className="w-3 h-3 text-cyan-400" />
              <span>Book Call</span>
            </Link>

            <Link
              href="/estimator"
              onClick={() => {
                if (soundEnabled) soundFX.click();
                setIsOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 hover:text-purple-300 transition-colors flex items-center gap-1 shrink-0"
            >
              <Cpu className="w-3 h-3 text-purple-400" />
              <span>Estimator</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (soundEnabled) soundFX.success();
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors flex items-center gap-1 shrink-0"
            >
              <WhatsAppIcon className="w-3 h-3" />
              <span>WhatsApp Lead</span>
            </a>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none shadow-glow-cyan/20"
                      : "bg-cyber-900 border border-white/10 text-gray-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="text-[9px] font-mono text-gray-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {mood === "thinking" && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-cyber-900 border border-purple-500/30 text-purple-300 rounded-tl-none w-fit animate-pulse">
                <Cpu className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                <span className="text-[11px] font-mono">Synthesizing architecture response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Prompts */}
          <div className="px-4 py-2 border-t border-white/5 bg-cyber-900/40">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Suggested Explorations</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/30 border border-white/5 text-[10px] text-gray-300 transition-all text-left truncate max-w-full"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input & Send Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-cyber-900 border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening... Speak your idea now" : "Ask Nova about tech stacks, cost, or AI agents..."}
              className={`flex-1 bg-cyber-950 border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors ${
                isListening ? "border-purple-500 shadow-glow-purple/20 animate-pulse" : "border-white/10 focus:border-cyan-500"
              }`}
            />

            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? "bg-purple-500 text-white border-purple-400 shadow-glow-purple animate-bounce"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-cyan-300 border-white/10"
              }`}
              title={isListening ? "Stop Voice Listening" : "Speak to Nova AI"}
            >
              {isListening ? <Mic className="w-3.5 h-3.5 text-white" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() || mood === "thinking"}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-40 transition-all shadow-glow-cyan hover:scale-105"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
