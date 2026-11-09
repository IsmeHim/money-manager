"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  MessageSquare,
  MoreVertical,
  Pin,
  PinOff,
  Trash2,
  Clock,
} from "lucide-react";

function formatSessionDate(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function ChatSidebar({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onStartNewChat,
  onTogglePin,
  onDeleteSession,
  loading,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  if (!isOpen) return null;

  const pinnedSessions = (sessions || []).filter((s) => s.isPinned);
  const recentSessions = (sessions || []).filter((s) => !s.isPinned);

  const renderSessionItem = (session) => {
    const isActive = activeSessionId === session.id;
    const isMenuOpen = openMenuId === session.id;

    return (
      <div
        key={session.id}
        className={`relative group flex items-center justify-between gap-2 px-3 py-2.5 rounded-2xl transition-all cursor-pointer ${
          isActive
            ? "bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30"
            : "hover:bg-zinc-100 dark:hover:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 border border-transparent"
        }`}
        onClick={() => {
          setOpenMenuId(null);
          onSelectSession(session);
        }}
      >
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div
            className={`mt-0.5 shrink-0 ${
              session.isPinned
                ? "text-amber-500 dark:text-amber-400"
                : isActive
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {session.isPinned ? (
              <Pin className="w-3.5 h-3.5 fill-current" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold truncate leading-snug">
              {session.title}
            </p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
              <span>{formatSessionDate(session.updatedAt)}</span>
              <span>•</span>
              <span>{Math.ceil((session.messageCount || 2) / 2)} คำถาม</span>
            </p>
          </div>
        </div>

        {/* 3-Dots Action Button (Gemini Style) */}
        <div
          className="relative shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuId(isMenuOpen ? null : session.id);
          }}
        >
          <button
            type="button"
            aria-label="ตัวเลือกแชท"
            className={`p-1.5 rounded-xl transition-colors ${
              isMenuOpen
                ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100"
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60"
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu: ปักหมุด / ลบแชท */}
          {isMenuOpen && (
            <div
              className="absolute right-0 top-8 z-30 w-40 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl py-1.5 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setOpenMenuId(null);
                  onTogglePin(session.id);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-bold flex items-center gap-2.5 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {session.isPinned ? (
                  <>
                    <PinOff className="w-3.5 h-3.5 text-amber-500" />
                    <span>เลิกปักหมุด</span>
                  </>
                ) : (
                  <>
                    <Pin className="w-3.5 h-3.5 text-amber-500" />
                    <span>ปักหมุดแชทนี้</span>
                  </>
                )}
              </button>

              <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

              <button
                type="button"
                onClick={() => {
                  setOpenMenuId(null);
                  onDeleteSession(session.id);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-bold flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบประวัติแชทนี้</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 z-30 flex">
      {/* Backdrop inside Modal */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] animate-fade-in"
        onClick={() => {
          setOpenMenuId(null);
          onClose();
        }}
      />

      {/* Sidebar Drawer */}
      <div
        className="relative z-10 w-72 max-w-[82%] h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col shadow-2xl animate-fade-in"
        onClick={() => setOpenMenuId(null)}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
              ประวัติการแชท (Gemini Style)
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              setOpenMenuId(null);
              onStartNewChat();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>เริ่มแชทใหม่ (New Chat)</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-4 scrollbar-thin">
          {loading ? (
            <div className="space-y-2 pt-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 animate-pulse"
                />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-10 px-4">
              <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                ยังไม่มีประวัติการแชท
              </p>
              <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 mt-1">
                เมื่อคุณเริ่มถามคำถาม ประวัติแชทแต่ละรอบจะถูกบันทึกไว้ที่นี่อัตโนมัติ
              </p>
            </div>
          ) : (
            <>
              {/* Pinned Section */}
              {pinnedSessions.length > 0 && (
                <div className="space-y-1">
                  <p className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Pin className="w-3 h-3 fill-current" />
                    <span>ปักหมุดแล้ว ({pinnedSessions.length})</span>
                  </p>
                  <div className="space-y-1">
                    {pinnedSessions.map(renderSessionItem)}
                  </div>
                </div>
              )}

              {/* Recent Section */}
              {recentSessions.length > 0 && (
                <div className="space-y-1">
                  <p className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    แชทล่าสุด ({recentSessions.length})
                  </p>
                  <div className="space-y-1">
                    {recentSessions.map(renderSessionItem)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
