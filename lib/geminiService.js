import { THAI_MONTH_NAMES } from "./chatNlpUtils";

// Priority list of Gemini models as requested by Super Admin
export const GEMINI_FALLBACK_ORDER = [
  "gemini-3.5-flash-lite", // ตัวหลัก: ฟรีวันละ 500 ครั้ง เร็ว ฉลาดพอดีกับงานร้านค้า/ฟาร์ม
  "gemini-3.1-flash-lite", // สำรอง 1: ฟรีอีก 500 ครั้ง/วัน (รวมเป็น 1,000 ครั้ง/วัน)
  "gemini-3.6-flash",      // สำรอง 2: ตัวท็อป (กรณี Lite ใช้งานไม่ได้)
  "gemini-2.5-flash",      // สำรอง 3: รวดเร็ว แม่นยำ รองรับงานร้านค้าและฟาร์ม
  "gemini-2.5-flash-lite", // สำรอง 4: ประหยัดโควต้า ตอบไวมาก
  "gemini-2.0-flash",      // สำรอง 5: เสถียรสูง
];

export const GEMINI_MODEL_OPTIONS = [
  {
    id: "gemini-3.5-flash-lite",
    name: "gemini-3.5-flash-lite",
    desc: "ตัวหลัก: ฟรีวันละ 500 ครั้ง เร็ว ฉลาดพอดีกับงานร้านค้า/ฟาร์ม",
    badge: "ตัวหลัก (แนะนำ)",
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "gemini-3.1-flash-lite",
    desc: "สำรอง 1: ฟรีอีก 500 ครั้ง/วัน (รวมเป็น 1,000 ครั้ง/วัน)",
    badge: "สำรอง 1",
  },
  {
    id: "gemini-3.6-flash",
    name: "gemini-3.6-flash",
    desc: "สำรอง 2: ตัวท็อป (กรณี Lite ใช้งานไม่ได้)",
    badge: "สำรอง 2",
  },
  {
    id: "gemini-2.5-flash",
    name: "gemini-2.5-flash",
    desc: "สำรอง 3: รวดเร็ว แม่นยำ รองรับงานร้านค้าและฟาร์ม",
    badge: "สำรอง 3",
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "gemini-2.5-flash-lite",
    desc: "สำรอง 4: ประหยัดโควต้า ตอบไวมาก",
    badge: "สำรอง 4",
  },
  {
    id: "gemini-2.0-flash",
    name: "gemini-2.0-flash",
    desc: "สำรอง 5: เสถียรสูง",
    badge: "สำรอง 5",
  },
];

/**
 * Builds the ordered list of models to attempt based on primary model and autoFallback setting
 */
export function buildModelTryList(primaryModel, autoFallback = true) {
  const startModel = primaryModel || GEMINI_FALLBACK_ORDER[0];
  if (!autoFallback) {
    return [startModel];
  }

  const remaining = GEMINI_FALLBACK_ORDER.filter((m) => m !== startModel);
  return [startModel, ...remaining];
}

/**
 * Calls a single Gemini model via Google Generative Language REST API
 */
async function callSingleGeminiModel({ apiKey, model, systemInstruction, userPrompt, temperature = 0.3 }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: typeof temperature === "number" ? temperature : 0.3,
      maxOutputTokens: 8192,
    },
  };

  if (systemInstruction && systemInstruction.trim()) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction.trim() }],
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errDetail = `HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      errDetail = errJson?.error?.message || errDetail;
    } catch {
      // ignore parse error
    }
    const err = new Error(`[${model}] ${errDetail}`);
    err.status = response.status;
    err.model = model;
    throw err;
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];
  const rawParts = candidate?.content?.parts || [];

  // Filter out internal thinking parts (thought: true) in Gemini 2.5/3.x models
  const visibleParts = rawParts.filter((p) => !p.thought);
  const partsToUse = visibleParts.length > 0 ? visibleParts : rawParts;

  const text = partsToUse
    .map((p) => p.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error(`[${model}] ไม่ได้รับข้อความตอบกลับจากโมเดล`);
  }

  // Guard against truncated or malformed partial output (e.g. cut off by MAX_TOKENS)
  if (candidate?.finishReason === "MAX_TOKENS" || text.startsWith("]") || text.length < 8) {
    throw new Error(`[${model}] ข้อความตอบกลับถูกตัดทอนหรือไม่สมบูรณ์ (${candidate?.finishReason || "short"})`);
  }

  return text;
}

/**
 * Calls Gemini with optional Auto Fallback across GEMINI_FALLBACK_ORDER
 */
export async function generateGeminiFinancialAnswer({
  aiConfig,
  userContextText,
  userQuestion,
}) {
  const apiKey = (aiConfig?.apiKey || process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    return {
      success: false,
      error: "ยังไม่ได้ตั้งค่า Gemini API Key",
    };
  }

  const primaryModel = aiConfig?.model || GEMINI_FALLBACK_ORDER[0];
  const autoFallback = aiConfig?.autoFallback !== undefined ? Boolean(aiConfig.autoFallback) : true;
  const modelsToTry = buildModelTryList(primaryModel, autoFallback);

  const systemInstruction = `${
    aiConfig?.systemPrompt ||
    "คุณคือผู้ช่วยจัดการการเงินอัจฉริยะ (Smart Money Assistant) ให้ข้อมูลสรุป วิเคราะห์ค่าใช้จ่าย และตอบคำถามการเงินอย่างเป็นมิตร สุภาพ และกระชับ"
  }

