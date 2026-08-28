"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  Trash2,
  Inbox,
  Briefcase,
  ShieldAlert,
  FileText,
  Settings,
  ExternalLink
} from "lucide-react";
import { AdminNotificationData } from "@/types";
import { markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications } from "@/lib/actions";
import { soundFX } from "../CyberAudioFx";

interface AdminNotificationsMenuProps {
  notifications: AdminNotificationData[];
  onSelectTab?: (tabId: string) => void;
}

export default function AdminNotificationsMenu({
  notifications: initialNotifications,
  onSelectTab,
}: AdminNotificationsMenuProps) {
  const [notifications, setNotifications] = useState<AdminNotificationData[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.click();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markNotificationAsRead(id);
  };

  const handleMarkAllRead = async () => {
    soundFX.click();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsAsRead();
  };

  const handleClearAll = async () => {
    soundFX.click();
    setNotifications([]);
    await clearAllNotifications();
  };

  const handleItemClick = (notification: AdminNotificationData) => {
    soundFX.click();
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
      markNotificationAsRead(notification.id);
    }
    if (onSelectTab && notification.linkTab) {
      onSelectTab(notification.linkTab);
      setIsOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "LEAD":
        return <Inbox className="w-4 h-4 text-cyan-400" />;
      case "APPLICANT":
        return <Briefcase className="w-4 h-4 text-purple-400" />;
      case "THREAT":
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "PROPOSAL":
        return <FileText className="w-4 h-4 text-emerald-400" />;
      default:
        return <Settings className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Button with Badge */}
      <button
        type="button"
        onClick={() => {
          soundFX.click();
          setIsOpen(!isOpen);
        }}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
        title="Admin Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl glass-dropdown border border-cyan-500/30 p-4 shadow-2xl z-50 animate-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-gray-400 hover:text-cyan-400 text-[11px] font-medium"
                >
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-gray-500 hover:text-rose-400"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="mt-3 max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                No notifications right now. System is running smoothly.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    item.isRead
                      ? "bg-white/2 border-white/5 opacity-70 hover:opacity-100 hover:bg-white/5"
                      : "bg-cyan-500/10 border-cyan-500/30 shadow-glow-cyan/10"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <span className="text-[10px] text-gray-500 font-mono shrink-0 ml-1">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  {!item.isRead && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkAsRead(item.id, e)}
                      className="p-1 rounded-lg hover:bg-white/10 text-cyan-400 shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
