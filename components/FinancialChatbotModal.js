"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  PanelLeft,
  SquarePen,
} from "lucide-react";
import { askFinancialBot } from "@/app/actions";
import {
  getChatSessionsAction,
  togglePinChatSessionAction,
  deleteChatSessionAction,
} from "@/app/chatHistoryActions";
import ChatSidebar from "@/components/chat/ChatSidebar";

const QUICK_CHIPS = [
  { label: "💰 ยอดเงินคงเหลือ", query: "ยอดเงินคงเหลือตอนนี้มีเท่าไร" },
  { label: "📅 วันนี้ใช้ไปเท่าไร", query: "วันนี้ผมใช้ไปเท่าไร" },
  { label: "⏪ เมื่อวานใช้ไปเท่าไร", query: "เมื่อวานนี้ผมใช้เงินไปเท่าไร" },
  { label: "🍔 กินข้าวล่าสุดวันไหน", query: "ผมกินข้าวล่าสุดวันไหน" },
  { label: "📒 ใครติดหนี้ผมบ้าง", query: "ตอนนี้ใครติดหนี้ผมอยู่บ้าง และผมติดหนี้ใครอยู่เท่าไหร่" },
  { label: "🗓️ สรุปเดือนนี้", query: "สรุปรายรับรายจ่ายเดือนนี้" },
];

const WELCOME_MSG = {
  id: "welcome",
  sender: "bot",
  text: `สวัสดีครับ! ผมคือผู้ช่วย AI การเงินส่วนตัวของคุณ 🤖✨\n\nคุณสามารถพิมพ์ถามคำถามจากข้อมูลบัญชีของคุณได้เลย เช่น:\n• "ตั้งแต่วันที่ 3 พ.ย. ถึงปัจจุบันผมใช้เงินไปเท่าไหร่"\n• "สรุปรายจ่ายเดือนตุลาคมให้หน่อย"\n• "ผมกินข้าวผัดเผ็ดล่าสุดวันไหน"\n• "ตอนนี้ใครติดหนี้ผมอยู่บ้าง"\nหรือแตะปุ่มเมนูด้านซ้ายบนเพื่อเปิดดูประวัติแชทเก่าได้ตลอดเวลาครับ!`,
  time: "",
};

function sortSessions(list) {
  return [...list].sort((a, b) => {
    if (Boolean(b.isPinned) !== Boolean(a.isPinned)) {
      return b.isPinned ? 1 : -1;
    }
    const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return timeB - timeA;
  });
}

