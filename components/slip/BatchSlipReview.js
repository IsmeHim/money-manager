"use client";

import React from "react";
import {
  Layers,
  Calendar,
  Clock,
  Trash2,
  Tag,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

const EXPENSE_CATEGORIES = [
  "อาหาร",
  "เดินทาง",
  "ช้อปปิ้ง",
  "ค่าบ้าน/บิล",
  "ความบันเทิง",
  "สุขภาพ",
  "การศึกษา",
  "อื่นๆ",
];

export default function BatchSlipReview({
  batchItems,
  totalBatchAmount,
  isSavingBatch,
  onUpdateBatchItem,
  onRemoveBatchItem,
  onCombineTotal,
  onSaveAllSeparate,
  onReset,
}) {
  return (
    <div className="space-y-4 pb-2">
      {/* Grand Total Card */}
      <div className="bg-linear-to-br from-indigo-600 via-indigo-500 to-violet-600 text-white rounded-3xl p-5 shadow-lg shadow-indigo-600/20 relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-indigo-100/90 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            ยอดรวมทั้งหมด ({batchItems.length} สลิป)
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
            รายจ่าย
          </span>
        </div>
        <div className="text-3xl font-black tracking-tight">
          ฿{totalBatchAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>

      {/* Scanned Slips List */}
      <div className="space-y-2.5 max-h-[36vh] overflow-y-auto pr-1">
        {batchItems.map((item, idx) => (
          <div
            key={item.id}
            className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-2 relative group"
          >
            {/* Slip Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-[10px] font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.dateStr}
                  </span>
                  {item.timeStr && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timeStr}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onRemoveBatchItem(item.id)}
                className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                title="ลบสลิปนี้ออก"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Amount & Memo Row */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5 relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                  ฿
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={item.amount}
                  onChange={(e) =>
                    onUpdateBatchItem(item.id, "amount", parseFloat(e.target.value) || 0)
                  }
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl py-1.5 pl-6 pr-2 text-xs font-black text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="col-span-7">
                <input
                  type="text"
                  value={item.memo}
                  placeholder="รายละเอียด/บันทึก..."
                  onChange={(e) => onUpdateBatchItem(item.id, "memo", e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl py-1.5 px-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-zinc-400"
                />
              </div>
            </div>

            {/* Category Selection for Separate Save */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <Tag className="w-3 h-3 text-zinc-400 shrink-0" />
              <select
                value={item.category}
                onChange={(e) => onUpdateBatchItem(item.id, "category", e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-1 px-2 text-[10.5px] font-bold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons: 2 Modes */}
      <div className="space-y-2 pt-2">
        <button
          onClick={onCombineTotal}
          className="w-full group flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white py-3.5 px-4 rounded-2xl font-extrabold text-xs shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.98] transition-all"
        >
          <Sparkles className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
          <span>เหมารวม 1 รายการ (รวม ฿{totalBatchAmount.toLocaleString()})</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </button>

        <button
          onClick={onSaveAllSeparate}
          disabled={isSavingBatch}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 py-3 px-4 rounded-2xl font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-700/60 active:scale-[0.98] transition-all"
        >
          {isSavingBatch ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
              <span>กำลังบันทึก {batchItems.length} รายการ...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>บันทึกแยกทุกรายการพร้อมกัน ({batchItems.length} รายการ)</span>
            </>
          )}
        </button>

        <div className="text-center pt-1">
          <button
            onClick={onReset}
            className="text-[11px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            ยกเลิกและเลือกรูปใหม่
          </button>
        </div>
      </div>
    </div>
  );
}
