"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  PiggyBank,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { loginAction } from "@/app/authActions";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setLoading(true);

    try {
      const res = await loginAction({ username, password });
      if (res.success) {
        if (res.token) {
          try {
            const decoded = jwtDecode(res.token);
            console.log("Logged in session decoded payload:", decoded);
          } catch (decodeErr) {
            console.warn("jwtDecode info:", decodeErr);
          }
        }

        router.push("/");
        router.refresh();
      } else {
        setError(res.error || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        setLoading(false);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-100 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to Landing Link */}
      <div className="w-full max-w-sm mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก</span>
        </Link>
      </div>

      {/* Card Container */}
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-7 shadow-2xl shadow-indigo-500/5 space-y-6 animate-scale-in">
        {/* App Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <PiggyBank className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
            เข้าสู่ระบบ Money Manager
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            เข้าสู่ระบบเพื่อจัดการรายรับ-รายจ่ายของคุณ
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              ชื่อผู้ใช้ (Username)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                autoComplete="username"
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl py-3 pl-10 pr-3.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl py-3 pl-10 pr-10 text-sm font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              จดจำการเข้าสู่ระบบ 7 วัน
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full group flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white py-3.5 px-5 rounded-2xl font-extrabold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              <>
                <span>เข้าสู่ระบบ</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer info & Register Link */}
        <div className="pt-3 text-center border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            ยังไม่มีบัญชีผู้ใช้งาน?{" "}
            <Link
              href="/register"
              className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              สมัครสมาชิกฟรีที่นี่
            </Link>
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            ระบบความปลอดภัย JWT Authentication • แยกข้อมูลตามบัญชีผู้ใช้
          </p>
        </div>
      </div>
    </div>
  );
}
