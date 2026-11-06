"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";
import { saveAiConfig, testGeminiConfigAction } from "@/app/adminActions";
import { GEMINI_MODEL_OPTIONS, buildModelTryList } from "@/lib/geminiService";

export default function AiConfigTab({
  aiConfig,
  setAiConfig,
  aiLoading,
  showToast,
}) {
  const [aiSaving, setAiSaving] = useState(false);
  const [aiTesting, setAiTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveAiConfig = async (e) => {
    e.preventDefault();
    setAiSaving(true);
    const res = await saveAiConfig(aiConfig);
    if (res.success) {
      showToast("บันทึกการตั้งค่า AI สำเร็จแล้ว! พร้อมใช้งาน");
    } else {
      showToast("บันทึกไม่สำเร็จ: " + res.error, "error");
    }
    setAiSaving(false);
  };

  const handleTestConnection = async () => {
    if (!aiConfig.apiKey || !aiConfig.apiKey.trim()) {
      showToast("กรุณากรอก Gemini API Key ก่อนทดสอบ", "error");
      return;
    }
    setAiTesting(true);
    setTestResult(null);
    const res = await testGeminiConfigAction(aiConfig);
    setTestResult(res);
    if (res.success) {
      showToast(`เชื่อมต่อสำเร็จ! ตอบกลับด้วยโมเดล ${res.usedModel}`);
    } else {
      showToast("เชื่อมต่อไม่สำเร็จ กรุณาตรวจสอบ API Key", "error");
    }
    setAiTesting(false);
  };

  const fallbackOrderPreview = buildModelTryList(
    aiConfig.model,
    aiConfig.autoFallback !== false
  );

  return (
    <main className="px-6 py-5 space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-extrabold text-zinc-800 dark:text-zinc-200">
            ตั้งค่า Google Gemini API (Super Admin)
          </h2>
        </div>
        <p className="text-[11px] text-zinc-400">
          กำหนดค่า API Key, เลือกโมเดลหลัก และระบบสลับโมเดลสำรองอัตโนมัติ (Auto Fallback)
        </p>
      </div>

      {aiLoading ? (
        <div className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
      ) : (
        <form onSubmit={handleSaveAiConfig} className="space-y-4">
          {/* Enable Gemini Switch */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100 block">
                เปิดใช้งาน Gemini AI ในแชทบอท
              </span>
              <span className="text-[11px] text-zinc-400">
                เมื่อเปิด ระบบจะวิเคราะห์ข้อมูลการเงินเฉพาะของบัญชีผู้ใช้นั้นๆ ด้วย Gemini
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(aiConfig.isEnabled)}
                onChange={(e) => setAiConfig({ ...aiConfig, isEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              Gemini API Key
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Key className="w-4 h-4" />
              </span>
              <input
                type={showApiKey ? "text" : "password"}
                value={aiConfig.apiKey}
                onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-2.5 pl-10 pr-10 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-zinc-400"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              รับ API Key ได้ฟรีจาก Google AI Studio (aistudio.google.com)
            </p>
          </div>

          {/* Gemini Model Selector (6 Models as requested) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              เลือกโมเดล Gemini หลัก (Primary AI Model)
            </label>
            <div className="grid grid-cols-1 gap-2">
              {GEMINI_MODEL_OPTIONS.map((m) => {
                const isSelected = aiConfig.model === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setAiConfig({ ...aiConfig, model: m.id })}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500"
                        : "bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                          {m.name}
                        </span>
                        <span
                          className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                            m.id === "gemini-3.5-flash-lite"
                              ? "bg-indigo-600 text-white"
                              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                          }`}
                        >
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {m.desc}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auto Fallback Mode Toggle */}
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="pr-3">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-100">
                    โหมด Auto Fallback (สลับโมเดลสำรองอัตโนมัติ)
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
                  หากโมเดลหลักโควตาเต็มหรือขัดข้อง ระบบจะไล่สลับไปใช้โมเดลสำรอง 1–5 อัตโนมัติทันทีโดยไม่สะดุด
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={aiConfig.autoFallback !== false}
                  onChange={(e) => setAiConfig({ ...aiConfig, autoFallback: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            {/* Visual Fallback Sequence */}
            <div className="pt-1 border-t border-indigo-100/80 dark:border-indigo-900/40">
              <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-300 mb-1.5">
                {aiConfig.autoFallback !== false
                  ? "🔄 ลำดับการสลับโมเดลอัตโนมัติ (Fallback Chain):"
                  : "🔒 ปิด Auto Fallback (ใช้เฉพาะโมเดลที่เลือกเท่านั้น):"}
              </p>
              <div className="flex flex-wrap items-center gap-1">
                {fallbackOrderPreview.map((modName, idx) => (
                  <React.Fragment key={modName}>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-lg font-bold ${
                        idx === 0
                          ? "bg-indigo-600 text-white"
                          : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      {idx + 1}. {modName}
                    </span>
                    {idx < fallbackOrderPreview.length - 1 && (
                      <span className="text-[10px] text-zinc-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* System Prompt Customization */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
              คำสั่งหลักสำหรับ AI (System Prompt)
            </label>
            <textarea
              rows={3}
              value={aiConfig.systemPrompt}
              onChange={(e) => setAiConfig({ ...aiConfig, systemPrompt: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-3 text-xs text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="กำหนดบทบาท เช่น ตอบคำถามการเงินอย่างสุภาพและแม่นยำ..."
            />
          </div>

          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
              <span className="uppercase tracking-wider">ความคิดสร้างสรรค์ (Temperature)</span>
              <span className="text-indigo-600 dark:text-indigo-400">{aiConfig.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={aiConfig.temperature}
              onChange={(e) => setAiConfig({ ...aiConfig, temperature: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>แม่นยำ/ตรงไปตรงมา (0.0)</span>
              <span>สมดุล (0.7)</span>
              <span>สร้างสรรค์สูง (1.0)</span>
            </div>
          </div>

          {/* Test Result Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                testResult.success
                  ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300"
                  : "bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300"
              }`}
            >
              <div className="font-extrabold flex items-center justify-between">
                <span>
                  {testResult.success
                    ? `✅ ทดสอบสำเร็จ! (ตอบโดย: ${testResult.usedModel})`
                    : "❌ ทดสอบการเชื่อมต่อไม่สำเร็จ"}
                </span>
                {testResult.fallbackUsed && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    สลับใช้โมเดลสำรองอัตโนมัติ
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-90">
                {testResult.success ? testResult.response : testResult.error}
              </p>
            </div>
          )}

          {/* Action Buttons: Test & Save */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={aiTesting || aiSaving}
              className="w-full flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-bold text-xs py-3.5 px-4 rounded-2xl transition-all disabled:opacity-60"
            >
              {aiTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                  <span>กำลังทดสอบโมเดล...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>ทดสอบการเชื่อมต่อ API</span>
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={aiSaving || aiTesting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3.5 px-5 rounded-2xl shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {aiSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>บันทึกการตั้งค่า AI</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>
              ข้อมูลที่ส่งให้ AI ประมวลผลจะถูกจำกัดเฉพาะของบัญชีผู้ใช้ที่ล็อกอินอยู่เท่านั้น (100% Isolated)
            </span>
          </div>
        </form>
      )}
    </main>
  );
}
