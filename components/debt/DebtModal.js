"use client";

import React, { useState } from "react";
import { X, Calendar, User, AlignLeft, Check, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function DebtModal({ isOpen, onClose, onSave }) {
  const todayDefault = new Date().toLocaleDateString("sv-SE");
  const [direction, setDirection] = useState("lent"); // 'lent' = คนติดหนี้เรา, 'borrowed' = เราติดหนี้คนอื่น
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [dateStr, setDateStr] = useState(todayDefault);
  const [dueDateStr, setDueDateStr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!personName.trim()) {
      setError("กรุณากรอกชื่อผู้ที่เกี่ยวข้อง");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("กรุณากรอกจำนวนเงินให้ถูกต้อง");
      return;
    }

    setIsLoading(true);
    try {
      const ok = await onSave({
        direction,
        personName: personName.trim(),
        amount: parseFloat(amount),
        note: note.trim(),
        dateStr,
        dueDateStr,
      });
      if (ok) {
        setPersonName("");
        setAmount("");
        setNote("");
        setDueDateStr("");
        onClose();
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Sheet */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2rem] border-t sm:border border-zinc-100 dark:border-zinc-800/80 shadow-2xl p-6 overflow-y-auto max-h-[92vh] animate-slide-up sm:animate-scale-in">
        <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              บันทึกรายการหนี้ใหม่
            </h2>
            <p className="text-[11px] text-zinc-400">
              เลือกประเภทหนี้ กรอกชื่อและจำนวนเงิน
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle Direction: คนติดหนี้เรา vs เราติดหนี้คนอื่น */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/90 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setDirection("lent")}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              direction === "lent"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 shrink-0" />
            <span>คนอื่นติดหนี้เรา</span>
          </button>

          <button
            type="button"
            onClick={() => setDirection("borrowed")}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              direction === "borrowed"
                ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            <ArrowUpRight className="w-4 h-4 shrink-0" />
            <span>เราติดหนี้คนอื่น</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div className="text-center py-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              {direction === "lent" ? "จำนวนเงินที่เขาติดเรา (บาท)" : "จำนวนเงินที่เราติดเขา (บาท)"}
            </label>
            <div className="relative inline-flex items-center justify-center">
              <span className="text-2xl font-extrabold text-zinc-400 mr-1.5">฿</span>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-3xl font-black text-center w-44 bg-transparent border-b-2 border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 outline-none py-1 text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          {/* Person Name */}
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <User className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-400 block">
                {direction === "lent" ? "ชื่อลูกหนี้ (คนที่ยืมเรา)" : "ชื่อเจ้าหนี้ (คนที่เรายืม)"}
              </label>
              <input
                type="text"
                required
                placeholder={direction === "lent" ? "เช่น สมชาย, เพื่อนบอย..." : "เช่น แม่, เพื่อนก้อง, ร้านค้า..."}
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-zinc-800 dark:text-zinc-100 focus:outline-none pt-0.5 placeholder:font-normal placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Note / Description */}
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <AlignLeft className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
            <div className="flex-1">
              <label className="text-[10px] font-bold text-zinc-400 block">
                รายละเอียด / หมายเหตุ
              </label>
              <input
                type="text"
                placeholder="เช่น ค่าข้าวเมื่อวาน, ยืมเติมน้ำมัน, หารค่าหมูกระทะ..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-transparent text-xs font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none pt-0.5 placeholder:text-zinc-400"
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <label className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-indigo-500" />
                วันที่ยืม/เกิดหนี้
              </label>
              <input
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>

            <div className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800">
              <label className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3 text-amber-500" />
                วันนัดคืน (ถ้ามี)
              </label>
              <input
                type="date"
                value={dueDateStr}
                onChange={(e) => setDueDateStr(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-white text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
              direction === "lent"
                ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25"
                : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25"
            }`}
          >
            <Check className="w-4 h-4" />
            <span>
              {isLoading
                ? "กำลังบันทึก..."
                : direction === "lent"
                ? "บันทึกลูกหนี้ (คนติดหนี้เรา)"
                : "บันทึกเจ้าหนี้ (เราติดหนี้เขา)"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