แนวทางการคิดวิเคราะห์และตอบคำถาม (ให้คุณใช้ความฉลาดของ Gemini วิเคราะห์คำถามของผู้ใช้โดยตรง):
1. วิเคราะห์ความต้องการของผู้ใช้จากคำถามโดยตรง ไม่ว่าจะถามแบบไหน เช่น ช่วงเวลา ("ตั้งแต่วันที่...ถึงปัจจุบัน", "สัปดาห์ก่อน", "เดือนตุลา", "3 วันล่าสุด"), ถามเจาะจงรายการ ("กินข้าวล่าสุด", "เปลี่ยนน้ำมันเครื่อง"), หรือให้ช่วยวิเคราะห์พฤติกรรมการใช้เงิน
2. ใช้ข้อมูลจาก "ฐานข้อมูลการเงินของบัญชีผู้ใช้ปัจจุบัน" ที่แนบให้ด้านล่างนี้ ซึ่งประกอบด้วย:
   - ตารางสรุปยอดรายเดือนทุกเดือน (คำนวณยอดรวมไว้ให้แล้ว)
   - ตารางสรุปยอดรายวันทุกวัน (คำนวณยอดรวมรายวันไว้ให้แล้ว สามารถนำยอดรายวันมาบวกรวมกันตามช่วงวันที่ที่ผู้ใช้ถามได้ทันทีอย่างแม่นยำ)
   - ประวัติรายการธุรกรรมทั้งหมดของผู้ใช้
