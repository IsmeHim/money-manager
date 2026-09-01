"use client";

import React, { useState, useRef } from "react";
import { X, Upload, Camera, FileImage, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { scanBankSlip } from "@/lib/slipParser";

export default function SlipScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setError("");
    setIsScanning(true);
    setProgress(10);
    setStatusText("กำลังโหลดสลิป...");

    try {
      const res = await scanBankSlip(file, (prog, text) => {
        setProgress(prog);
        setStatusText(text);
      });

      if (res.success) {
        // Short pause to show 100% completion before opening transaction form
        setTimeout(() => {
          setIsScanning(false);
          setPreviewUrl(null);
          onScanSuccess({
            amount: res.amount ? String(res.amount) : "",
            dateStr: res.dateStr || "",
            timeStr: res.timeStr || "",
            description: res.memo || "",
            type: "expense", // Default to expense
          });
        }, 500);
      } else {
        setError(res.error || "ไม่สามารถอ่านข้อมูลจากสลิปได้ กรุณาลองใหม่อีกครั้ง");
        setIsScanning(false);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการประมวลผล: " + err.message);
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setError("");
    setIsScanning(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={!isScanning ? onClose : undefined}
      ></div>

      {/* Modal Sheet */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2rem] border-t sm:border border-zinc-100 dark:border-zinc-800/80 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col justify-between transition-all duration-300 animate-slide-up sm:animate-scale-in">
        {/* Mobile drag handle */}
        <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-5 sm:hidden"></div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
                สแกนสลิปโอนเงิน
              </h2>
              <p className="text-[10px] text-zinc-400">
                อ่านยอดเงิน วันที่ และบันทึกช่วยจำอัตโนมัติ
              </p>
            </div>
          </div>
          {!isScanning && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload & Scanner Body */}
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isScanning}
          />

          {isScanning ? (
            <div className="w-full flex flex-col items-center text-center space-y-4 py-6">
              {/* Preview with scanning overlay */}
              {previewUrl && (
                <div className="relative w-36 h-48 rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Slip Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="w-full h-1 bg-indigo-400 absolute top-0 animate-bounce shadow-lg"></div>
                  </div>
                </div>
              )}

              {/* Progress info */}
              <div className="w-full space-y-2 max-w-xs">
                <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    {statusText}
                  </span>
                  <span>{progress}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">
                ประมวลผลบนเครื่องของคุณ ไม่มีการบันทึกรูปภาพ
              </p>
            </div>
          ) : previewUrl && error ? (
            <div className="w-full flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-44 rounded-2xl overflow-hidden shadow-md border border-zinc-200 dark:border-zinc-800 opacity-60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Slip Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 py-2.5 px-5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-full text-xs font-bold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>เลือกรูปภาพใหม่</span>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-1">
                คลิกเพื่อเลือกรูปสลิป
              </p>
              <p className="text-xs text-zinc-400 mb-4 max-w-[200px]">
                รองรับสลิปธนาคารทุกค่าย (กสิกร, กรุงไทย, SCB, กรุงเทพ ฯลฯ)
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full text-[11px] font-semibold">
                  <FileImage className="w-3.5 h-3.5" /> คลังรูปภาพ
                </span>
                <span className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full text-[11px] font-semibold">
                  <Camera className="w-3.5 h-3.5" /> ถ่ายรูป
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            ระบบจะดึงตัวเลขและวันที่ให้ทันที คุณเพียงแค่เลือกหมวดหมู่ที่ต้องการ
          </p>
        </div>
      </div>
    </div>
  );
}
