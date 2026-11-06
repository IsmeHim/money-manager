"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Bot,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { getAuthSessionAction, logoutAction } from "../authActions";
import { getAdminUsers, getAiConfig } from "../adminActions";
import UserManagementTab from "@/components/admin/UserManagementTab";
import AiConfigTab from "@/components/admin/AiConfigTab";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users"); // 'users' | 'ai'
  const [message, setMessage] = useState({ text: "", type: "" });

  // Users State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // AI Config State
  const [aiConfig, setAiConfig] = useState({
    provider: "gemini",
    apiKey: "",
    model: "gemini-3.5-flash-lite",
    autoFallback: true,
    isEnabled: false,
    systemPrompt: "",
    temperature: 0.7,
  });
  const [aiLoading, setAiLoading] = useState(false);

  const showToast = useCallback((text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  }, []);

  // Check auth session
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true);
      const res = await getAuthSessionAction();
      if (!res.success || !res.user) {
        router.push("/login");
        return;
      }
      if (res.user.role !== "admin") {
        router.push("/");
        return;
      }
      setCurrentUser(res.user);
      setAuthLoading(false);
    };
    checkAuth();
  }, [router]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    const res = await getAdminUsers();
    if (res.success) {
      setUsers(res.users);
    } else {
      showToast("ดึงรายชื่อผู้ใช้ไม่สำเร็จ: " + res.error, "error");
    }
    setUsersLoading(false);
  }, [showToast]);

  // Fetch AI Config
  const fetchAiConfig = useCallback(async () => {
    setAiLoading(true);
    const res = await getAiConfig();
    if (res.success) {
      setAiConfig(res.config);
    } else {
      showToast("ดึงการตั้งค่า AI ไม่สำเร็จ: " + res.error, "error");
    }
    setAiLoading(false);
  }, [showToast]);

  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchUsers();
      fetchAiConfig();
    }
  }, [currentUser, fetchUsers, fetchAiConfig]);

  // Handle Logout
  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  if (authLoading) {
    return (
      <div className="w-full min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center space-y-3 font-sans">
        <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
        <span className="text-xs font-bold text-zinc-500">กำลังตรวจสอบสิทธิ์แอดมิน...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-100 flex flex-col font-sans">
      <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col bg-white dark:bg-zinc-950 border-x border-zinc-100 dark:border-zinc-900/60 shadow-xl relative pb-12">
        {/* Top Header */}
        <header className="px-6 pt-7 pb-4 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg z-30 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 transition-colors"
              title="กลับสู่หน้าหลัก"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                  A
                </span>
                <h1 className="text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                  ระบบหลังบ้านแอดมิน
                </h1>
              </div>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                Admin Management Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/40">
              {currentUser?.displayName || currentUser?.username}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Toast Feedback */}
        {message.text && (
          <div className="px-6 pt-3 animate-slide-up">
            <div
              className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-md ${
                message.type === "error"
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40"
                  : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40"
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-4">
          <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "users"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>จัดการผู้ใช้ ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === "ai"
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-500" />
              <span>ตั้งค่า AI (Gemini)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: User Management */}
        {activeTab === "users" && (
          <UserManagementTab
            users={users}
            usersLoading={usersLoading}
            currentUser={currentUser}
            onRefreshUsers={fetchUsers}
            showToast={showToast}
          />
        )}

        {/* Tab 2: AI Config (Gemini) */}
        {activeTab === "ai" && (
          <AiConfigTab
            aiConfig={aiConfig}
            setAiConfig={setAiConfig}
            aiLoading={aiLoading}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  );
}
