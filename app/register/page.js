"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  PiggyBank,
  Lock,
  User,
  Smile,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { registerAction } from "@/app/authActions";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      const res = await registerAction({
        displayName,
        username,
        password,
      });

      if (res.success) {
        if (res.token) {
          try {
            const decoded = jwtDecode(res.token);
            console.log("New registered user decoded token:", decoded);
          } catch (decodeErr) {
            console.warn("jwtDecode info:", decodeErr);
          }
        }

        router.push("/");
        router.refresh();
      } else {
        setError(res.error || "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        setLoading(false);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ: " + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-100 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Glow */}
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
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-7 shadow-2xl shadow-indigo-500/5 space-y-5 animate-scale-in">
        {/* App Logo & Title */}
        <div className="text-center space-y-1.5">
          <div className="w-13 h-13 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <PiggyBank className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
            สร้างบัญชีส่วนตัวใหม่
          </h1>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            เริ่มต้นใช้งานกระเป๋าเงินอัจฉริยะของคุณฟรี
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          {/* Display Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              ชื่อเล่น / ชื่อที่ใช้แสดง
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Smile className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="เช่น สมชาย"
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl py-2.5 pl-10 pr-3.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              ชื่อผู้ใช้สำหรับล็อกอิน (Username) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ภาษาอังกฤษหรือตัวเลข เช่น somchai99"
                autoComplete="username"
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl py-2.5 pl-10 pr-3.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              รหัสผ่าน (อย่างน้อย 6 ตัวอักษร) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl py-2.5 pl-10 pr-10 text-sm font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400"
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              ยืนยันรหัสผ่านอีกครั้ง *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-2xl py-2.5 pl-10 pr-10 text-sm font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full group flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white py-3.5 px-5 rounded-2xl font-extrabold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>กำลังสร้างบัญชี...</span>
                </>
              ) : (
                <>
                  <span>สมัครสมาชิกและเข้าใช้งาน</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="pt-3 text-center border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
            <Link
              href="/login"
              className="font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              เข้าสู่ระบบที่นี่
            </Link>
          </p>
          <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            ข้อมูลของคุณถูกแยกเป็นส่วนตัว 100%
          </p>
        </div>
      </div>
    </div>
  );
}
