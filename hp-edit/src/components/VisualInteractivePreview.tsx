"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Smartphone,
  Bot,
  Terminal,
  Activity,
  Zap,
  CheckCircle2,
  Play,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Wifi,
  Battery,
  Send,
  Code2,
  FileCode,
  GitBranch
} from "lucide-react";
import { soundFX } from "./CyberAudioFx";
import WhatsAppIcon from "./WhatsAppIcon";

export default function VisualInteractivePreview() {
  const [activeTab, setActiveTab] = useState<"web" | "mobile" | "swarm">("web");
  const [trafficSpike, setTrafficSpike] = useState(false);
  const [mobileScreen, setMobileScreen] = useState<"dashboard" | "chat" | "checkout">("dashboard");
  const [simulatedPing, setSimulatedPing] = useState(42);
  const [activeCodeTab, setActiveCodeTab] = useState<"architecture" | "docker" | "schema">("architecture");

  // Ping fluctuation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedPing(Math.floor(Math.random() * 8) + 38);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const triggerTrafficSpike = () => {
    soundFX.success();
    setTrafficSpike(true);
    setTimeout(() => setTrafficSpike(false), 2500);
  };

  return (
    <section className="py-20 relative bg-cyber-950 overflow-hidden border-t border-white/5">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full luxury-glass-pill border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Visual Engineering Laboratory</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Interactive <span className="text-gradient-cyan">System Previews</span>
            </h2>
            <p className="mt-3 text-gray-400 text-sm sm:text-base max-w-xl">
              Inspect our production-grade architecture blueprints, interactive mobile device runtimes, and real-time autonomous AI swarms.
            </p>
          </div>

          {/* Interactive Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-cyber-900/80 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => {
                soundFX.click();
                setActiveTab("web");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "web"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Edge Cloud Platform</span>
            </button>

            <button
              onClick={() => {
                soundFX.click();
                setActiveTab("mobile");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "mobile"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Native Mobile Device</span>
            </button>

            <button
              onClick={() => {
                soundFX.click();
                setActiveTab("swarm");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "swarm"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-glow-purple/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Swarm Pipeline</span>
            </button>
          </div>
        </div>

        {/* 1. Interactive Edge Web & Cloud Showcase */}
        {activeTab === "web" && (
          <div className="rounded-3xl luxury-card border border-cyan-500/20 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Realistic Browser Frame Header */}
            <div className="bg-cyber-950/90 px-5 py-3 border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-gray-400 ml-3">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span>https://app.client-enterprise.io/analytics/edge</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  <Zap className="w-3 h-3 animate-pulse" />
                  <span>TTFB: {trafficSpike ? "18ms" : `${simulatedPing}ms`}</span>
                </div>
                <button
                  onClick={triggerTrafficSpike}
                  className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-1.5 transition-transform hover:scale-105 shadow-glow-cyan"
                >
                  <Activity className="w-3 h-3" />
                  <span>Simulate 10k RPS</span>
                </button>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-cyber-900/60">
              {/* Left Column: Live Metrics & Charts (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-cyber-950/80 border border-white/5">
                    <div className="text-xs text-gray-400">Total Throughput</div>
                    <div className="text-xl sm:text-2xl font-bold text-white mt-1">
                      {trafficSpike ? "14.8M req/s" : "2.4M req/s"}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{trafficSpike ? "+516% Surge" : "+18.4% WoW"}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyber-950/80 border border-white/5">
                    <div className="text-xs text-gray-400">P99 Server Latency</div>
                    <div className="text-xl sm:text-2xl font-bold text-cyan-400 mt-1">
                      {trafficSpike ? "24ms" : "31ms"}
                    </div>
                    <div className="text-[10px] text-cyan-300 font-medium mt-1">Next.js Edge Runtime</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyber-950/80 border border-white/5">
                    <div className="text-xs text-gray-400">Database Load</div>
                    <div className="text-xl sm:text-2xl font-bold text-purple-400 mt-1">
                      {trafficSpike ? "14.2%" : "3.8%"}
                    </div>
                    <div className="text-[10px] text-purple-300 font-medium mt-1">Prisma + Redis Core</div>
                  </div>
                </div>

                {/* Simulated Real-Time Waveform Graphic */}
                <div className="p-5 rounded-2xl bg-cyber-950/90 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Edge Gateway Traffic Distribution</span>
                    </span>
                    <span className="font-mono text-[10px] text-cyan-400">99.999% SLA // Zero Packet Loss</span>
                  </div>

                  {/* SVG Oscilloscope Line */}
                  <div className="h-28 w-full relative overflow-hidden flex items-end">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                      <defs>
                        <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={
                          trafficSpike
                            ? "M0,80 Q50,10 100,75 T200,20 T300,5 T400,30 L400,100 L0,100 Z"
                            : "M0,60 Q50,45 100,55 T200,40 T300,50 T400,45 L400,100 L0,100 Z"
                        }
                        fill="url(#cyanGrad)"
                        className="transition-all duration-700"
                      />
                      <path
                        d={
                          trafficSpike
                            ? "M0,80 Q50,10 100,75 T200,20 T300,5 T400,30"
                            : "M0,60 Q50,45 100,55 T200,40 T300,50 T400,45"
                        }
                        fill="none"
                        stroke="#22d3ee"
                        strokeWidth="2.5"
                        className="transition-all duration-700"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Right Column: Production Code Blueprint Tabs (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl bg-cyber-950 border border-white/10 flex flex-col overflow-hidden">
                {/* Code Tabs */}
                <div className="flex items-center border-b border-white/10 bg-black/40 px-3 pt-2 gap-1 text-[11px] font-mono">
                  <button
                    onClick={() => setActiveCodeTab("architecture")}
                    className={`px-3 py-1.5 rounded-t-lg transition-colors flex items-center gap-1.5 ${
                      activeCodeTab === "architecture"
                        ? "bg-cyber-900 text-cyan-300 border-t border-x border-cyan-500/40"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>EdgeRouter.ts</span>
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("docker")}
                    className={`px-3 py-1.5 rounded-t-lg transition-colors flex items-center gap-1.5 ${
                      activeCodeTab === "docker"
                        ? "bg-cyber-900 text-purple-300 border-t border-x border-purple-500/40"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <FileCode className="w-3 h-3" />
                    <span>ClusterDeploy.yml</span>
                  </button>
                </div>

                {/* Code Content */}
                <div className="p-4 font-mono text-xs text-gray-300 leading-relaxed overflow-x-auto flex-1 bg-cyber-950/90">
                  {activeCodeTab === "architecture" && (
                    <pre className="text-gray-300">
                      <span className="text-purple-400">export async function</span>{" "}
                      <span className="text-cyan-400">handleEnterpriseRequest</span>(req) &#123;{"\n"}
                      {"  "}<span className="text-gray-500">// 1. Edge auth validation (&lt; 2ms)</span>{"\n"}
                      {"  "}<span className="text-blue-400">const</span> session = <span className="text-purple-400">await</span> verifyJwtToken(req);{"\n"}
                      {"  "}<span className="text-blue-400">if</span> (!session.authorized) <span className="text-rose-400">return</span> 401;{"\n\n"}
                      {"  "}<span className="text-gray-500">// 2. Dynamic cache &amp; AI router</span>{"\n"}
                      {"  "}<span className="text-blue-400">const</span> cache = <span className="text-purple-400">await</span> redis.get(req.key);{"\n"}
                      {"  "}<span className="text-blue-400">if</span> (cache) <span className="text-emerald-400">return</span> JSON.parse(cache);{"\n\n"}
                      {"  "}<span className="text-rose-400">return</span> streamAiResponse(session);{"\n"}
                      &#125;
                    </pre>
                  )}
                  {activeCodeTab === "docker" && (
                    <pre className="text-gray-300">
                      <span className="text-cyan-400">version:</span> <span className="text-emerald-400">&apos;3.9&apos;</span>{"\n"}
                      <span className="text-cyan-400">services:</span>{"\n"}
                      {"  "}<span className="text-purple-400">hp-edge-gateway:</span>{"\n"}
                      {"    "}<span className="text-blue-400">image:</span> enterprise-k8s-edge:v2.4{"\n"}
                      {"    "}<span className="text-blue-400">replicas:</span> 8{"\n"}
                      {"    "}<span className="text-blue-400">resources:</span>{"\n"}
                      {"      "}<span className="text-blue-400">limits:</span> &#123; cpu: <span className="text-emerald-400">&apos;4000m&apos;</span>, mem: <span className="text-emerald-400">&apos;8Gi&apos;</span> &#125;{"\n"}
                      {"    "}<span className="text-blue-400">healthcheck:</span> 200 OK
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Interactive Native Mobile Device Preview */}
        {activeTab === "mobile" && (
          <div className="rounded-3xl luxury-card border border-cyan-500/20 p-8 flex flex-col lg:flex-row items-center justify-center gap-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Interactive Phone Frame */}
            <div className="relative w-[300px] h-[600px] rounded-[48px] bg-cyber-950 border-[6px] border-slate-700 shadow-2xl p-3 flex flex-col justify-between overflow-hidden ring-4 ring-cyan-500/20">
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[9px] font-mono text-cyan-300">120Hz</span>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 px-3 pt-2 z-20 font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Phone Content Screen */}
              <div className="flex-1 bg-cyber-900 rounded-[32px] p-4 flex flex-col justify-between mt-4 overflow-hidden border border-white/5">
                {mobileScreen === "dashboard" && (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-400">Enterprise Balance</div>
                        <div className="text-xl font-bold text-white">\$124,590.00</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                        HP
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-cyber-950 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-gray-400">Automated Transfer</span>
                        <span className="text-emerald-400 font-bold">Instant</span>
                      </div>
                      <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-4/5" />
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Recent Settlements
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between text-xs">
                        <span className="text-white">API Gateway Settlement</span>
                        <span className="text-emerald-400 font-semibold">+\$18,400</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between text-xs">
                        <span className="text-white">AI Cluster Run #409</span>
                        <span className="text-cyan-400 font-semibold">-\$120</span>
                      </div>
                    </div>
                  </div>
                )}

                {mobileScreen === "chat" && (
                  <div className="space-y-2 text-xs animate-in fade-in flex-1 flex flex-col justify-end">
                    <div className="p-2.5 rounded-2xl rounded-tl-none bg-white/10 text-gray-200 max-w-[85%]">
                      Hello! Project Phase 3 is completed ahead of schedule. Review build?
                    </div>
                    <div className="p-2.5 rounded-2xl rounded-tr-none bg-gradient-to-r from-cyan-500 to-blue-600 text-white max-w-[85%] self-end font-medium">
                      Approved. Deploy to global iOS &amp; Android store clusters.
                    </div>
                  </div>
                )}

                {mobileScreen === "checkout" && (
                  <div className="space-y-3 text-center animate-in fade-in py-6">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="text-sm font-bold text-white">Biometric Verification Pass</div>
                    <div className="text-[11px] text-gray-400">Payment of \$4,800 released under milestone SLA</div>
                  </div>
                )}

                {/* Bottom Screen Switcher */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      soundFX.click();
                      setMobileScreen("dashboard");
                    }}
                    className={`py-1 text-[10px] rounded-lg font-bold transition-colors ${
                      mobileScreen === "dashboard" ? "bg-cyan-500/20 text-cyan-300" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Wallet
                  </button>
                  <button
                    onClick={() => {
                      soundFX.click();
                      setMobileScreen("chat");
                    }}
                    className={`py-1 text-[10px] rounded-lg font-bold transition-colors ${
                      mobileScreen === "chat" ? "bg-cyan-500/20 text-cyan-300" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => {
                      soundFX.click();
                      setMobileScreen("checkout");
                    }}
                    className={`py-1 text-[10px] rounded-lg font-bold transition-colors ${
                      mobileScreen === "checkout" ? "bg-cyan-500/20 text-cyan-300" : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    Pay
                  </button>
                </div>
              </div>

              {/* Bottom Home Indicator */}
              <div className="w-28 h-1 bg-white/30 rounded-full mx-auto my-1" />
            </div>

            {/* Mobile Feature Callouts */}
            <div className="max-w-md space-y-4">
              <div className="p-4 rounded-2xl bg-cyber-900 border border-white/10 space-y-1">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Flutter &amp; Native Swift/Kotlin Engines</span>
                </div>
                <p className="text-xs text-gray-400">
                  Fluid 120 FPS animations, offline SQLite syncing, background push notifications, and native hardware API bindings.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cyber-900 border border-white/10 space-y-1">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Biometric &amp; Air-Gapped Security</span>
                </div>
                <p className="text-xs text-gray-400">
                  Zero biometric leak with hardware Secure Enclave integration, encrypted keystores, and bilateral SSL pinning.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. Interactive Autonomous AI Swarm Visualizer */}
        {activeTab === "swarm" && (
          <div className="rounded-3xl luxury-card border border-purple-500/30 p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                MULTI-AGENT PIPELINE TOPOLOGY
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
                Live Data Payload Routing Across Agents
              </h3>
            </div>

            {/* Visual Node Graph Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Agent 1 */}
              <div className="p-5 rounded-2xl bg-cyber-950 border border-cyan-500/30 space-y-3 relative group hover:border-cyan-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    NODE-01
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <div className="font-bold text-white text-sm">Ingestion &amp; OCR Agent</div>
                <p className="text-xs text-gray-400">
                  Parses PDFs, scanned invoices, and unstructured inquiries into strict JSON schemas with Gemini 2.0 Flash.
                </p>
                <div className="text-[10px] font-mono text-gray-500 bg-white/5 p-2 rounded-lg truncate">
                  &#123; status: &quot;parsed&quot;, confidence: 0.998 &#125;
                </div>
              </div>

              {/* Agent 2 */}
              <div className="p-5 rounded-2xl bg-cyber-950 border border-purple-500/30 space-y-3 relative group hover:border-purple-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                    NODE-02
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                </div>
                <div className="font-bold text-white text-sm">Logic &amp; Strategy Synthesizer</div>
                <p className="text-xs text-gray-400">
                  Claude 3.7 reasoning engine matches project specifications against enterprise blueprints &amp; cost matrices.
                </p>
                <div className="text-[10px] font-mono text-purple-300 bg-purple-500/10 p-2 rounded-lg truncate">
                  &#123; decision: &quot;APPROVED&quot;, sprint_count: 4 &#125;
                </div>
              </div>

              {/* Agent 3 */}
              <div className="p-5 rounded-2xl bg-cyber-950 border border-emerald-500/30 space-y-3 relative group hover:border-emerald-400 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    NODE-03
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="font-bold text-white text-sm">WhatsApp Cloud Dispatcher</div>
                <p className="text-xs text-gray-400">
                  Sends actionable interactive cards directly to team leads and ERP webhooks via official Meta APIs.
                </p>
                <div className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 p-2 rounded-lg truncate">
                  &#123; webhook_code: 200, delivery: &quot;instant&quot; &#125;
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
