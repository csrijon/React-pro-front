"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Video,
  Search,
  ExternalLink,
  Trash2,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  Filter
} from "lucide-react";
import { BookingData } from "@/types";
import { updateBookingStatus, deleteBooking } from "@/lib/actions";
import WhatsAppIcon from "../WhatsAppIcon";
import { soundFX } from "../CyberAudioFx";

interface BookingsManagerProps {
  initialBookings: BookingData[];
}

export default function BookingsManager({ initialBookings }: BookingsManagerProps) {
  const [bookings, setBookings] = useState<BookingData[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesEmail = b.email.toLowerCase().includes(q);
        const matchesTopic = b.topic.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesTopic) return false;
      }
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      return true;
    });
  }, [bookings, search, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    soundFX.click();
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    await updateBookingStatus(id, newStatus);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to cancel and delete this discovery booking?")) return;
    soundFX.click();
    await deleteBooking(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">Video Discovery Call Scheduler</h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {filtered.length} Bookings
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Confirmed client video discovery calls, architecture deep-dives, and meeting links.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, or discussion topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-cyber-900 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-gray-500 rounded-3xl glass-panel border border-white/10 text-xs">
          No video discovery calls recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-3xl glass-panel border border-white/10 hover:border-cyan-500/30 transition-all space-y-4 shadow-lg text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{b.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {b.meetingType}
                    </span>
                  </div>
                  <div className="text-gray-400 text-[11px] mt-0.5 flex items-center gap-2">
                    <span>{b.email}</span>
                    {b.phone && <span>• {b.phone}</span>}
                  </div>
                </div>

                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                    b.status === "CONFIRMED"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : b.status === "COMPLETED"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                      : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  }`}
                >
                  <option value="CONFIRMED" className="bg-cyber-950 text-white">CONFIRMED</option>
                  <option value="COMPLETED" className="bg-cyber-950 text-white">COMPLETED</option>
                  <option value="CANCELLED" className="bg-cyber-950 text-white">CANCELLED</option>
                </select>
              </div>

              {/* Schedule Info */}
              <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-1.5 font-mono text-[11px]">
                <div className="text-gray-300 flex items-center justify-between">
                  <span>📅 {b.bookingDate} at {b.bookingTime}</span>
                  <span className="text-cyan-400">{b.timezone}</span>
                </div>
                <div className="text-gray-400 flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span className="truncate">{b.platform} • </span>
                  {b.meetingLink ? (
                    <a
                      href={b.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 truncate"
                    >
                      <span>Join Call</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span>Direct Call</span>
                  )}
                </div>
              </div>

              {/* Topic brief */}
              <p className="text-gray-300 text-[11px] bg-white/3 p-3 rounded-xl border border-white/5 line-clamp-2">
                &ldquo;{b.topic}&rdquo;
              </p>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-gray-500 font-mono">
                <span>Booked: {new Date(b.createdAt).toLocaleDateString()}</span>

                <div className="flex items-center gap-2">
                  {b.phone && (
                    <a
                      href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                      title="WhatsApp Lead"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <a
                    href={`mailto:${b.email}?subject=HP Edit Discovery Call Confirmation`}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300"
                    title="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    title="Delete Booking"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