export default function FinancialChatbotModal({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeSessionTitle, setActiveSessionTitle] = useState(null);
  const [messages, setMessages] = useState([WELCOME_MSG]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const msgIdRef = useRef(1);

  const loadSessions = useCallback(async () => {
    if (!currentUser) return;
    setSessionsLoading(true);
    try {
      const res = await getChatSessionsAction();
      if (res.success && Array.isArray(res.sessions)) {
        setSessions(sortSessions(res.sessions));
      }
    } catch {
      // ignore error
    } finally {
      setSessionsLoading(false);
    }
  }, [currentUser]);

  // Every time the user opens the chatbot modal, start as a fresh New Chat (Gemini style)
  // while loading past sessions in the background for the Sidebar
  const handleOpenModal = () => {
    setActiveSessionId(null);
    setActiveSessionTitle(null);
    setMessages([WELCOME_MSG]);
    setSidebarOpen(false);
    setIsOpen(true);
    loadSessions();
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when opened or switching sessions
  useEffect(() => {
    if (isOpen && !sidebarOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, sidebarOpen, activeSessionId]);

  const handleStartNewChat = () => {
    setActiveSessionId(null);
    setActiveSessionTitle(null);
    setMessages([WELCOME_MSG]);
    setSidebarOpen(false);
  };

  const handleSelectSession = (session) => {
    setActiveSessionId(session.id);
    setActiveSessionTitle(session.title);
    setMessages([WELCOME_MSG, ...(session.messages || [])]);
    setSidebarOpen(false);
  };

  const handleTogglePin = async (sessionId) => {
    setSessions((prev) =>
      sortSessions(
        prev.map((s) =>
          s.id === sessionId ? { ...s, isPinned: !s.isPinned } : s
        )
      )
    );
    await togglePinChatSessionAction(sessionId);
  };

  const handleDeleteSession = async (sessionId) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setActiveSessionTitle(null);
      setMessages([WELCOME_MSG]);
    }
    await deleteChatSessionAction(sessionId);
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    msgIdRef.current += 1;
    const tempUserId = `user-temp-${msgIdRef.current}`;
    const nowTime = new Date().toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = {
      id: tempUserId,
      sender: "user",
      text,
      time: nowTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await askFinancialBot(text, activeSessionId);
      msgIdRef.current += 1;
      const finalUserMsg = {
        ...userMsg,
        id: res.userMessageId || tempUserId,
      };
      const botMsg = {
        id: res.botMessageId || `bot-${msgIdRef.current}`,
        sender: "bot",
        text: res.response || "ขออภัยครับ ไม่สามารถดึงข้อมูลได้ในขณะนี้",
        usedModel: res.usedModel || null,
        fallbackUsed: Boolean(res.fallbackUsed),
        source: res.source || "local",
        time: new Date().toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) =>
        prev
          .map((m) => (m.id === tempUserId ? finalUserMsg : m))
          .concat(botMsg)
      );

      if (res.sessionId) {
        const targetSessionId = res.sessionId;
        const targetTitle = res.sessionTitle || activeSessionTitle || text.slice(0, 42);
        setActiveSessionId(targetSessionId);
        setActiveSessionTitle(targetTitle);

        // Update local sidebar sessions list immediately
        setSessions((prev) => {
          const exists = prev.some((s) => s.id === targetSessionId);
          const nowIso = new Date().toISOString();
          if (exists) {
            return sortSessions(
              prev.map((s) =>
                s.id === targetSessionId
                  ? {
                      ...s,
                      updatedAt: nowIso,
                      messageCount: (s.messages?.length || 0) + 2,
                      messages: [...(s.messages || []), finalUserMsg, botMsg],
                    }
                  : s
              )
            );
          } else {
            const newSessionItem = {
              id: targetSessionId,
              title: targetTitle,
              isPinned: false,
              createdAt: nowIso,
              updatedAt: nowIso,
              messageCount: 2,
              messages: [finalUserMsg, botMsg],
            };
            return sortSessions([newSessionItem, ...prev]);
          }
        });
      }
    } catch {
      msgIdRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${msgIdRef.current}`,
          sender: "bot",
          text: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งครับ",
          time: new Date().toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={handleOpenModal}
        aria-label="ถาม AI แชทบอทการเงิน"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-linear-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-600/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-indigo-300/40 group"
      >
        <div className="relative">
          <Bot className="w-7 h-7 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full animate-pulse" />
        </div>
      </button>

      {/* Chat Modal / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full sm:max-w-lg bg-white dark:bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2rem] border-t sm:border border-zinc-100 dark:border-zinc-800/80 shadow-2xl overflow-hidden h-[85vh] max-h-[700px] flex flex-col justify-between transition-all duration-300 animate-slide-up sm:animate-scale-in">
            {/* Gemini-Style Sidebar Drawer */}
            <ChatSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={handleSelectSession}
              onStartNewChat={handleStartNewChat}
              onTogglePin={handleTogglePin}
              onDeleteSession={handleDeleteSession}
              loading={sessionsLoading}
            />

            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Sidebar Toggle Button */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="relative p-2.5 rounded-2xl bg-white dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-zinc-700 dark:text-zinc-200 border border-zinc-200/80 dark:border-zinc-700/70 transition-all active:scale-95 shrink-0 shadow-2xs"
                  title="เปิดแถบประวัติแชท (Sidebar)"
                >
                  <PanelLeft className="w-4.5 h-4.5" />
                  {sessions.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold flex items-center justify-center">
                      {sessions.length}
                    </span>
                  )}
                </button>

                <div className="w-9 h-9 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
                  <Bot className="w-4.5 h-4.5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                    <span className="truncate">AI ผู้ช่วยการเงิน</span>
                    <span className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full shrink-0">
                      Smart AI
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-zinc-400 truncate max-w-[180px] sm:max-w-[230px]">
                    {activeSessionTitle
                      ? `💬 ${activeSessionTitle}`
                      : currentUser
                      ? `แชทใหม่ • บัญชี @${currentUser.walletOwner || currentUser.username}`
                      : "แชทใหม่ • ตอบคำถามทันที"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* New Chat Quick Action Button */}
                {activeSessionId && (
                  <button
                    type="button"
                    onClick={handleStartNewChat}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-[11px] font-extrabold transition-colors"
                    title="เริ่มแชทใหม่"
                  >
                    <SquarePen className="w-3.5 h-3.5" />
                    <span>แชทใหม่</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"} animate-fade-in`}
                  >
                    {isBot && (
                      <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1 border border-indigo-100 dark:border-indigo-900/30">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                        isBot
                          ? "bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-100 rounded-tl-xs border border-zinc-200/50 dark:border-zinc-700/40 font-medium"
                          : "bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-xs font-semibold shadow-indigo-600/20"
                      }`}
                    >
                      {msg.text}
                      <div
                        className={`flex items-center justify-between gap-2 mt-1.5 ${
                          isBot ? "text-zinc-400 dark:text-zinc-500" : "text-indigo-200"
                        }`}
                      >
                        {isBot && msg.usedModel ? (
                          <span className="text-[9px] font-mono font-bold text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Money Manager AI
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="text-[9px]">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-center gap-2.5 animate-fade-in">
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/30">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-xs py-2.5 px-4 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none">
              {QUICK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.query)}
                  disabled={loading}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-bold border border-zinc-200 dark:border-zinc-700/60 transition-all active:scale-95 shrink-0 shadow-2xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl px-3.5 py-1.5 border border-zinc-200/60 dark:border-zinc-700/40 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="พิมพ์ถามคำถามการเงิน เช่น เมื่อวานใช้ไปเท่าไร..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1 bg-transparent text-xs py-2 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 outline-hidden"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
