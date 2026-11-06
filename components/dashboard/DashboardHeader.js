"use client";

import React from "react";
import Link from "next/link";
import { PiggyBank, Shield, LogOut, LogIn, RefreshCw } from "lucide-react";

export default function DashboardHeader({
  currentUser,
  onLogout,
  onRefresh,
  loading,
}) {
  return (
    <header className="px-6 pt-7 pb-4 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg z-30 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/40">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
          <PiggyBank className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
            Money Manager
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            บันทึกรายรับ-รายจ่าย
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {currentUser ? (
          <>
            {currentUser.role === "admin" && (
              <Link
                href="/admin"
                className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                title="ระบบหลังบ้านแอดมิน"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}

            <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-900 py-1 px-2.5 rounded-full text-zinc-700 dark:text-zinc-200">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center uppercase">
                {currentUser.username[0]}
              </span>
              <span className="text-[11px] font-bold max-w-[70px] truncate">
                {currentUser.displayName || currentUser.username}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </Link>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 transition-colors"
          title="รีเฟรชข้อมูล"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-500" : ""}`} />
        </button>
      </div>
    </header>
  );
}
