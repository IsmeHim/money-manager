"use client";

import React, { useState } from "react";
import {
  Plus,
  CheckCircle2,
  RotateCcw,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  User,
  AlertCircle,
  Clock,
} from "lucide-react";
import { formatThaiDate } from "@/lib/dateFormatter";

export default function DebtSection({
  debts,
  debtSummary,
  loading,
  onOpenAddDebt,
  onTogglePaid,
  onDeleteDebt,
}) {
  const [filter, setFilter] = useState("unpaid"); // 'unpaid' | 'lent' | 'borrowed' | 'paid' | 'all'

  const filteredDebts = (debts || []).filter((d) => {
    if (filter === "unpaid") return d.status !== "paid";
    if (filter === "paid") return d.status === "paid";
    if (filter === "lent") return d.direction === "lent" && d.status !== "paid";
    if (filter === "borrowed") return d.direction === "borrowed" && d.status !== "paid";
    return true;
  });

  const summary = debtSummary || {
    totalLentUnpaid: 0,
    totalBorrowedUnpaid: 0,
    lentUnpaidCount: 0,
    borrowedUnpaidCount: 0,
  };

  return (
    <div className="space-y-5">
      {/* Debt Summary Cards: คนติดหนี้เรา vs เราติดหนี้คนอื่น */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* คนอื่นติดหนี้เรา (รอรับคืน) */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-3xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 block leading-tight">
                คนอื่นติดหนี้เรา
              </span>
              <span className="text-[9px] text-emerald-600/80 dark:text-emerald-500">
                รอรับคืน ({summary.lentUnpaidCount} รายการ)
              </span>
            </div>
          </div>
          <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
            ฿{summary.totalLentUnpaid.toLocaleString()}
          </p>
        </div>

        {/* เราติดหนี้คนอื่น (ต้องจ่ายคืน) */}
        <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 rounded-3xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-rose-700 dark:text-rose-400 block leading-tight">
                เราติดหนี้คนอื่น
              </span>
              <span className="text-[9px] text-rose-600/80 dark:text-rose-500">
                ต้องจ่ายคืน ({summary.borrowedUnpaidCount} รายการ)
              </span>
            </div>
          </div>
          <p className="text-xl font-black text-rose-700 dark:text-rose-400 tracking-tight">
            ฿{summary.totalBorrowedUnpaid.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Debt Button */}
      <button
        onClick={onOpenAddDebt}
        className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white py-3.5 px-5 rounded-full font-extrabold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 active:scale-95 transition-all"
      >
        <Plus className="w-4.5 h-4.5" />
        <span>เพิ่มรายการหนี้ใหม่ (ลูกหนี้ / เจ้าหนี้)</span>
      </button>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none pb-1">
        {[
          { id: "unpaid", label: "⏳ ค้างชำระ" },
          { id: "lent", label: "🟢 คนติดหนี้เรา" },
          { id: "borrowed", label: "🔴 เราติดหนี้เขา" },
          { id: "paid", label: "✅ จ่าย/คืนแล้ว" },
          { id: "all", label: "ทั้งหมด" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
              filter === tab.id
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Debts List */}
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse w-full"
            />
          ))}
        </div>
      ) : filteredDebts.length === 0 ? (
        <div className="text-center py-10 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
          <AlertCircle className="w-8 h-8 opacity-40 mb-2" />
          <span className="text-xs font-medium">ไม่มีรายการหนี้ในหมวดนี้</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDebts.map((debt) => {
            const isLent = debt.direction === "lent";
            const isPaid = debt.status === "paid";

            return (
              <div
                key={debt._id}
                className={`p-4 rounded-2xl border transition-all ${
                  isPaid
                    ? "bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/50 dark:border-zinc-800/40 opacity-75"
                    : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Person & Details */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isPaid
                          ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                          : isLent
                          ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      <User className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-xs font-extrabold ${
                            isPaid
                              ? "line-through text-zinc-400"
                              : "text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {debt.personName}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            isLent
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                              : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                          }`}
                        >
                          {isLent ? "ติดหนี้เรา" : "เราติดหนี้เขา"}
                        </span>
                        {isPaid && (
                          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                            ✓ จ่ายแล้ว
                          </span>
                        )}
                      </div>

                      {debt.note && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {debt.note}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-[9.5px] text-zinc-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          ยืม: {formatThaiDate(debt.dateStr, "daily")}
                        </span>
                        {debt.dueDateStr && !isPaid && (
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                            <Clock className="w-3 h-3" />
                            นัดคืน: {formatThaiDate(debt.dueDateStr, "daily")}
                          </span>
                        )}
                        {isPaid && debt.paidDateStr && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            • ชำระเมื่อ {formatThaiDate(debt.paidDateStr, "daily")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount */}
                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-black block ${
                        isPaid
                          ? "line-through text-zinc-400"
                          : isLent
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      ฿{Number(debt.amount).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Bar: ปุ่มกดจ่ายแล้ว / คืนแล้ว */}
                <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between gap-2">
                  {!isPaid ? (
                    <button
                      onClick={() => onTogglePaid(debt._id, true)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs ${
                        isLent
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isLent ? "ได้รับเงินคืนแล้ว" : "จ่ายหนี้คืนแล้ว"}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onTogglePaid(debt._id, false)}
                      className="flex-1 py-1.5 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>ยกเลิกสถานะจ่ายแล้ว (กลับเป็นค้างชำระ)</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteDebt(debt._id)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="ลบรายการหนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
