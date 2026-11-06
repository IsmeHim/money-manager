"use client";

import React from "react";
import { PiggyBank, TrendingUp, TrendingDown } from "lucide-react";

export default function SummaryCards({ summary }) {
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
          ฿{summary.balance.toLocaleString()}
        </h2>
      </div>

      {/* Income / Expense Cards Row */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Income */}
        <div className="bg-emerald-50/60 dark:bg-emerald-950/15 border border-emerald-100/40 dark:border-emerald-950/30 rounded-2.5rem p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              รายรับสะสม
            </span>
          </div>
          <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
            ฿{summary.totalIncome.toLocaleString()}
          </p>
        </div>

        {/* Expense */}
        <div className="bg-rose-50/60 dark:bg-rose-950/15 border border-rose-100/40 dark:border-rose-950/30 rounded-2.5rem p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              รายจ่ายสะสม
            </span>
          </div>
          <p className="text-lg font-extrabold text-rose-700 dark:text-rose-400">
            ฿{summary.totalExpense.toLocaleString()}
          </p>
        </div>
      </div>
    </section>
  );
}
