"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  AlertCircle,
  PiggyBank,
  ScanLine,
  Wallet,
  BookOpen,
} from "lucide-react";
import { getDashboardData, addTransaction, deleteTransaction, addBatchTransactions } from "./actions";
import { getDebtsData, addDebt, toggleDebtPaid, deleteDebt } from "./debtActions";
import { getAuthSessionAction, logoutAction } from "./authActions";
import { formatThaiDate } from "@/lib/dateFormatter";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import TransactionList from "@/components/dashboard/TransactionList";
import DebtSection from "@/components/debt/DebtSection";
import DebtModal from "@/components/debt/DebtModal";
import AnalyticsChart from "@/components/AnalyticsChart";
import TransactionModal from "@/components/TransactionModal";
import SlipScannerModal from "@/components/SlipScannerModal";
import FinancialChatbotModal from "@/components/FinancialChatbotModal";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const [activeMode, setActiveMode] = useState("wallet"); // 'wallet' | 'debt'
  const [view, setView] = useState("monthly"); // 'daily' | 'monthly' | 'yearly'
  const [selectedDate, setSelectedDate] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlipScannerOpen, setIsSlipScannerOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Debt State
  const [debts, setDebts] = useState([]);
  const [debtSummary, setDebtSummary] = useState(null);
  const [debtLoading, setDebtLoading] = useState(false);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);

  // Load authenticated session
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getAuthSessionAction();
        if (res.success && res.user) {
          setCurrentUser(res.user);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setAuthChecking(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    setCurrentUser(null);
    setData(null);
  };

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
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const showFeedback = useCallback((text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: "", type: "" });
    }, 4000);
  }, []);

  // Fetch data only when authenticated user is present
  const fetchData = useCallback(async () => {
    if (!selectedDate || !currentUser) return;
    setLoading(true);
    try {
      const res = await getDashboardData(view, selectedDate);
      if (res.success) {
        setData(res);
      } else {
        showFeedback("ดึงข้อมูลไม่สำเร็จ: " + res.error, "error");
      }
    } catch {
      showFeedback("เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
    } finally {
      setLoading(false);
    }
  }, [view, selectedDate, currentUser, showFeedback]);

  const fetchDebts = useCallback(async () => {
    if (!currentUser) return;
    setDebtLoading(true);
    try {
      const res = await getDebtsData();
      if (res.success) {
        setDebts(res.debts);
        setDebtSummary(res.summary);
      }
    } catch {
      // ignore error
    } finally {
      setDebtLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
      fetchDebts();
    }
  }, [currentUser, fetchData, fetchDebts]);

  // View change handler
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

  const handleBatchSaveTransaction = async (items) => {
    const res = await addBatchTransactions(items);
    if (res.success) {
      showFeedback(`บันทึก ${res.insertedCount} รายการสำเร็จเรียบร้อยแล้ว!`);
      fetchData();
      return true;
    } else {
      showFeedback("บันทึกไม่สำเร็จ: " + res.error, "error");
      return false;
    }
  };

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

  // Debt Handlers
  const handleAddDebt = async (debtData) => {
    const res = await addDebt(debtData);
    if (res.success) {
      showFeedback("บันทึกรายการหนี้สำเร็จแล้ว!");
      fetchDebts();
      return true;
    } else {
      showFeedback("บันทึกไม่สำเร็จ: " + res.error, "error");
      return false;
    }
  };

  const handleToggleDebtPaid = async (id, markAsPaid) => {
    const res = await toggleDebtPaid(id, markAsPaid);
    if (res.success) {
      showFeedback(markAsPaid ? "อัปเดตสถานะเป็นชำระแล้ว!" : "เปลี่ยนกลับเป็นค้างชำระแล้ว");
      fetchDebts();
    } else {
      showFeedback("อัปเดตไม่สำเร็จ: " + res.error, "error");
    }
  };

  const handleDeleteDebt = async (id) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการหนี้นี้?")) {
      const res = await deleteDebt(id);
      if (res.success) {
        showFeedback("ลบรายการหนี้เรียบร้อยแล้ว");
        fetchDebts();
      } else {
        showFeedback("ลบไม่สำเร็จ: " + res.error, "error");
      }
    }
  };

  const summary = data?.summary || { totalIncome: 0, totalExpense: 0, balance: 0 };
  const transactions = data?.transactions || [];
  const unpaidDebtCount =
    (debtSummary?.lentUnpaidCount || 0) + (debtSummary?.borrowedUnpaidCount || 0);

  if (authChecking) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-3 font-sans">
        <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 animate-bounce">
          <PiggyBank className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-zinc-400 animate-pulse">กำลังโหลดระบบ Money Manager...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <LandingPage />;
  }

  return (
    <div className="w-full min-h-screen bg-zinc-50 dark:bg-black text-zinc-800 dark:text-zinc-100 flex flex-col font-sans">
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-white dark:bg-zinc-950 border-x border-zinc-100 dark:border-zinc-900/60 shadow-xl relative pb-10">
        <DashboardHeader
          currentUser={currentUser}
          onLogout={handleLogout}
          onRefresh={fetchData}
          loading={loading}
        />

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
          {/* Primary Mode Switcher: รายรับ-รายจ่าย vs บันทึกหนี้สิน */}
          <div className="grid grid-cols-2 gap-1.5 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl">
            <button
              onClick={() => setActiveMode("wallet")}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                activeMode === "wallet"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>รายรับ-รายจ่าย</span>
            </button>

            <button
              onClick={() => setActiveMode("debt")}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                activeMode === "debt"
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>บันทึกหนี้สิน</span>
              {unpaidDebtCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                  {unpaidDebtCount}
                </span>
              )}
            </button>
          </div>

          {activeMode === "debt" ? (
            <DebtSection
              debts={debts}
              debtSummary={debtSummary}
              loading={debtLoading}
              onOpenAddDebt={() => setIsDebtModalOpen(true)}
              onTogglePaid={handleToggleDebtPaid}
              onDeleteDebt={handleDeleteDebt}
            />
          ) : (
            <>
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

              <SummaryCards summary={summary} />

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
                <button
                  onClick={() => setIsSlipScannerOpen(true)}
                  className="relative group flex items-center justify-center gap-2.5 bg-linear-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white py-3.5 px-5 rounded-full font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:shadow-2xl active:scale-95 transition-all duration-300 border border-indigo-400/30 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ScanLine className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="tracking-wide">สแกนสลิป</span>
                </button>

                <button
                  onClick={handleOpenManualModal}
                  className="relative group flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white py-3.5 px-5 rounded-full font-extrabold text-sm shadow-xl shadow-zinc-900/10 dark:shadow-black/60 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-95 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <Plus className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="tracking-wide">เพิ่มรายการใหม่</span>
                </button>
              </div>

              <TransactionList
                transactions={transactions}
                loading={loading}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </>
          )}
        </main>

        {/* Debt Entry Modal */}
        <DebtModal
          isOpen={isDebtModalOpen}
          onClose={() => setIsDebtModalOpen(false)}
          onSave={handleAddDebt}
        />

        {/* Slip Scanner Modal */}
        <SlipScannerModal
          isOpen={isSlipScannerOpen}
          onClose={() => setIsSlipScannerOpen(false)}
          onScanSuccess={handleSlipScanSuccess}
          onBatchSave={handleBatchSaveTransaction}
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

        {/* AI Financial Chatbot (Strictly scoped to currentUser) */}
        <FinancialChatbotModal currentUser={currentUser} />
      </div>
    </div>
  );
}
