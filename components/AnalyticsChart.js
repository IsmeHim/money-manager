"use client";

import React, { useState } from "react";
import { CATEGORY_MAP } from "./CategoryIcon";

export default function AnalyticsChart({ chartData = [], categoryBreakdown = [], view }) {
  const [breakdownType, setBreakdownType] = useState("expense"); // 'expense' | 'income'

  // --- Bar Chart Logic ---
  // Find maximum value to scale the chart
  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d?.income || 0, d?.expense || 0)),
    100 // Prevent division by zero
  );

  // --- Donut Chart Logic ---
  const filteredBreakdown = categoryBreakdown.filter(
    (item) => item.type === breakdownType
  );
  const totalAmount = filteredBreakdown.reduce((sum, item) => sum + item.amount, 0);

  // SVG parameters for Donut
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~314.16

  // Assign distinct aesthetic colors to categories
  const donutColors = [
    "#f43f5e", // rose
    "#3b82f6", // blue
    "#a855f7", // purple
    "#f59e0b", // amber
    "#ec4899", // pink
    "#10b981", // emerald
    "#6366f1", // indigo
    "#14b8a6", // teal
    "#06b6d4", // cyan
    "#84cc16", // lime
  ];


  return (
    <div className="space-y-6">
      {/* 1. Bar Chart: Trends */}
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
            แนวโน้ม {view === "daily" ? "รายวัน" : view === "monthly" ? "รายวันในเดือนนี้" : "รายเดือนในปีนี้"}
          </h3>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-zinc-500">รายรับ</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-zinc-500">รายจ่าย</span>
            </div>
          </div>
        </div>

        {/* Chart View Container */}
        <div className="overflow-x-auto scrollbar-none -mx-2 px-2">
          <div
            className="flex items-end gap-3 pt-6 pb-2"
            style={{
              minWidth: view === "monthly" ? "650px" : "100%",
              height: "180px",
            }}
          >
            {chartData.map((d, index) => {
              const incomeHeight = `${((d?.income || 0) / maxVal) * 120}px`;
              const expenseHeight = `${((d?.expense || 0) / maxVal) * 120}px`;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Hover tooltips */}
                  <div className="relative w-full flex justify-center">
                    <div className="absolute bottom-0 mb-1 hidden group-hover:flex flex-col items-center bg-zinc-950 text-white text-[10px] py-1 px-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
                      {d?.income > 0 && <div className="text-emerald-400">รับ: ฿{d.income.toLocaleString()}</div>}
                      {d?.expense > 0 && <div className="text-rose-400">จ่าย: ฿{d.expense.toLocaleString()}</div>}
                    </div>
                  </div>

                  {/* Double bars */}
                  <div className="w-full flex items-end justify-center gap-1 h-[130px]">
                    <div
                      style={{ height: incomeHeight }}
                      className="w-2 rounded-t-full bg-emerald-500/80 group-hover:bg-emerald-500 transition-all duration-300 min-h-[2px]"
                    ></div>
                    <div
                      style={{ height: expenseHeight }}
                      className="w-2 rounded-t-full bg-rose-500/80 group-hover:bg-rose-500 transition-all duration-300 min-h-[2px]"
                    ></div>
                  </div>

                  {/* Label */}
                  <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Donut Chart: Breakdown */}
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">สัดส่วนหมวดหมู่</h3>
          
          {/* Toggle breakdown type */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-full text-xs">
            <button
              onClick={() => setBreakdownType("expense")}
              className={`px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                breakdownType === "expense"
                  ? "bg-white dark:bg-zinc-700 text-rose-500 shadow-sm"
                  : "text-zinc-500"
              }`}
            >
              รายจ่าย
            </button>
            <button
              onClick={() => setBreakdownType("income")}
              className={`px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                breakdownType === "income"
                  ? "bg-white dark:bg-zinc-700 text-emerald-500 shadow-sm"
                  : "text-zinc-500"
              }`}
            >
              รายรับ
            </button>
          </div>
        </div>

        {totalAmount === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-zinc-400 dark:text-zinc-500 text-xs">
            <svg className="w-12 h-12 stroke-current mb-2 opacity-50" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M12 8V12" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 16H12.01" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>ไม่มีข้อมูลในช่วงเวลานี้</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Donut SVG drawing */}
            <div className="relative flex justify-center">
              <svg width="150" height="150" viewBox="0 0 130 130" className="transform -rotate-90">
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  fill="transparent"
                  stroke="var(--color-bg-zinc-100)"
                  className="stroke-zinc-100 dark:stroke-zinc-800"
                  strokeWidth={strokeWidth}
                />
                {filteredBreakdown.map((item, idx) => {
                  const slicePercentage = (item.amount / totalAmount) * 100;
                  const strokeLength = (slicePercentage / 100) * circumference;
                  const previousAccumulated = filteredBreakdown
                    .slice(0, idx)
                    .reduce((sum, prevItem) => sum + (prevItem.amount / totalAmount) * 100, 0);
                  const strokeOffset = circumference - (previousAccumulated / 100) * circumference;
                  const color = donutColors[idx % donutColors.length];

                  return (
                    <circle
                      key={idx}
                      cx="65"
                      cy="65"
                      r={radius}
                      fill="transparent"
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  );
                })}
              </svg>
              {/* Inner details text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">ยอดรวม</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  ฿{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* List labels */}
            <div className="space-y-2">
              {filteredBreakdown.map((item, idx) => {
                const color = donutColors[idx % donutColors.length];
                const percentage = Math.round((item.amount / totalAmount) * 100);

                return (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-zinc-400 font-medium">{percentage}%</span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-100">
                        ฿{item.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