3. ต้องระบุ "จำนวนเงินรวม (฿...)" ให้ชัดเจนทุกครั้งที่ถามเรื่องยอดเงิน รายรับ หรือรายจ่าย ห้ามตอบแค่จำนวนรายการโดยไม่บอกจำนวนเงินเด็ดขาด
4. แสดงวันที่เป็นภาษาไทยเข้าใจง่าย (เช่น 3 พฤศจิกายน 2569) และตอบให้จบประโยคครบถ้วนสวยงาม`;

  const fullPrompt = `${userContextText}\n\nคำถามจากผู้ใช้: "${userQuestion}"`;

  const errors = [];

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    try {
      const answer = await callSingleGeminiModel({
        apiKey,
        model: modelName,
        systemInstruction,
        userPrompt: fullPrompt,
        temperature: aiConfig?.temperature ?? 0.3,
      });

      return {
        success: true,
        response: answer,
        usedModel: modelName,
        fallbackUsed: i > 0,
        triedCount: i + 1,
      };
    } catch (err) {
      errors.push(`${modelName}: ${err.message}`);
      if (err.message && /API_KEY_INVALID|API key not valid/i.test(err.message)) {
        break;
      }
    }
  }

  return {
    success: false,
    error: errors.join(" | "),
    errors,
  };
}

/**
 * Helper to format YYYY-MM into Thai Month + Buddhist Year
 */
function formatThaiMonthLabel(ym) {
  if (!ym || !ym.includes("-")) return ym;
  const [y, m] = ym.split("-");
  const mIdx = parseInt(m, 10) - 1;
  const thaiYear = parseInt(y, 10) + 543;
  return `${THAI_MONTH_NAMES[mIdx] || m} ${thaiYear}`;
}

/**
 * Helper to format YYYY-MM-DD into Thai Day + Month + Buddhist Year
 */
function formatThaiDayLabel(ymd) {
  if (!ymd || !ymd.includes("-")) return ymd;
  const [y, m, d] = ymd.split("-");
  const mIdx = parseInt(m, 10) - 1;
  const thaiYear = parseInt(y, 10) + 543;
  return `${parseInt(d, 10)} ${THAI_MONTH_NAMES[mIdx] || m} ${thaiYear}`;
}

/**
 * Builds the complete, strictly user-isolated financial dataset for Gemini
 * so Gemini can freely reason over any date range, month, day, or item query.
 */
export function buildUserFinancialContext({
  currentUser,
  walletOwner,
  allUserTransactions,
}) {
  const now = new Date();
  const todayIso = now.toLocaleDateString("sv-SE");
  const thaiYear = now.getFullYear() + 543;
  const todayThai = `${now.getDate()} ${THAI_MONTH_NAMES[now.getMonth()]} ${thaiYear}`;

  let totalIncome = 0;
  let totalExpense = 0;
  const monthlyStats = {};
  const dailyStats = {};

  for (const tx of allUserTransactions) {
    const amt = Number(tx.amount) || 0;
    const isIncome = tx.type === "income";
    if (isIncome) {
      totalIncome += amt;
    } else {
      totalExpense += amt;
    }

    const ym = tx.dateStr ? tx.dateStr.slice(0, 7) : "ไม่ระบุ";
    if (!monthlyStats[ym]) {
      monthlyStats[ym] = { income: 0, expense: 0, incomeCount: 0, expenseCount: 0, categories: {} };
    }
    if (isIncome) {
      monthlyStats[ym].income += amt;
      monthlyStats[ym].incomeCount += 1;
    } else {
      monthlyStats[ym].expense += amt;
      monthlyStats[ym].expenseCount += 1;
      monthlyStats[ym].categories[tx.category] =
        (monthlyStats[ym].categories[tx.category] || 0) + amt;
    }

    const dKey = tx.dateStr || "ไม่ระบุ";
    if (!dailyStats[dKey]) {
      dailyStats[dKey] = { income: 0, expense: 0, count: 0 };
    }
    if (isIncome) {
      dailyStats[dKey].income += amt;
    } else {
      dailyStats[dKey].expense += amt;
    }
    dailyStats[dKey].count += 1;
  }

  const netBalance = totalIncome - totalExpense;

  // 1. Complete Monthly Summary Table (Every month in user's account)
  const monthlySummaryLines = Object.entries(monthlyStats)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([ym, st]) => {
      const catBreakdown = Object.entries(st.categories)
        .sort((a, b) => b[1] - a[1])
        .map(([c, a]) => `${c} ฿${a.toLocaleString()}`)
        .join(", ");
      return `• เดือน${formatThaiMonthLabel(ym)} (${ym}): รายจ่ายรวม = ฿${st.expense.toLocaleString()} (${
        st.expenseCount
      } รายการ) | รายรับรวม = ฿${st.income.toLocaleString()} (${
        st.incomeCount
      } รายการ) | สุทธิ = ฿${(st.income - st.expense).toLocaleString()}${
        catBreakdown ? ` | หมวดรายจ่าย: [${catBreakdown}]` : ""
      }`;
    })
    .join("\n");

  // 2. Complete Daily Summary Table (Every active day in user's account)
  const dailySummaryLines = Object.entries(dailyStats)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(
      ([dKey, st]) =>
        `• ${dKey} (${formatThaiDayLabel(dKey)}): รายจ่ายรวม = ฿${st.expense.toLocaleString()} | รายรับรวม = ฿${st.income.toLocaleString()} (รวม ${st.count} รายการ)`
    )
    .join("\n");

  // 3. Complete Individual Transactions List (All transactions of this user)
  const allTxLines = allUserTransactions
    .map((t) => {
      const sign = t.type === "income" ? "+รายรับ" : "-รายจ่าย";
      const timePart = t.timeStr ? ` ${t.timeStr}` : "";
      const descPart = t.description ? ` | รายละเอียด: "${t.description}"` : "";
      const recorderPart = t.recordedBy ? ` (โดย ${t.recordedBy})` : "";
      return `• [${t.dateStr} (${formatThaiDayLabel(t.dateStr)})${timePart}] ${sign} ฿${Number(
        t.amount
      ).toLocaleString()} | หมวด: ${t.category}${descPart}${recorderPart}`;
    })
    .join("\n");

  return `=== ข้อมูลผู้ใช้งานและวันที่ปัจจุบัน (เฉพาะบัญชี @${walletOwner} 100%) ===
- ผู้ใช้งานที่กำลังถาม: ${currentUser.displayName || currentUser.username} (@${currentUser.username})
- กระเป๋าเงินของบัญชี: @${walletOwner} (${currentUser.familyGroup ? "กระเป๋าครอบครัวใช้ร่วมกัน" : "กระเป๋าส่วนตัว"})
- วันที่ปัจจุบัน (วันนี้): ${todayIso} (${todayThai})

=== ภาพรวมกระเป๋าเงินสะสมทั้งหมดของ @${walletOwner} ===
- รายรับสะสมทั้งหมด: ฿${totalIncome.toLocaleString()}
- รายจ่ายสะสมทั้งหมด: ฿${totalExpense.toLocaleString()}
- ยอดเงินคงเหลือสุทธิปัจจุบัน: ฿${netBalance.toLocaleString()}
- จำนวนธุรกรรมทั้งหมด: ${allUserTransactions.length} รายการ

=== ตารางสรุปยอดรายเดือนทุกเดือน (คำนวณยอดรวมถูกต้อง 100%) ===
${monthlySummaryLines || "(ยังไม่มีข้อมูลรายเดือน)"}

=== ตารางสรุปยอดรายวันทุกวันที่มีธุรกรรม (คำนวณยอดรวมรายวันถูกต้อง 100%) ===
${dailySummaryLines || "(ยังไม่มีข้อมูลรายวัน)"}

=== ประวัติธุรกรรมทุกรายการของบัญชี @${walletOwner} (เรียงจากใหม่สุดไปเก่าสุด) ===
${allTxLines || "(ยังไม่มีประวัติรายการบันทึกในบัญชีนี้)"}`;
}
