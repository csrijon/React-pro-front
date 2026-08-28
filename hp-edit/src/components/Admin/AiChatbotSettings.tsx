"use client";

import { useState } from "react";
import {
  Bot,
  Sparkles,
  Key,
  Webhook,
  Send,
  Save,
  Check,
  Eye,
  EyeOff,
  Radio,
  Sliders,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { OrganizationData } from "@/types";
import { updateOrganization, dispatchOutboundAlert, chatWithAiAssistant } from "@/lib/actions";
import WhatsAppIcon from "../WhatsAppIcon";
import { soundFX } from "../CyberAudioFx";

interface AiChatbotSettingsProps {
  organization: OrganizationData;
}

export default function AiChatbotSettings({ organization }: AiChatbotSettingsProps) {
  const [geminiApiKey, setGeminiApiKey] = useState(organization.geminiApiKey || "");
  const [geminiModelName, setGeminiModelName] = useState(organization.geminiModelName || "gemini-2.0-flash");
  const [geminiSystemPrompt, setGeminiSystemPrompt] = useState(
    organization.geminiSystemPrompt ||
      "You are the Principal AI Architect of HP Edit Enterprise (www.hpedit.com), an elite engineering studio. Answer questions authoritatively, highlight our sub-100ms performance, 100% code IP ownership, and guide them to schedule a call at /book or chat on WhatsApp."
  );

  const [calEmbedUrl, setCalEmbedUrl] = useState(organization.calEmbedUrl || "");
  const [outboundWebhookUrl, setOutboundWebhookUrl] = useState(organization.outboundWebhookUrl || "");
  const [founderAlertWhatsapp, setFounderAlertWhatsapp] = useState(organization.founderAlertWhatsapp || "+919876543210");
  const [metaWhatsappApiToken, setMetaWhatsappApiToken] = useState(organization.metaWhatsappApiToken || "");
  const [metaWhatsappPhoneId, setMetaWhatsappPhoneId] = useState(organization.metaWhatsappPhoneId || "");

  const [showApiKey, setShowApiKey] = useState(false);
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [testAiQuery, setTestAiQuery] = useState("What services do you offer and what is the typical timeline?");
  const [testAiReply, setTestAiReply] = useState("");
  const [isTestingAi, setIsTestingAi] = useState(false);

  const [testWebhookStatus, setTestWebhookStatus] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    soundFX.click();

    try {
      await updateOrganization({
        geminiApiKey,
        geminiModelName,
        geminiSystemPrompt,
        calEmbedUrl,
        outboundWebhookUrl,
        founderAlertWhatsapp,
        metaWhatsappApiToken,
        metaWhatsappPhoneId,
      });
      soundFX.success();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestAi = async () => {
    if (!testAiQuery.trim()) return;
    setIsTestingAi(true);
    setTestAiReply("");
    try {
      const res = await chatWithAiAssistant([{ role: "user", content: testAiQuery }]);
      setTestAiReply(res.reply || "No response received.");
    } catch {
      setTestAiReply("Failed to execute AI test query.");
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleTestWebhook = async () => {
    setTestWebhookStatus("Sending test packet...");
    try {
      await dispatchOutboundAlert(
        "Test Outbound Alert",
        "This is a test notification from your HP Edit Enterprise Admin Console.",
        { test: true, timestamp: new Date().toISOString() }
      );
      setTestWebhookStatus("Dispatched successfully! Check your webhook endpoint / WhatsApp.");
    } catch {
      setTestWebhookStatus("Failed to dispatch test alert.");
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">AI Engine &amp; Outbound Alert Bridges</h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              Live RAG &amp; Webhooks
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Connect free Gemini 2.0 API keys, customize chatbot persona, and configure outbound lead alerts.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all self-start sm:self-auto"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save AI & Alert Config"}</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Gemini 2.0 Flash Dynamic RAG Configuration */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-xl text-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Gemini 2.0 Flash Dynamic Chatbot</h3>
              <p className="text-[11px] text-gray-400">Powered by Google AI Studio Free Tier (No credit card needed).</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-gray-300 font-semibold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Google Gemini API Key</span>
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  placeholder="AIzaSy..."
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1.5">Selected AI Model</label>
              <select
                value={geminiModelName}
                onChange={(e) => setGeminiModelName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-900 border border-white/10 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended — Real-Time Sub-100ms)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Lightweight)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1.5">Custom System Prompt / Architect Persona</label>
              <textarea
                rows={4}
                value={geminiSystemPrompt}
                onChange={(e) => setGeminiSystemPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-cyan-400 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Test AI Query Box */}
            <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/20 space-y-3">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                ⚡ Live RAG Simulator
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={testAiQuery}
                  onChange={(e) => setTestAiQuery(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs"
                />
                <button
                  type="button"
                  disabled={isTestingAi}
                  onClick={handleTestAi}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
                >
                  {isTestingAi ? "Running..." : "Test"}
                </button>
              </div>

              {testAiReply && (
                <p className="text-[11px] text-gray-300 bg-white/5 p-3 rounded-lg border border-white/5 leading-relaxed">
                  {testAiReply}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Outbound Webhook & Meta WhatsApp Alerts */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-xl text-xs">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Webhook className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Outbound Lead Alerts &amp; Meta API</h3>
              <p className="text-[11px] text-gray-400">Receive instant alerts on Discord, Telegram, or WhatsApp.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-300 font-semibold block mb-1.5">
                Outbound Webhook URL (Discord / Zapier / n8n / Telegram)
              </label>
              <input
                type="url"
                placeholder="https://discord.com/api/webhooks/..."
                value={outboundWebhookUrl}
                onChange={(e) => setOutboundWebhookUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                Dispatches a JSON payload whenever a new discovery call, inquiry, or job application arrives.
              </p>
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1.5 flex items-center gap-1.5">
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Founder Alert WhatsApp Number</span>
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={founderAlertWhatsapp}
                onChange={(e) => setFounderAlertWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1.5">
                Meta Cloud API System Token (Optional for automated outbound WhatsApp)
              </label>
              <div className="relative">
                <input
                  type={showMetaToken ? "text" : "password"}
                  placeholder="EAAG..."
                  value={metaWhatsappApiToken}
                  onChange={(e) => setMetaWhatsappApiToken(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowMetaToken(!showMetaToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showMetaToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gray-300 font-semibold block mb-1.5">
                Meta WhatsApp Phone Number ID
              </label>
              <input
                type="text"
                placeholder="1092837465..."
                value={metaWhatsappPhoneId}
                onChange={(e) => setMetaWhatsappPhoneId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Test Alert Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleTestWebhook}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-300 border border-white/10 font-bold text-xs flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Test Alert</span>
              </button>
              {testWebhookStatus && (
                <p className="text-[10px] text-emerald-400 mt-2 font-mono">{testWebhookStatus}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
