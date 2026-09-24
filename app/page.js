"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Trash2,
  Calendar,
  AlertCircle,
  PiggyBank,
  RefreshCw,
  ScanLine,
} from "lucide-react";
import { getDashboardData, addTransaction, deleteTransaction } from "./actions";
import CategoryIcon from "@/components/CategoryIcon";
import AnalyticsChart from "@/components/AnalyticsChart";
import TransactionModal from "@/components/TransactionModal";
import SlipScannerModal from "@/components/SlipScannerModal";
import FinancialChatbotModal from "@/components/FinancialChatbotModal";

// Helper to format Date string (YYYY-MM-DD) into Thai Readable Dates
function formatThaiDate(dateStr, view) {
  if (!dateStr) return "";

  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const shortMonthNames = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  if (view === "daily") {
    const [year, month, day] = dateStr.split("-");
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    // Thai year is Christian year + 543
    return `${d.getDate()} ${shortMonthNames[d.getMonth()]} ${d.getFullYear() + 543}`;
  } else if (view === "monthly") {
    const [year, month] = dateStr.split("-");
    return `${monthNames[parseInt(month) - 1]} ${parseInt(year) + 543}`;
  } else if (view === "yearly") {
    return `ปี พ.ศ. ${parseInt(dateStr) + 543}`;
  }
  return dateStr;
}

