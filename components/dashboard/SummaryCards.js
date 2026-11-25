"use client";

import React, { useState } from "react";
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Zap,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatThaiDate } from "@/lib/dateFormatter";
import CategoryIcon from "@/components/CategoryIcon";

function formatMoney(val) {
  const num = Number(val) || 0;
  const hasDecimals = Math.abs(num % 1) > 0.001;
  return num.toLocaleString("th-TH", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

export default function SummaryCards({ summary }) {
  const [showCycleExpenses, setShowCycleExpenses] = useState(false);
  const cycle = summary?.latestIncomeCycle || null;

  // Dynamic color theme for Latest Income Progress Bar
  const spentPct = cycle ? cycle.spentPercent : 0;
  const clampedBarWidth = Math.min(Math.max(spentPct, 0), 100);
  const isOverSpent = cycle ? cycle.remainingFromIncome < 0 : false;

  const progressBarColor =
    spentPct > 85 || isOverSpent
      ? "from-rose-500 via-rose-500 to-pink-600"
      : spentPct > 60
      ? "from-amber-500 via-orange-500 to-amber-600"
      : "from-emerald-500 via-teal-500 to-emerald-600";

  const statusBadgeStyle =
    spentPct > 85 || isOverSpent
      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
      : spentPct > 60
      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300";

  return (
    <section className="space-y-4">
      {/* Total Balance Card */}
      <div className="bg-linear-to-br from-indigo-600 via-indigo-500 to-indigo-700 text-white rounded-3xl p-6 shadow-xl shadow-indigo-600/15 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-3 translate-y-3">
          <PiggyBank className="w-32 h-32" />
        </div>
        <p className="text-xs font-semibold text-indigo-100/90 uppercase tracking-widest mb-1.5">
          ยอดเงินคงเหลือสุทธิ
        </p>
        <h2 className="text-3xl font-black tracking-tight">
          ฿{formatMoney(summary.balance)}
        </h2>
      </div>

      {/* Income / Expense Cards Row */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Income */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/15 border border-emerald-100/40 dark:border-emerald-950/30 rounded-3xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              รายรับสะสม
            </span>
          </div>
          <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
            ฿{formatMoney(summary.totalIncome)}
          </p>
        </div>

        {/* Expense */}
        <div className="bg-rose-50/60 dark:bg-rose-950/15 border border-rose-100/40 dark:border-rose-950/30 rounded-3xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              รายจ่ายสะสม
            </span>
          </div>
          <p className="text-lg font-extrabold text-rose-700 dark:text-rose-400">
            ฿{formatMoney(summary.totalExpense)}
          </p>
        </div>
      </div>

      {/* Latest Income Cycle Tracker Card (รอบรายรับล่าสุด & รายจ่ายตั้งแต่รายรับล่าสุด) */}
      {cycle && (
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/70 dark:border-zinc-800/90 rounded-3xl p-4.5 shadow-sm space-y-3.5 transition-all">
          {/* Top Row: Latest Income Info & Amount */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
                    รายรับล่าสุด
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {cycle.category}
                  </span>
                </div>
                {cycle.description && (
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[190px] mt-0.5">
                    {cycle.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" />
                    {formatThaiDate(cycle.dateStr, "daily")}
                  </span>
                  {cycle.timeStr && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {cycle.timeStr}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-zinc-400 block">
                ยอดรายรับเข้า
              </span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                +฿{formatMoney(cycle.amount)}
              </span>
            </div>
          </div>

          {/* Middle Row: Spent Since Latest Income vs Remaining from this Income */}
          <div className="grid grid-cols-2 gap-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-3 border border-zinc-100 dark:border-zinc-800/80">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 block">
                💸 ใช้ไปตั้งแต่รับยอดนี้
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                  -฿{formatMoney(cycle.spentSince)}
                </span>
              </div>
              <span className="text-[9.5px] text-zinc-400 font-medium">
                รวม {cycle.expenseCount} รายการจ่าย
              </span>
            </div>

            <div className="text-right border-l border-zinc-200/70 dark:border-zinc-700/60 pl-2.5">
              <span className="text-[10px] font-bold text-zinc-400 block">
                {isOverSpent ? "⚠️ ใช้เกินยอดรับล่าสุด" : "💰 คงเหลือจากก้อนนี้"}
              </span>
              <div className="mt-0.5">
                <span
                  className={`text-sm font-black ${
                    isOverSpent
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {isOverSpent ? "-" : ""}฿{formatMoney(Math.abs(cycle.remainingFromIncome))}
                </span>
              </div>
              <span className="text-[9.5px] text-zinc-400 font-medium">
                {isOverSpent
                  ? `เกินมา ${spentPct - 100}%`
                  : `เหลืออีก ${Math.max(100 - spentPct, 0)}%`}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">
                สัดส่วนการใช้เงินจากรายรับล่าสุด
              </span>
              <span className={`font-extrabold px-2 py-0.5 rounded-full text-[10px] ${statusBadgeStyle}`}>
                ใช้ไปแล้ว {spentPct}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-linear-to-r ${progressBarColor} transition-all duration-500 ease-out`}
                style={{ width: `${clampedBarWidth}%` }}
              />
            </div>
          </div>

          {/* Expandable Expenses List since Latest Income */}
          {cycle.expenseCount > 0 && (
            <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/70">
              <button
                type="button"
                onClick={() => setShowCycleExpenses((prev) => !prev)}
                className="w-full flex items-center justify-between py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
              >
                <span>
                  {showCycleExpenses
                    ? "ซ่อนรายการที่ใช้ไปตั้งแต่รายรับล่าสุด"
                    : `ดูรายการที่ใช้ไปตั้งแต่รายรับนี้ (${cycle.expenseCount} รายการ)`}
                </span>
                {showCycleExpenses ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showCycleExpenses && (
                <div className="mt-2.5 space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin animate-fade-in">
                  {cycle.recentExpenses.map((tx) => (
                    <div
                      key={tx._id}
                      className="flex items-center justify-between py-2 px-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CategoryIcon name={tx.category} className="w-7 h-7" />
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100 truncate">
                            {tx.description || tx.category}
                          </p>
                          <p className="text-[9.5px] text-zinc-400">
                            {formatThaiDate(tx.dateStr, "daily")}
                            {tx.timeStr ? ` • ${tx.timeStr}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                        -฿{formatMoney(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
