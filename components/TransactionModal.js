"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, AlignLeft, Check } from "lucide-react";
import { CATEGORY_MAP } from "./CategoryIcon";

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

const INCOME_CATEGORIES = [
  "เงินเดือน",
  "ธุรกิจ",
  "ลงทุน",
  "ของขวัญ",
  "รายรับอื่นๆ",
];

export default function TransactionModal({ isOpen, onClose, onSave }) {
  const [type, setType] = useState("expense"); // 'expense' | 'income'
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize fields on open
  useEffect(() => {
    if (isOpen) {
      setType("expense");
      setAmount("");
      setCategory(EXPENSE_CATEGORIES[0]);
      setDescription("");
      // Set default date to local YYYY-MM-DD
      const today = new Date();
      const localDate = today.toLocaleDateString("sv-SE"); // sv-SE format is YYYY-MM-DD
      setDateStr(localDate);
      setError("");
    }
  }, [isOpen]);

  // Adjust default category when type changes
  useEffect(() => {
    if (type === "expense") {
      setCategory(EXPENSE_CATEGORIES[0]);
    } else {
      setCategory(INCOME_CATEGORIES[0]);
    }
  }, [type]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("กรุณากรอกจำนวนเงินให้ถูกต้อง");
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        type,
        amount: parseFloat(amount),
        category,
        description,
        dateStr,
      };

      const success = await onSave(data);
      if (success) {
        onClose();
      } else {
        setError("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const categoriesToRender =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal/Bottom Sheet Container */}
      <div
        className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2rem] border-t sm:border border-zinc-100 dark:border-zinc-800/80 shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col justify-between transition-all duration-300 animate-slide-up sm:animate-scale-in"
      >
        {/* Header Drag Indicator for mobile */}
        <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-5 sm:hidden"></div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
            เพิ่มรายการใหม่
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-5">
          {/* Income / Expense Toggle */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800/60 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                type === "expense"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              รายจ่าย
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                type === "income"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              รายรับ
            </button>
          </div>

          {/* Amount input */}
          <div className="space-y-1.5 text-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              จำนวนเงิน (บาท)
            </label>
            <div className="relative flex items-center justify-center">
              <span className="text-2xl font-bold text-zinc-400 mr-1.5">฿</span>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-48 text-center text-4xl font-extrabold bg-transparent text-zinc-800 dark:text-zinc-100 outline-hidden border-b-2 border-transparent focus:border-zinc-200 dark:focus:border-zinc-800 transition-colors py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                autoFocus
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              เลือกหมวดหมู่
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {categoriesToRender.map((catName) => {
                const isSelected = category === catName;
                const catDef = CATEGORY_MAP[catName] || {};
                const Icon = catDef.icon;

                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => setCategory(catName)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? "border-zinc-800 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 scale-95"
                        : "border-zinc-100 dark:border-zinc-800/40 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
                        isSelected
                          ? type === "expense"
                            ? "bg-rose-500 text-white"
                            : "bg-emerald-500 text-white"
                          : catDef.color || "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {Icon && <Icon className="w-4.5 h-4.5" />}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 text-center truncate w-full">
                      {catName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/20">
            <Calendar className="w-5 h-5 text-zinc-400 shrink-0" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 shrink-0">
              วันที่:
            </span>
            <input
              type="date"
              required
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="flex-1 bg-transparent text-sm font-semibold text-zinc-800 dark:text-zinc-100 outline-hidden"
            />
          </div>

          {/* Memo / Description */}
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/20">
            <AlignLeft className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              placeholder="บันทึกรายละเอียดเพิ่มเติม..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 bg-transparent text-sm text-zinc-800 dark:text-zinc-100 outline-hidden"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              type === "expense"
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25 active:scale-98"
                : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25 active:scale-98"
            } disabled:opacity-50`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>บันทึกรายการ</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
