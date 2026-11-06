"use client";

import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Camera,
  FileImage,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { scanBankSlip, scanMultipleBankSlips } from "@/lib/slipParser";
import BatchSlipReview from "@/components/slip/BatchSlipReview";

export default function SlipScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
  onBatchSave,
}) {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [currentSlipNum, setCurrentSlipNum] = useState(0);
  const [totalSlips, setTotalSlips] = useState(0);
  const [error, setError] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]);
  const [batchItems, setBatchItems] = useState(null);
  const [isSavingBatch, setIsSavingBatch] = useState(false);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFiles = async (filesList) => {
    const files = Array.from(filesList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    setError("");
    setBatchItems(null);

    const previews = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(previews);

    setIsScanning(true);
    setProgress(5);
    setTotalSlips(files.length);
    setCurrentSlipNum(1);
    setStatusText(
      files.length > 1
        ? `กำลังโหลดรูปภาพ ${files.length} ใบ...`
        : "กำลังโหลดสลิป..."
    );

    try {
      if (files.length === 1) {
        const res = await scanBankSlip(files[0], (prog, text) => {
          setProgress(prog);
          setStatusText(text);
        });

        if (res.success) {
          setTimeout(() => {
            setIsScanning(false);
            setPreviewUrls([]);
            onScanSuccess({
              amount: res.amount ? String(res.amount) : "",
              dateStr: res.dateStr || "",
              timeStr: res.timeStr || "",
              description: res.memo || "",
              type: "expense",
            });
          }, 400);
        } else {
          setError(res.error || "ไม่สามารถอ่านข้อมูลจากสลิปได้ กรุณาลองใหม่อีกครั้ง");
          setIsScanning(false);
        }
      } else {
        const res = await scanMultipleBankSlips(
          files,
          (prog, text, currentIdx, totalCount) => {
            setProgress(prog);
            setStatusText(text);
            if (currentIdx) setCurrentSlipNum(currentIdx);
            if (totalCount) setTotalSlips(totalCount);
          }
        );

        if (res.success && res.results.length > 0) {
          const formatted = res.results.map((r, idx) => ({
            id: r.id || `slip-${idx + 1}-${Date.now()}`,
            fileName: r.fileName || `สลิปที่ ${idx + 1}`,
            amount: r.amount ? parseFloat(r.amount) : 0,
            dateStr: r.dateStr || new Date().toLocaleDateString("sv-SE"),
            timeStr: r.timeStr || "00:00",
            memo: r.memo || "",
            category: "อาหาร",
            type: "expense",
            previewUrl: previews[idx] || null,
          }));

          setTimeout(() => {
            setIsScanning(false);
            setBatchItems(formatted);
          }, 300);
        } else {
          setError(res.error || "ไม่สามารถประมวลผลสลิปได้");
          setIsScanning(false);
        }
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการประมวลผล: " + err.message);
      setIsScanning(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleReset = () => {
    setPreviewUrls([]);
    setError("");
    setIsScanning(false);
    setProgress(0);
    setBatchItems(null);
    setIsSavingBatch(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateBatchItem = (id, field, value) => {
    setBatchItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeBatchItem = (id) => {
    setBatchItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (next.length === 0) {
        handleReset();
        return null;
      }
      return next;
    });
  };

  const handleCombineTotal = () => {
    if (!batchItems || batchItems.length === 0) return;

    const totalAmount = batchItems.reduce(
      (sum, item) => sum + (parseFloat(item.amount) || 0),
      0
    );

    const memoParts = batchItems
      .map((it) => {
        const amtStr = `฿${parseFloat(it.amount || 0).toLocaleString()}`;
        return it.memo ? `${it.memo} (${amtStr})` : amtStr;
      })
      .filter(Boolean);

    const combinedMemo = memoParts.join(" + ");
    const latestDate = batchItems[0]?.dateStr || new Date().toLocaleDateString("sv-SE");
    const latestTime = batchItems[0]?.timeStr || "00:00";

    onScanSuccess({
      amount: String(totalAmount),
      dateStr: latestDate,
      timeStr: latestTime,
      description: combinedMemo,
      category: batchItems[0]?.category || "อาหาร",
      type: "expense",
    });

    handleReset();
    onClose();
  };

  const handleSaveAllSeparate = async () => {
    if (!batchItems || batchItems.length === 0) return;

    setIsSavingBatch(true);
    try {
      if (onBatchSave) {
        const success = await onBatchSave(batchItems);
        if (success) {
          handleReset();
          onClose();
        } else {
          setError("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        }
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการบันทึก: " + err.message);
    } finally {
      setIsSavingBatch(false);
    }
  };

  const totalBatchAmount = batchItems
    ? batchItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={!isScanning && !isSavingBatch ? onClose : undefined}
      />

      <div className="relative w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-[2.5rem] sm:rounded-[2rem] border-t sm:border border-zinc-100 dark:border-zinc-800/80 shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col justify-between transition-all duration-300 animate-slide-up sm:animate-scale-in">
        <div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <span>{batchItems ? "สรุปผลสแกนหลายสลิป" : "สแกนสลิปโอนเงิน"}</span>
                {batchItems && (
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                    {batchItems.length} ใบ
                  </span>
                )}
              </h2>
              <p className="text-[10px] text-zinc-400">
                {batchItems
                  ? "ตรวจสอบและเลือกรูปแบบการบันทึกที่คุณต้องการ"
                  : "รองรับทั้งสลิปเดี่ยว และเลือกหลายสลิปพร้อมกัน"}
              </p>
            </div>
          </div>
          {!isScanning && !isSavingBatch && (
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
          <div className="mb-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto pr-0.5">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isScanning || isSavingBatch}
          />

          {isScanning ? (
            <div className="w-full flex flex-col items-center text-center space-y-4 py-6">
              <div className="flex items-center justify-center gap-2 overflow-hidden py-1">
                {previewUrls.slice(0, 3).map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-32 rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Slip Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[1px]" />
                  </div>
                ))}
              </div>

              <div className="w-full space-y-2 max-w-xs">
                <div className="flex justify-between text-xs font-bold text-zinc-600 dark:text-zinc-300">
                  <span className="flex items-center gap-1.5 truncate pr-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500 shrink-0" />
                    <span>{statusText}</span>
                  </span>
                  <span className="shrink-0">{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">
                {totalSlips > 1
                  ? `กำลังวิเคราะห์สลิปที่ ${currentSlipNum} จาก ${totalSlips} ใบ...`
                  : "ประมวลผลบนเครื่องของคุณ ไม่มีการบันทึกรูปภาพ"}
              </p>
            </div>
          ) : batchItems ? (
            <BatchSlipReview
              batchItems={batchItems}
              totalBatchAmount={totalBatchAmount}
              isSavingBatch={isSavingBatch}
              onUpdateBatchItem={updateBatchItem}
              onRemoveBatchItem={removeBatchItem}
              onCombineTotal={handleCombineTotal}
              onSaveAllSeparate={handleSaveAllSeparate}
              onReset={handleReset}
            />
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 mb-1">
                คลิกเพื่อเลือกรูปสลิป
              </p>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                ✨ เลือกได้หลายสลิปพร้อมกันในครั้งเดียว
              </p>
              <p className="text-[11px] text-zinc-400 mb-4 max-w-[240px]">
                ลากรูปมาวาง หรือแตะเพื่อเลือกรูปจากคลังภาพได้ทีละหลายๆ ใบ
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full text-[11px] font-semibold">
                  <FileImage className="w-3.5 h-3.5" /> คลังรูปภาพ (หลายรูป)
                </span>
                <span className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full text-[11px] font-semibold">
                  <Camera className="w-3.5 h-3.5" /> ถ่ายรูป
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        {!batchItems && (
          <div className="pt-2 text-center shrink-0">
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
              ระบบ OCR ภาษาไทยในตัว ประมวลผลบนเครื่องของคุณ ไม่มีการบันทึกภาพสลิป
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
