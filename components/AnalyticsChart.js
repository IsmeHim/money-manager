"use client";

import React, { useState } from "react";

function formatMoney(val) {
  const num = Number(val) || 0;
  const hasDecimals = Math.abs(num % 1) > 0.001;
  return num.toLocaleString("th-TH", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

export default function AnalyticsChart({ chartData = [], categoryBreakdown = [], view }) {
  const [breakdownType, setBreakdownType] = useState("expense"); // 'expense' | 'income'
  const [selectedIdx, setSelectedIdx] = useState(null);

  // --- Bar Chart Logic ---
  const maxVal = Math.max(
    ...chartData.map((d) => Math.max(d?.income || 0, d?.expense || 0)),
    100 // Prevent division by zero
  );

  // --- Donut Chart Logic ---
  const filteredBreakdown = categoryBreakdown.filter(
    (item) => item.type === breakdownType
  );
  const totalAmount = filteredBreakdown.reduce((sum, item) => sum + item.amount, 0);

  // Reset selectedIdx if out of bounds
  const activeItem =
    selectedIdx !== null && filteredBreakdown[selectedIdx]
      ? filteredBreakdown[selectedIdx]
      : null;

  // SVG parameters for Donut
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius; // ~314.159

  // Assign distinct aesthetic colors to categories
  const donutColors = [
    "#f43f5e", // rose (อาหาร / อันดับ 1)
    "#3b82f6", // blue (อันดับ 2)
    "#a855f7", // purple (อันดับ 3)
    "#f59e0b", // amber (อันดับ 4)
    "#ec4899", // pink (อันดับ 5)
    "#10b981", // emerald (อันดับ 6)
    "#6366f1", // indigo (อันดับ 7)
    "#14b8a6", // teal (อันดับ 8)
    "#06b6d4", // cyan (อันดับ 9)
    "#84cc16", // lime (อันดับ 10)
  ];

  const handleToggleType = (type) => {
    setBreakdownType(type);
    setSelectedIdx(null);
  };

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
        <div className="overflow-x-auto no-scrollbar scrollbar-none -mx-2 px-2">
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
                      {d?.income > 0 && <div className="text-emerald-400">รับ: ฿{formatMoney(d.income)}</div>}
                      {d?.expense > 0 && <div className="text-rose-400">จ่าย: ฿{formatMoney(d.expense)}</div>}
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
          <div>
            <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
              สัดส่วนหมวดหมู่
            </h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              แตะที่หมวดหมู่เพื่อดูรายละเอียดเฉพาะหมวด
            </p>
          </div>

          {/* Toggle breakdown type */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-0.5 rounded-full text-xs">
            <button
              onClick={() => handleToggleType("expense")}
              className={`px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                breakdownType === "expense"
                  ? "bg-white dark:bg-zinc-700 text-rose-500 shadow-sm"
                  : "text-zinc-500"
              }`}
            >
              รายจ่าย
            </button>
            <button
              onClick={() => handleToggleType("income")}
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
          <div className="grid grid-cols-1 gap-6 items-center">
            {/* Donut SVG drawing */}
            <div className="relative flex justify-center">
              <svg width="175" height="175" viewBox="0 0 130 130" className="transform -rotate-90">
                {/* Background Track */}
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  fill="transparent"
                  className="stroke-zinc-100 dark:stroke-zinc-800/90"
                  strokeWidth={strokeWidth}
                />

                {filteredBreakdown.map((item, idx) => {
                  const fraction = item.amount / totalAmount;
                  const exactArcLength = fraction * circumference;

                  // Cumulative arc length before this segment
                  const previousArcLength = filteredBreakdown
                    .slice(0, idx)
                    .reduce((sum, prevItem) => sum + (prevItem.amount / totalAmount) * circumference, 0);

                  // Small 1.5px visual gap between slices when there are multiple categories
                  const gap = filteredBreakdown.length > 1 ? Math.min(1.5, exactArcLength * 0.25) : 0;
                  const visibleLength = Math.max(exactArcLength - gap, 1.5);
                  const strokeOffset = -previousArcLength;
                  const color = donutColors[idx % donutColors.length];
                  const isSelected = selectedIdx === idx;
                  const isDimmed = selectedIdx !== null && !isSelected;

                  return (
                    <circle
                      key={item.category}
                      cx="65"
                      cy="65"
                      r={radius}
                      fill="transparent"
                      stroke={color}
                      strokeWidth={isSelected ? strokeWidth + 3 : strokeWidth}
                      strokeDasharray={`${visibleLength} ${Math.max(circumference - visibleLength, 0)}`}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="butt"
                      onClick={() => setSelectedIdx(isSelected ? null : idx)}
                      className={`cursor-pointer transition-all duration-300 ease-out ${
                        isDimmed ? "opacity-30" : "opacity-100"
                      }`}
                    />
                  );
                })}
              </svg>

              {/* Inner details text (click to reset to total) */}
              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                className="absolute inset-0 m-auto w-24 h-24 rounded-full flex flex-col items-center justify-center text-center px-1 focus:outline-none"
              >
                {activeItem ? (
                  <>
                    <span
                      className="text-[10.5px] font-extrabold truncate max-w-[85px]"
                      style={{
                        color: donutColors[selectedIdx % donutColors.length],
                      }}
                    >
                      {activeItem.category}
                    </span>
                    <span className="text-sm font-black text-zinc-900 dark:text-white leading-tight mt-0.5">
                      ฿{formatMoney(activeItem.amount)}
                    </span>
                    <span className="text-[9.5px] font-bold text-zinc-400 mt-0.5">
                      {((activeItem.amount / totalAmount) * 100).toFixed(1).replace(/\.0$/, "")}%
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                      ยอดรวม
                    </span>
                    <span className="text-sm font-black text-zinc-800 dark:text-zinc-100 mt-0.5">
                      ฿{formatMoney(totalAmount)}
                    </span>
                    <span className="text-[9px] text-zinc-400 mt-0.5">
                      {filteredBreakdown.length} หมวดหมู่
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* List labels with Mini Progress Bars */}
            <div className="space-y-2.5">
              {filteredBreakdown.map((item, idx) => {
                const color = donutColors[idx % donutColors.length];
                const rawPct = (item.amount / totalAmount) * 100;
                const displayPct =
                  rawPct > 0 && rawPct < 1
                    ? "<1"
                    : Math.round(rawPct);
                const isSelected = selectedIdx === idx;

                return (
                  <button
                    type="button"
                    key={item.category}
                    onClick={() => setSelectedIdx(isSelected ? null : idx)}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? "bg-zinc-100/90 dark:bg-zinc-800/90 border-zinc-300 dark:border-zinc-700 shadow-2xs scale-[1.01]"
                        : "bg-zinc-50/50 dark:bg-zinc-900/40 border-transparent hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                          style={{ backgroundColor: color }}
                        ></span>
                        <span className="text-zinc-700 dark:text-zinc-200 font-bold">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-right">
                        <span
                          className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${color}18`,
                            color,
                          }}
                        >
                          {displayPct}%
                        </span>
                        <span className="font-extrabold text-zinc-900 dark:text-zinc-100 min-w-[70px]">
                          ฿{formatMoney(item.amount)}
                        </span>
                      </div>
                    </div>

                    {/* Mini proportional progress bar */}
                    <div className="w-full h-1.5 bg-zinc-200/70 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${Math.max(rawPct, 2)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
