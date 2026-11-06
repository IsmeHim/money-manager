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
async function callSingleGeminiModel({ apiKey, model, systemInstruction, userPrompt, temperature = 0.7 }) {
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
      temperature: typeof temperature === "number" ? temperature : 0.7,
      maxOutputTokens: 1024,
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
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error(`[${model}] ไม่ได้รับข้อความตอบกลับจากโมเดล`);
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

กฎเหล็กด้านความปลอดภัยและความแม่นยำ:
1. ตอบคำถามโดยอ้างอิงจาก "ข้อมูลการเงินของผู้ใช้ปัจจุบัน" ที่แนบให้ด้านล่างนี้เท่านั้น ห้ามแต่งตัวเลขหรือข้อมูลธุรกรรมขึ้นมาเองเด็ดขาด
2. ข้อมูลที่ให้ไปเป็นข้อมูลเฉพาะของบัญชีผู้ใช้นี้เท่านั้น
3. แสดงวันที่เป็นภาษาไทยเข้าใจง่าย (เช่น 1 กันยายน 2569) และใส่เครื่องหมายลูกน้ำคั่นหลักพันในตัวเลขจำนวนเงิน (เช่น ฿1,250)
4. ตอบกระชับ อ่านง่าย ใช้ Emoji และหัวข้อย่อย (Bullet points) ให้สวยงาม`;

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
        temperature: aiConfig?.temperature ?? 0.7,
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
      // If API key itself is invalid (HTTP 400 API_KEY_INVALID), no need to retry other models
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
 * Builds a strictly user-isolated financial context summary for Gemini
 */
export function buildUserFinancialContext({
  currentUser,
  walletOwner,
  allUserTransactions,
  matchedTransactions,
  parsedQuery,
}) {
  const now = new Date();
  const todayIso = now.toLocaleDateString("sv-SE");
  const thaiYear = now.getFullYear() + 543;
  const currentMonthPrefix = todayIso.slice(0, 7);

  let totalIncome = 0;
  let totalExpense = 0;
  let monthIncome = 0;
  let monthExpense = 0;
  const monthCategoryMap = {};

  for (const tx of allUserTransactions) {
    const amt = Number(tx.amount) || 0;
    if (tx.type === "income") {
      totalIncome += amt;
    } else {
      totalExpense += amt;
    }

    if (tx.dateStr && tx.dateStr.startsWith(currentMonthPrefix)) {
      if (tx.type === "income") {
        monthIncome += amt;
      } else {
        monthExpense += amt;
        monthCategoryMap[tx.category] = (monthCategoryMap[tx.category] || 0) + amt;
      }
    }
  }

  const netBalance = totalIncome - totalExpense;
  const monthCategoryLines = Object.entries(monthCategoryMap)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `  - ${cat}: ฿${amt.toLocaleString()}`)
    .join("\n");

  const formatTxLine = (t) => {
    const sign = t.type === "income" ? "+รายรับ" : "-รายจ่าย";
    const timePart = t.timeStr ? ` ${t.timeStr}` : "";
    const descPart = t.description ? ` | รายละเอียด: "${t.description}"` : "";
    const recorderPart = t.recordedBy ? ` (โดย ${t.recordedBy})` : "";
    return `• [${t.dateStr}${timePart}] [${sign}] หมวด "${t.category}": ฿${Number(
      t.amount
    ).toLocaleString()}${descPart}${recorderPart}`;
  };

  let matchedSection = "";
  if (matchedTransactions && matchedTransactions.length > 0) {
    const matchedLines = matchedTransactions.slice(0, 50).map(formatTxLine).join("\n");
    matchedSection = `\n=== รายการที่ตรงกับคำค้นหา/ช่วงเวลาที่ถาม (${parsedQuery?.periodLabel || "ที่ค้นพบ"} จำนวน ${matchedTransactions.length} รายการ) ===\n${matchedLines}\n`;
  }

  const recentLines = allUserTransactions.slice(0, 80).map(formatTxLine).join("\n");

  return `=== ข้อมูลการเงินของผู้ใช้ปัจจุบัน (แยกเฉพาะบัญชี 100%) ===
- ผู้ใช้งานที่กำลังถาม: ${currentUser.displayName || currentUser.username} (@${currentUser.username})
- กระเป๋าเงินของบัญชี: @${walletOwner} (${currentUser.familyGroup ? "กระเป๋าครอบครัวใช้ร่วมกัน" : "กระเป๋าส่วนตัว"})
- วันที่ปัจจุบันของระบบ: ${todayIso} (พ.ศ. ${thaiYear})

=== ภาพรวมกระเป๋าเงินทั้งหมดของ @${walletOwner} ===
- รายรับสะสมทั้งหมด: ฿${totalIncome.toLocaleString()}
- รายจ่ายสะสมทั้งหมด: ฿${totalExpense.toLocaleString()}
- ยอดเงินคงเหลือสุทธิ: ฿${netBalance.toLocaleString()}
- จำนวนรายการบันทึกทั้งหมด: ${allUserTransactions.length} รายการ

=== สรุปประจำเดือนปัจจุบัน (${currentMonthPrefix}) ===
- รายรับเดือนนี้: ฿${monthIncome.toLocaleString()}
- รายจ่ายเดือนนี้: ฿${monthExpense.toLocaleString()}
- แยกตามหมวดหมู่รายจ่ายเดือนนี้:
${monthCategoryLines || "  (ยังไม่มีรายจ่ายในเดือนนี้)"}
${matchedSection}
=== ประวัติธุรกรรมล่าสุดของผู้ใช้ (เรียงจากใหม่สุดไปเก่าสุด สูงสุด 80 รายการ) ===
${recentLines || "(ยังไม่มีประวัติรายการบันทึกในบัญชีนี้)"}`;
}

