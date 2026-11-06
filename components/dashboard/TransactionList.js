"use client";

import React from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import CategoryIcon from "@/components/CategoryIcon";
import { formatThaiDate } from "@/lib/dateFormatter";

export default function TransactionList({
  transactions,
  loading,
  onDeleteTransaction,
}) {
  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">
          ประวัติรายการ
        </h3>
        <span className="text-[10.5px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full">
          {transactions.length} รายการ
        </span>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse w-full"
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-10 bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2.5rem border border-dashed border-zinc-100 dark:border-zinc-900 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
          <AlertCircle className="w-8 h-8 opacity-40 mb-2" />
          <span className="text-xs">ยังไม่มีประวัติรายการบันทึกในช่วงเวลานี้</span>
        </div>
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className="flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100/70 dark:border-zinc-800/40 hover:border-zinc-200 dark:hover:border-zinc-800 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <CategoryIcon name={tx.category} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
                    {tx.category}
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate max-w-[150px]">
                    {tx.description || `บันทึกรายการสำหรับ ${tx.category}`}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] text-zinc-400 font-medium">
                    <span>{formatThaiDate(tx.dateStr, "daily")}</span>
                    {tx.timeStr && <span>• {tx.timeStr}</span>}
                    {tx.recordedBy && (
                      <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-bold">
                        โดย {tx.recordedBy}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-black shrink-0 ${
                    tx.type === "income"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-700 dark:text-zinc-200"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => onDeleteTransaction(tx._id)}
                  className="p-1.5 rounded-lg text-zinc-400 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="ลบรายการ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
