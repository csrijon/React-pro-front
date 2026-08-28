"use client";

import { useState } from "react";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Clock,
  Globe,
  MessageSquare,
  Save,
  CheckCircle2,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { OrganizationData } from "@/types";
import { updateOrganization } from "@/lib/actions";

interface OrgSettingsFormProps {
  organization: OrganizationData;
}

export default function OrgSettingsForm({ organization }: OrgSettingsFormProps) {
  const [formData, setFormData] = useState<Partial<OrganizationData>>({
    name: organization.name || "HP Edit Enterprise",
    tagline: organization.tagline || "",
    description: organization.description || "",
    address: organization.address || "",
    city: organization.city || "",
    country: organization.country || "",
    postalCode: organization.postalCode || "",
    primaryPhone: organization.primaryPhone || "",
    secondaryPhone: organization.secondaryPhone || "",
    whatsappNumber: organization.whatsappNumber || "",
    whatsappDefaultMessage: organization.whatsappDefaultMessage || "",
    primaryEmail: organization.primaryEmail || "",
    salesEmail: organization.salesEmail || "",
    supportEmail: organization.supportEmail || "",
    googleMapsEmbed: organization.googleMapsEmbed || "",
    businessHours: organization.businessHours || "",
    availabilityStatus: organization.availabilityStatus || "",
    linkedinUrl: organization.linkedinUrl || "",
    githubUrl: organization.githubUrl || "",
    twitterUrl: organization.twitterUrl || "",
    instagramUrl: organization.instagramUrl || "",
    youtubeUrl: organization.youtubeUrl || "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      let cleanMaps = formData.googleMapsEmbed || "";
      if (cleanMaps.includes("<iframe")) {
        const match = cleanMaps.match(/src=["']([^"']+)["']/);
        if (match && match[1]) cleanMaps = match[1];
      }

      const payload = {
        ...formData,
        googleMapsEmbed: cleanMaps,
      };

      const res = await updateOrganization(payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError("Failed to update settings.");
      }
    } catch {
      setError("An error occurred while saving organization settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Banner Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl glass-panel border border-cyan-500/30">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-cyan-400" />
            <span>Organization Profile &amp; Contact Management</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Changes made here update the live homepage, contact section, and footer in real-time.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish Changes</span>
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Organization settings saved and published to the live website!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* 1. General Brand Info */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Brand Identity &amp; Positioning</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Organization Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Brand Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Company Bio / Executive Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Availability Status Badge
          </label>
          <input
            type="text"
            name="availabilityStatus"
            value={formData.availabilityStatus || ""}
            onChange={handleChange}
            placeholder="e.g. 🚀 Accepting High-Impact Projects for 2026"
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Physical Address & Location */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>Headquarters &amp; Office Address</span>
        </h3>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Street Address / Tech Park / Suite
          </label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            placeholder="Executive Tech Hub, Suite 404, Cyber City"
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">City</label>
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Postal / PIN Code</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Google Maps Embed Iframe URL
          </label>
          <input
            type="text"
            name="googleMapsEmbed"
            value={formData.googleMapsEmbed || ""}
            onChange={handleChange}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* 3. Phone & WhatsApp Configuration */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Telephone &amp; WhatsApp Integration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Primary Phone Number
            </label>
            <input
              type="text"
              name="primaryPhone"
              value={formData.primaryPhone || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Secondary / Landline Phone (Optional)
            </label>
            <input
              type="text"
              name="secondaryPhone"
              value={formData.secondaryPhone || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              WhatsApp Number (with country code, e.g. +919876543210)
            </label>
            <input
              type="text"
              name="whatsappNumber"
              value={formData.whatsappNumber || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">
              Business Hours
            </label>
            <input
              type="text"
              name="businessHours"
              value={formData.businessHours || ""}
              onChange={handleChange}
              placeholder="Mon - Sat: 9:00 AM - 8:30 PM (IST)"
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300 block mb-1.5">
            Default WhatsApp Click-to-Chat Message
          </label>
          <input
            type="text"
            name="whatsappDefaultMessage"
            value={formData.whatsappDefaultMessage || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 4. Official Emails & Social Channels */}
      <div className="rounded-2xl glass-panel p-6 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-white/10">
          <Mail className="w-3.5 h-3.5 text-purple-400" />
          <span>Official Emails &amp; Social Links</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Primary Email</label>
            <input
              type="email"
              name="primaryEmail"
              value={formData.primaryEmail || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Sales Email</label>
            <input
              type="email"
              name="salesEmail"
              value={formData.salesEmail || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Support Email</label>
            <input
              type="email"
              name="supportEmail"
              value={formData.supportEmail || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">LinkedIn Profile</label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">GitHub Profile</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Twitter / X Profile</label>
            <input
              type="url"
              name="twitterUrl"
              value={formData.twitterUrl || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">Instagram Profile</label>
            <input
              type="url"
              name="instagramUrl"
              value={formData.instagramUrl || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1.5">YouTube Channel</label>
            <input
              type="url"
              name="youtubeUrl"
              value={formData.youtubeUrl || ""}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 text-white text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all duration-200 disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Publishing Updates...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Live Publish Updates</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
