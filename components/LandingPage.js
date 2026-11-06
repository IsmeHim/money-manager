"use client";

import React from "react";
import Link from "next/link";
import {
  PiggyBank,
  Sparkles,
  ScanLine,
  Bot,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  TrendingUp,
  TrendingDown,
  LogIn,
  UserPlus,
  Smartphone,
  Clock,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Ambient Animated Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 sm:w-[32rem] sm:h-[32rem] bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 -right-32 w-96 h-96 sm:w-[30rem] sm:h-[30rem] bg-violet-500/15 dark:bg-violet-600/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 sm:w-[28rem] sm:h-[28rem] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl animate-float-slow"></div>
      </div>

      {/* Sticky Glassmorphism Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/75 dark:bg-zinc-950/75 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                  Money Manager
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                  <Sparkles className="w-2.5 h-2.5" /> AI 2.0
                </span>
              </div>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                Smart Finance Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              ฟีเจอร์อัจฉริยะ
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              วิธีใช้งาน
            </a>
            <a href="#family" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              ระบบครอบครัว
            </a>
          </nav>

          {/* Auth CTA Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 py-2 px-3.5 sm:px-4 rounded-full text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-500" />
              <span>เข้าสู่ระบบ</span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 py-2 px-4 sm:px-5 rounded-full text-xs font-extrabold text-white bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] transition-all active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>สมัครสมาชิกฟรี</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* ================= HERO SECTION ================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Pitch & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Highlight Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/70 text-indigo-600 dark:text-indigo-300 text-xs font-extrabold shadow-xs animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                <span>ใหม่! สแกนหลายสลิปพร้อมกัน + ผู้ช่วยการเงิน AI ส่วนตัว</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight leading-[1.15] text-zinc-900 dark:text-white">
                บันทึกรายรับ-รายจ่าย{" "}
                <span className="bg-linear-to-r from-indigo-600 via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                  อัจฉริยะที่สุด
                </span>{" "}
                แค่โยนสลิปให้ AI จัดการ
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                บอกลาการนั่งพิมพ์ตัวเลขทีละรายการ! ด้วยระบบสแกนสลิปธนาคารอัตโนมัติ รองรับการแนบหลายสลิปพร้อมกัน เหมารวมยอดในคลิกเดียว พร้อมแชทบอท AI ที่ตอบคำถามการเงินของคุณได้ทันที
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white py-4 px-8 rounded-full font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  <span>เริ่มต้นใช้งานฟรีทันที</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 py-4 px-7 rounded-full font-extrabold text-sm border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-500 shadow-md shadow-zinc-900/5 active:scale-95 transition-all"
                >
                  <LogIn className="w-4 h-4 text-indigo-500" />
                  <span>เข้าสู่ระบบบัญชีของคุณ</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  รองรับสลิปทุกธนาคารไทย
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ไม่อัปโหลดรูปสลิปเก็บไว้
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  แยกบัญชีส่วนตัว & ครอบครัว
                </span>
              </div>
            </div>

            {/* Right Column: Animated Interactive Phone & Floating Cards Mockup */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Glowing backdrop behind phone */}
              <div className="absolute w-72 h-72 bg-linear-to-tr from-indigo-500/30 via-violet-500/30 to-emerald-400/20 rounded-full blur-2xl"></div>

              {/* Phone Frame */}
              <div className="relative w-full max-w-[330px] bg-white dark:bg-zinc-900 rounded-[2.5rem] border-4 border-zinc-200/80 dark:border-zinc-800 shadow-2xl p-5 space-y-4 z-10">
                {/* Notch / Speaker */}
                <div className="w-16 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto"></div>

                {/* Mockup Balance Card */}
                <div className="bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white rounded-3xl p-5 shadow-lg shadow-indigo-600/20 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100">
                      ยอดเงินคงเหลือสุทธิ
                    </span>
                    <PiggyBank className="w-4 h-4 text-indigo-200" />
                  </div>
                  <div className="text-2xl font-black tracking-tight mb-3">
                    ฿48,950.00
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-emerald-300" />
                      </div>
                      <div>
                        <p className="text-[9px] text-indigo-100">รายรับ</p>
                        <p className="font-extrabold text-emerald-300">+฿65,000</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-rose-400/20 flex items-center justify-center">
                        <TrendingDown className="w-3 h-3 text-rose-300" />
                      </div>
                      <div>
                        <p className="text-[9px] text-indigo-100">รายจ่าย</p>
                        <p className="font-extrabold text-rose-200">-฿16,050</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Slip Scanner Simulation Box */}
                <div className="relative rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-indigo-200 dark:border-indigo-900/60 p-3.5 overflow-hidden">
                  {/* Animated Laser Scan Beam */}
                  <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_8px_#6366f1] animate-scan-line"></div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <ScanLine className="w-3.5 h-3.5" />
                      กำลังสแกน 3 สลิปพร้อมกัน...
                    </span>
                    <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                      100%
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between py-1 px-2.5 rounded-xl bg-white dark:bg-zinc-900">
                      <span className="font-bold text-zinc-700 dark:text-zinc-200">1. ข้าวมันไก่</span>
                      <span className="font-black text-rose-500">-฿50.00</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-2.5 rounded-xl bg-white dark:bg-zinc-900">
                      <span className="font-bold text-zinc-700 dark:text-zinc-200">2. กาแฟอเมซอน</span>
                      <span className="font-black text-rose-500">-฿65.00</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-2.5 rounded-xl bg-white dark:bg-zinc-900">
                      <span className="font-bold text-zinc-700 dark:text-zinc-200">3. เติมน้ำมัน</span>
                      <span className="font-black text-rose-500">-฿500.00</span>
                    </div>
                  </div>
                </div>

                {/* AI Chatbot Preview Bubble inside Phone */}
                <div className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                    <Bot className="w-3.5 h-3.5" />
                    <span>ผู้ช่วย AI ตอบกลับอัตโนมัติ</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium leading-snug">
                    “เปลี่ยนน้ำมันเครื่องล่าสุดเมื่อ <strong>15 ส.ค. 2569</strong> ยอด <strong>฿850</strong> ครับ”
                  </p>
                </div>
              </div>

              {/* Floating Badge Top-Left */}
              <div className="hidden sm:flex absolute -left-6 top-10 z-20 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-3 shadow-xl items-center gap-2.5 animate-float-slow">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400">โหมดเหมารวมสลิป</p>
                  <p className="text-xs font-black text-zinc-800 dark:text-zinc-100">รวม 3 ใบ = ฿615</p>
                </div>
              </div>

              {/* Floating Badge Bottom-Right */}
              <div className="hidden sm:flex absolute -right-6 bottom-12 z-20 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-3 shadow-xl items-center gap-2.5 animate-float-delayed">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400">Family Account</p>
                  <p className="text-xs font-black text-zinc-800 dark:text-zinc-100">แชร์กระเป๋าร่วมกันได้</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BENTO GRID FEATURES ================= */}
        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Powerful Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              ทำไมทุกคนถึงหลงรัก Money Manager?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              ออกแบบมาเพื่อแก้ปัญหาคนขี้เกียจพิมพ์บันทึกรายการเอง ให้เรื่องเงินกลายเป็นเรื่องสนุกและง่ายที่สุด
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1: Multi-Slip OCR */}
            <div className="group bg-white dark:bg-zinc-900 rounded-3xl p-7 border border-zinc-200/70 dark:border-zinc-800/80 hover:border-indigo-500/50 transition-all duration-300 shadow-lg shadow-zinc-900/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold mb-2 text-zinc-900 dark:text-white">
                1. สแกนสลิปอัจฉริยะ & แนบหลายใบพร้อมกัน
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                ไม่ต้องกรอกยอดเงิน วันที่ หรือเวลาเองอีกต่อไป แค่อัปโหลดรูปสลิป (จะแนบทีละใบ หรือเลือกทีเดียว 5-10 ใบก็ได้) ระบบอ่านภาษาไทยและเลขอารบิก/เลขไทยได้แม่นยำทุกธนาคาร เลือกได้ว่าจะ <strong>“เหมารวมเป็น 1 รายการ”</strong> หรือ <strong>“บันทึกแยกทุกรายการในคลิกเดียว”</strong>
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Zap className="w-3.5 h-3.5" />
                <span>รองรับ กสิกร, ไทยพาณิชย์, กรุงไทย, กรุงเทพ, ttb, ออมสิน ฯลฯ</span>
              </div>
            </div>

            {/* Feature 2: AI Financial Bot */}
            <div className="group bg-white dark:bg-zinc-900 rounded-3xl p-7 border border-zinc-200/70 dark:border-zinc-800/80 hover:border-violet-500/50 transition-all duration-300 shadow-lg shadow-zinc-900/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold mb-2 text-zinc-900 dark:text-white">
                2. แชทบอท AI เลขาการเงินส่วนตัว
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                อยากรู้ว่าเคยจ่ายอะไรไปวันไหน ไม่ต้องเลื่อนหาเอง แค่พิมพ์ถามแชทบอท เช่น <em>“ผมกินข้าวผัดล่าสุดวันไหน”</em>, <em>“เปลี่ยนน้ำมันเครื่องล่าสุดเมื่อไหร่”</em> หรือ <em>“วันที่ 28 สิงหา ใช้ไปกี่บาท”</em> AI จะค้นหาคำตอบพร้อมรวมยอดให้ทันที
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>รองรับทั้งระบบ In-House NLP และ Google Gemini API</span>
              </div>
            </div>

            {/* Feature 3: Family & Personal Mode */}
            <div id="family" className="group bg-white dark:bg-zinc-900 rounded-3xl p-7 border border-zinc-200/70 dark:border-zinc-800/80 hover:border-emerald-500/50 transition-all duration-300 shadow-lg shadow-zinc-900/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold mb-2 text-zinc-900 dark:text-white">
                3. แยกกระเป๋าส่วนตัว หรือแชร์ร่วมกันในครอบครัว (Family)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                สมัครสมาชิกใหม่เพื่อใช้กระเป๋าเงินส่วนตัวที่ปลอดภัยและแยกข้อมูลเป็นอิสระ 100% หรือเพิ่มบัญชีสมาชิกในครอบครัวเพื่อช่วยกันบันทึกรายรับ-รายจ่ายเข้ากองกลางเดียวกันได้อย่างลงตัว
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Lock className="w-3.5 h-3.5" />
                <span>ปกป้องข้อมูลด้วยระบบ JWT Session นาน 7 วัน</span>
              </div>
            </div>

            {/* Feature 4: Visual Analytics */}
            <div className="group bg-white dark:bg-zinc-900 rounded-3xl p-7 border border-zinc-200/70 dark:border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 shadow-lg shadow-zinc-900/5 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold mb-2 text-zinc-900 dark:text-white">
                4. กราฟสรุปสถิติ รายวัน / รายเดือน / รายปี
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                เห็นภาพรวมสุขภาพทางการเงินของคุณอย่างชัดเจน แบ่งสัดส่วนตามหมวดหมู่ (อาหาร, เดินทาง, ช้อปปิ้ง, ค่าบ้าน ฯลฯ) พร้อมเปอร์เซ็นต์เปรียบเทียบให้วางแผนใช้เงินได้ดียิ่งขึ้น
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <Smartphone className="w-3.5 h-3.5" />
                <span>รองรับทุกหน้าจอ ทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS (3 STEPS) ================= */}
        <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/70 dark:border-zinc-800 rounded-[2.5rem] p-8 sm:p-12 shadow-xl">
            <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Simple Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                เริ่มต้นใช้งานง่ายๆ ใน 3 ขั้นตอน
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                  1
                </div>
                <h3 className="text-base font-extrabold">สมัครสมาชิกฟรี</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  ตั้งชื่อผู้ใช้และรหัสผ่านของคุณ ใช้เวลาไม่ถึง 10 วินาที ระบบสร้างกระเป๋าเงินส่วนตัวให้ทันที
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-violet-600/30">
                  2
                </div>
                <h3 className="text-base font-extrabold">สแกนสลิปหรือจดรายการ</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  เลือกรูปสลิปใบเดียวหรือหลายใบพร้อมกัน ระบบดึงยอดเงินและวันที่ให้อัตโนมัติแบบไม่ต้องพิมพ์เอง
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                  3
                </div>
                <h3 className="text-base font-extrabold">ดูกราฟ & ถาม AI ได้ตลอด</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  ตรวจสอบยอดเงินคงเหลือ ดูกราฟรายเดือน หรือพิมพ์ถามแชทบอท AI ได้ทุกเมื่อที่ต้องการ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BOTTOM CTA BANNER ================= */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
          <div className="bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 rounded-[2.5rem] p-8 sm:p-14 text-center text-white shadow-2xl shadow-indigo-600/25 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <PiggyBank className="w-64 h-64" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                พร้อมเริ่มต้นบริหารเงินอย่างชาญฉลาดหรือยัง?
              </h2>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                สร้างบัญชีส่วนตัวของคุณวันนี้ ฟรีทุกฟีเจอร์ ทั้งสแกนหลายสลิปและแชทบอท AI อัจฉริยะ
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-indigo-600 hover:bg-indigo-50 py-3.5 px-8 rounded-full font-extrabold text-sm shadow-xl transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>สมัครสมาชิกใหม่ฟรี</span>
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-700/50 hover:bg-indigo-700/70 text-white border border-white/25 py-3.5 px-7 rounded-full font-bold text-sm transition-all active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>เข้าสู่ระบบ</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/60 dark:border-zinc-900 py-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-zinc-600 dark:text-zinc-400">
            <PiggyBank className="w-4 h-4 text-indigo-500" />
            <span>Money Manager • Smart AI Expense Tracker</span>
          </div>
          <p>© {new Date().getFullYear() + 543} Money Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
