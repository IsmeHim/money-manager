"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Calendar,
  DollarSign,
  Utensils,
} from "lucide-react";
import { askFinancialBot } from "@/app/actions";

const QUICK_CHIPS = [
  { label: "💰 ยอดเงินคงเหลือ", query: "ยอดเงินคงเหลือตอนนี้มีเท่าไร" },
  { label: "📅 วันนี้ใช้ไปเท่าไร", query: "วันนี้ผมใช้ไปเท่าไร" },
  { label: "⏪ เมื่อวานใช้ไปเท่าไร", query: "เมื่อวานนี้ผมใช้เงินไปเท่าไร" },
  { label: "🍔 กินข้าวล่าสุดวันไหน", query: "ผมกินข้าวล่าสุดวันไหน" },
  { label: "🚗 เปลี่ยนน้ำมันเครื่องล่าสุด", query: "ผมเปลี่ยนน้ำมันเครื่องล่าสุดวันไหน" },
  { label: "📶 เติมเน็ตล่าสุดวันไหน", query: "ผมเติมเน็ตล่าสุดวันไหน" },
  { label: "🗓️ สรุปเดือนนี้", query: "สรุปรายรับรายจ่ายเดือนนี้" },
];

export default function FinancialChatbotModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: `สวัสดีครับ! ผมคือผู้ช่วยการเงินส่วนตัวของคุณ 🤖✨\n\nคุณสามารถพิมพ์ถามคำถาม เช่น:\n• "ผมกินข้าวผัดเผ็ดล่าสุดวันไหน"\n• "ผมเปลี่ยนน้ำมันเครื่องล่าสุดเมื่อไหร่"\n• "ผมเติมเน็ตล่าสุดวันไหน"\n• "เมื่อวานใช้ไปเท่าไร"\n• "ยอดเงินคงเหลือตอนนี้"\nหรือแตะปุ่มลัดด้านล่างได้เลยครับ!`,
      time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await askFinancialBot(text);
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: res.response || "ขออภัยครับ ไม่สามารถดึงข้อมูลได้ในขณะนี้",
        time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้งครับ",
          time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
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
        onClick={() => setIsOpen(true)}
        aria-label="ถาม AI แชทบอทการเงิน"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-linear-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-600/40 hover:shadow-indigo-600/60 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-indigo-300/40 group"
      >
        <div className="relative">
          <Bot className="w-7 h-7 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-indigo-600 rounded-full animate-pulse"></span>
        </div>
      </button>

      {/* Chat Modal / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full sm:max-w-lg bg-white dark:bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2rem] border-t sm:border border-zinc-100 dark:border-zinc-800/80 shadow-2xl overflow-hidden h-[85vh] max-h-[700px] flex flex-col justify-between transition-all duration-300 animate-slide-up sm:animate-scale-in">
            {/* Header */}
            <div className="px-5 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5">
                    AI ผู้ช่วยการเงิน
                    <span className="text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                      In-House
                    </span>
                  </h3>
                  <p className="text-[10.5px] text-zinc-400">
                    ตอบคำถามรายรับ-รายจ่ายทันที
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
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
                      <span
                        className={`block text-[9px] mt-1.5 text-right ${
                          isBot ? "text-zinc-400 dark:text-zinc-500" : "text-indigo-200"
                        }`}
                      >
                        {msg.time}
                      </span>
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
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
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