export default function Home() {
  const [view, setView] = useState("monthly"); // 'daily' | 'monthly' | 'yearly'
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlipScannerOpen, setIsSlipScannerOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" }); // { text, type: 'success'|'error' }

  // Set default date (monthly) on mount to avoid SSR hydration mismatches
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedDate(`${year}-${month}`);
  }, []);

  const handleOpenManualModal = () => {
    setModalInitialData(null);
    setIsModalOpen(true);
  };

  const handleSlipScanSuccess = (parsedData) => {
    setModalInitialData(parsedData);
    setIsSlipScannerOpen(false);
    setIsModalOpen(true);
    showFeedback("อ่านข้อมูลจากสลิปเรียบร้อยแล้ว กรุณาตรวจสอบและเลือกหมวดหมู่");
  };

  // Show status feedback banner
  const showFeedback = useCallback((text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 4000);
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const res = await getDashboardData(view, selectedDate);
      if (res.success) {
        setData(res);
      } else {
        showFeedback("ดึงข้อมูลไม่สำเร็จ: " + res.error, "error");
      }
    } catch (err) {
      showFeedback("เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
    } finally {
      setLoading(false);
    }
  }, [view, selectedDate, showFeedback]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  // View change handler that updates view and date at the same time
  const handleViewChange = (newView) => {
    setView(newView);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    if (newView === "daily") {
      setSelectedDate(`${year}-${month}-${day}`);
    } else if (newView === "monthly") {
      setSelectedDate(`${year}-${month}`);
    } else if (newView === "yearly") {
      setSelectedDate(String(year));
    }
  };

  // Date Shift Handler
  const handleDateShift = (amount) => {
    if (!selectedDate) return;

    if (view === "daily") {
      const parts = selectedDate.split("-");
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      d.setDate(d.getDate() + amount);
      const newYear = d.getFullYear();
      const newMonth = String(d.getMonth() + 1).padStart(2, "0");
      const newDay = String(d.getDate()).padStart(2, "0");
      setSelectedDate(`${newYear}-${newMonth}-${newDay}`);
    } else if (view === "monthly") {
      const parts = selectedDate.split("-");
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1 + amount, 1);
      const newYear = d.getFullYear();
      const newMonth = String(d.getMonth() + 1).padStart(2, "0");
      setSelectedDate(`${newYear}-${newMonth}`);
    } else if (view === "yearly") {
      const currentYear = parseInt(selectedDate);
      setSelectedDate(String(currentYear + amount));
    }
  };

  // Save transaction Server Action trigger
  const handleSaveTransaction = async (txData) => {
    const res = await addTransaction(txData);
    if (res.success) {
      showFeedback("บันทึกรายการสำเร็จแล้ว!");
      fetchData();
      return true;
    } else {
      showFeedback("บันทึกไม่สำเร็จ: " + res.error, "error");
      return false;
    }
  };

  // Delete transaction action
  const handleDeleteTransaction = async (id) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
      const res = await deleteTransaction(id);
      if (res.success) {
        showFeedback("ลบรายการเสร็จสิ้น");
        fetchData();
      } else {
        showFeedback("ลบรายการไม่สำเร็จ: " + res.error, "error");
      }
    }
  };

  const summary = data?.summary || { totalIncome: 0, totalExpense: 0, balance: 0 };
  const transactions = data?.transactions || [];

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-100 flex flex-col font-sans">
      {/* App Shell Wrapper (max-w-md creates clean mobile look on desktop) */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-white dark:bg-zinc-950 border-x border-zinc-100 dark:border-zinc-900/60 shadow-xl relative pb-10">
        
        {/* Top Header */}
        <header className="px-6 pt-7 pb-4 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg z-30 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900/40">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 bg-clip-text text-transparent">
                Money Manager
              </h1>
              <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                บันทึกรายรับ-รายจ่าย
              </p>
            </div>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 dark:text-zinc-500 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-500" : ""}`} />
          </button>
        </header>

        {/* Feedback Alert Banner */}
        {message.text && (
          <div className="absolute top-20 left-4 right-4 z-40 animate-slide-up">
            <div
              className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-semibold shadow-lg backdrop-blur-md ${
                message.type === "error"
                  ? "bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30"
                  : "bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30"
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          </div>
        )}

        <main className="flex-1 px-5 py-4 space-y-6">
          {/* Segmented Controls for Range */}
          <div className="flex bg-zinc-100 dark:bg-zinc-900/80 p-0.5 rounded-2xl">
            {["daily", "monthly", "yearly"].map((v) => (
              <button
                key={v}
                onClick={() => handleViewChange(v)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  view === v
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
                }`}
              >
                {v === "daily" ? "รายวัน" : v === "monthly" ? "รายเดือน" : "รายปี"}
              </button>
            ))}
          </div>

          {/* Date Picker Switcher */}
          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900/20 px-4 py-3 rounded-2xl">
            <button
              onClick={() => handleDateShift(-1)}
              className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-indigo-500" />
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {formatThaiDate(selectedDate, view)}
              </span>
            </div>

            <button
              onClick={() => handleDateShift(1)}
              className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dashboard Summary Cards */}
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

          {/* Analytics Chart */}
          {!loading && data && (
            <AnalyticsChart
              chartData={data.chartData}
              categoryBreakdown={data.categoryBreakdown}
              view={view}
            />
          )}

          {/* Action Buttons: Add Manual & Scan Slip */}
          <div className="grid grid-cols-2 gap-3.5 pt-1">
            {/* Scan Slip Button with vibrant glowing gradient */}
            <button
              onClick={() => setIsSlipScannerOpen(true)}
              className="relative group flex items-center justify-center gap-2.5 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white py-3.5 px-5 rounded-full font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:shadow-2xl active:scale-95 transition-all duration-300 border border-indigo-400/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ScanLine className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110" />
              <span className="tracking-wide">สแกนสลิป</span>
            </button>

            {/* Add Manual Transaction Button with clean contrast and glow */}
            <button
              onClick={handleOpenManualModal}
              className="relative group flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white py-3.5 px-5 rounded-full font-extrabold text-sm shadow-xl shadow-zinc-900/10 dark:shadow-black/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-95 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <Plus className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110" />
              <span className="tracking-wide">เพิ่มรายการใหม่</span>
            </button>
          </div>

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
                  ></div>
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
                        onClick={() => handleDeleteTransaction(tx._id)}
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
        </main>

        {/* Slip Scanner Modal */}
        <SlipScannerModal
          isOpen={isSlipScannerOpen}
          onClose={() => setIsSlipScannerOpen(false)}
          onScanSuccess={handleSlipScanSuccess}
        />

        {/* Transaction Entry Modal Sheet */}
        <TransactionModal
          key={`${isModalOpen}-${modalInitialData ? "prefilled" : "empty"}`}
          isOpen={isModalOpen}
          initialData={modalInitialData}
          onClose={() => {
            setIsModalOpen(false);
            setModalInitialData(null);
          }}
          onSave={handleSaveTransaction}
        />

        {/* In-House AI Financial Chatbot */}
        <FinancialChatbotModal />
      </div>
    </div>
  );
}
