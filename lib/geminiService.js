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
 * Gemini Tool Declaration: Precise Financial Calculator
 * Gemini decides the query filters (date range, since latest income, category, keyword),
 * and our JavaScript engine computes the exact sums so Gemini never does mental math errors.
 */
const FINANCIAL_CALCULATOR_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "calculate_financial_query",
        description:
          "เครื่องคิดเลขคำนวณยอดเงินรายรับ-รายจ่ายและค้นหาธุรกรรมตามเงื่อนไขที่ต้องการอย่างแม่นยำ 100% เรียกใช้ฟังก์ชันนี้ทุกครั้งที่ผู้ใช้ถามยอดเงินตามช่วงวันที่ (เช่น ตั้งแต่วันที่ X ถึงวันที่ Y หรือถึงวันนี้), ยอดใช้จ่ายตั้งแต่รายรับล่าสุด, ยอดตามหมวดหมู่, หรือค้นหาคำสำคัญในรายการ เพื่อให้ได้ตัวเลขที่บวกด้วยเครื่องคิดเลขอย่างถูกต้อง",
        parameters: {
          type: "OBJECT",
          properties: {
            startDate: {
              type: "STRING",
              description:
                "วันที่เริ่มต้น รูปแบบ YYYY-MM-DD (ปี ค.ศ. เช่น '2026-11-03' หากผู้ใช้ระบุ พ.ศ. 2569 ให้ลบ 543 เป็น 2026)",
            },
            endDate: {
              type: "STRING",
              description:
                "วันที่สิ้นสุด รูปแบบ YYYY-MM-DD (ปี ค.ศ. เช่น '2026-11-25' หากหมายถึงถึงวันนี้/ปัจจุบัน ให้ใส่วันที่ปัจจุบัน)",
            },
            sinceLatestIncome: {
              type: "BOOLEAN",
              description:
                "ตั้งเป็น true หากผู้ใช้ถามถึงยอดใช้จ่ายนับตั้งแต่ได้รับรายรับล่าสุด / เงินเข้าล่าสุด / เงินเดือนล่าสุด จนถึงปัจจุบัน",
            },
            incomeAmountFilter: {
              type: "NUMBER",
              description:
                "หากผู้ใช้ระบุเจาะจงว่า 'ตั้งแต่รายรับ X บาทล่าสุด' (เช่น ตั้งแต่รายรับ 1000 บาทล่าสุด) ให้ใส่ตัวเลขจำนวนเงินนั้น เช่น 1000",
            },
            category: {
              type: "STRING",
              description:
                "กรองเฉพาะชื่อหมวดหมู่ (ถ้ามี) เช่น 'อาหาร', 'เดินทาง', 'ช้อปปิ้ง', 'ค่าบ้าน/บิล', 'ความบันเทิง', 'สุขภาพ', 'การศึกษา', 'เงินเดือน', 'ธุรกิจ', 'ลงทุน'",
            },
            keyword: {
              type: "STRING",
              description:
                "คำค้นหาในรายละเอียดรายการหรือหมวดหมู่ (ถ้ามี) เช่น 'กาแฟ', 'ข้าวผัด', 'น้ำมันเครื่อง', 'หมูกระทะ'",
            },
          },
        },
      },
    ],
  },
];

/**
 * Normalizes a YYYY-MM-DD date string (converting Buddhist Era > 2400 to AD)
 */
function normalizeIsoDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return "";
  const trimmed = dateStr.trim().slice(0, 10);
  const parts = trimmed.split("-");
  if (parts.length !== 3) return trimmed;
  let year = parseInt(parts[0], 10);
  if (year > 2400) {
    year -= 543;
  }
  const month = parts[1].padStart(2, "0");
  const day = parts[2].padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Executes the financial query tool requested by Gemini with 100% exact arithmetic
 */
export function executeFinancialQueryTool(args = {}, allUserTransactions = []) {
  const sorted = [...allUserTransactions].sort((a, b) => {
    const dCmp = (b.dateStr || "").localeCompare(a.dateStr || "");
    if (dCmp !== 0) return dCmp;
    const tCmp = (b.timeStr || "00:00").localeCompare(a.timeStr || "00:00");
    if (tCmp !== 0) return tCmp;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  const startDate = normalizeIsoDate(args.startDate);
  const endDate = normalizeIsoDate(args.endDate);
  const categoryFilter = (args.category || "").trim().toLowerCase();
  const keywordFilter = (args.keyword || "").trim().toLowerCase();
  const sinceLatestIncome = Boolean(args.sinceLatestIncome);
  const incomeAmountFilter =
    args.incomeAmountFilter !== undefined && args.incomeAmountFilter !== null
      ? Number(args.incomeAmountFilter)
      : null;

  let basePool = sorted;
  let latestIncomeInfo = null;

  // Handle "Since Latest Income" mode
  if (sinceLatestIncome || (incomeAmountFilter && incomeAmountFilter > 0)) {
    const incIdx = sorted.findIndex((tx) => {
      if (tx.type !== "income") return false;
      if (incomeAmountFilter && incomeAmountFilter > 0) {
        return Math.abs(Number(tx.amount) - incomeAmountFilter) < 0.01;
      }
      return true;
    });

    if (incIdx !== -1) {
      const targetIncome = sorted[incIdx];
      // Transactions strictly after this income in chronological order
      basePool = sorted.slice(0, incIdx);
      const expensesAfter = basePool.filter((tx) => tx.type === "expense");
      const spentAfter = expensesAfter.reduce(
        (sum, tx) => sum + (Number(tx.amount) || 0),
        0
      );
      const incAmt = Number(targetIncome.amount) || 0;
      const remainAmt = incAmt - spentAfter;
      const spentPct = incAmt > 0 ? Math.round((spentAfter / incAmt) * 100) : 0;

      latestIncomeInfo = {
        incomeDate: targetIncome.dateStr,
        incomeThaiDate: formatThaiDayLabel(targetIncome.dateStr),
        incomeTime: targetIncome.timeStr || "00:00",
        incomeCategory: targetIncome.category,
        incomeDescription: targetIncome.description || "",
        incomeAmount: incAmt,
        totalExpenseSinceThisIncome: Number(spentAfter.toFixed(2)),
        expenseCountSinceThisIncome: expensesAfter.length,
        remainingFromThisIncome: Number(remainAmt.toFixed(2)),
        spentPercentage: spentPct,
      };
    }
  }

  // Apply date range, category, and keyword filters
  const matched = basePool.filter((tx) => {
    if (startDate && (tx.dateStr || "") < startDate) return false;
    if (endDate && (tx.dateStr || "") > endDate) return false;

    if (categoryFilter) {
      const cat = (tx.category || "").toLowerCase();
      if (!cat.includes(categoryFilter) && !categoryFilter.includes(cat)) {
        return false;
      }
    }

    if (keywordFilter) {
      const desc = (tx.description || "").toLowerCase();
      const cat = (tx.category || "").toLowerCase();
      if (!desc.includes(keywordFilter) && !cat.includes(keywordFilter)) {
        return false;
      }
    }

    return true;
  });

  let totalExpense = 0;
  let totalIncome = 0;
  let expenseCount = 0;
  let incomeCount = 0;
  const expenseByCategory = {};
  const expenseByDate = {};

  for (const tx of matched) {
    const amt = Number(tx.amount) || 0;
    if (tx.type === "income") {
      totalIncome += amt;
      incomeCount += 1;
    } else {
      totalExpense += amt;
      expenseCount += 1;
      const c = tx.category || "อื่นๆ";
      expenseByCategory[c] = Number(((expenseByCategory[c] || 0) + amt).toFixed(2));
      const d = tx.dateStr || "ไม่ระบุ";
      expenseByDate[d] = Number(((expenseByDate[d] || 0) + amt).toFixed(2));
    }
  }

  return {
    appliedFilters: {
      startDate: startDate || null,
      startThaiDate: startDate ? formatThaiDayLabel(startDate) : null,
      endDate: endDate || null,
      endThaiDate: endDate ? formatThaiDayLabel(endDate) : null,
      sinceLatestIncome,
      incomeAmountFilter,
      category: args.category || null,
      keyword: args.keyword || null,
    },
    latestIncomeCycleResult: latestIncomeInfo,
    calculatedSummary: {
      totalExpense: Number(totalExpense.toFixed(2)),
      expenseCount,
      totalIncome: Number(totalIncome.toFixed(2)),
      incomeCount,
      netBalanceInPeriod: Number((totalIncome - totalExpense).toFixed(2)),
    },
    expenseBreakdownByCategory: expenseByCategory,
    expenseBreakdownByDate: expenseByDate,
    matchingTransactionsSample: matched.slice(0, 35).map((t) => ({
      date: t.dateStr,
      thaiDate: formatThaiDayLabel(t.dateStr),
      time: t.timeStr || "",
      type: t.type === "income" ? "รายรับ" : "รายจ่าย",
      amount: Number(t.amount),
      category: t.category,
      description: t.description || "",
    })),
  };
}

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
 * Extracts visible text from a Gemini candidate and validates it
 */
function extractCandidateText(candidate, model) {
  const rawParts = candidate?.content?.parts || [];
  const visibleParts = rawParts.filter((p) => !p.thought && !p.functionCall);
  const partsToUse = visibleParts.length > 0 ? visibleParts : rawParts.filter((p) => p.text);

  const text = partsToUse
    .map((p) => p.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error(`[${model}] ไม่ได้รับข้อความตอบกลับจากโมเดล`);
  }

  if (candidate?.finishReason === "MAX_TOKENS" || text.startsWith("]") || text.length < 4) {
    throw new Error(
      `[${model}] ข้อความตอบกลับถูกตัดทอนหรือไม่สมบูรณ์ (${candidate?.finishReason || "short"})`
    );
  }

  return text;
}

/**
 * Calls a single Gemini model via Google Generative Language REST API,
 * supporting Function Calling (Tool Use) so Gemini can invoke `calculate_financial_query`.
 */
async function callSingleGeminiModel({
  apiKey,
  model,
  systemInstruction,
  userPrompt,
  temperature = 0.2,
  allUserTransactions = [],
}) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const contents = [
    {
      role: "user",
      parts: [{ text: userPrompt }],
    },
  ];

  const baseBody = {
    contents,
    tools: FINANCIAL_CALCULATOR_TOOLS,
    generationConfig: {
      temperature: typeof temperature === "number" ? temperature : 0.2,
      maxOutputTokens: 8192,
    },
  };

  if (systemInstruction && systemInstruction.trim()) {
    baseBody.systemInstruction = {
      parts: [{ text: systemInstruction.trim() }],
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(baseBody),
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

  // Check if Gemini decided to call our financial calculator tool
  const functionCallParts = rawParts.filter((p) => p.functionCall);

  if (functionCallParts.length > 0) {
    const functionResponseParts = functionCallParts.map((part) => {
      const fc = part.functionCall;
      const calcResult = executeFinancialQueryTool(fc.args || {}, allUserTransactions);
      return {
        functionResponse: {
          name: fc.name,
          response: {
            result: calcResult,
          },
        },
      };
    });

    const followUpBody = {
      ...baseBody,
      contents: [
        ...contents,
        candidate.content, // preserve exact model turn (including thoughtSignature if any)
        {
          role: "user",
          parts: functionResponseParts,
        },
      ],
    };

    const followUpRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(followUpBody),
    });

    if (followUpRes.ok) {
      const followUpData = await followUpRes.json();
      const followUpCandidate = followUpData?.candidates?.[0];
      return extractCandidateText(followUpCandidate, model);
    }
  }

  return extractCandidateText(candidate, model);
}

/**
 * Calls Gemini with optional Auto Fallback across GEMINI_FALLBACK_ORDER
 */
export async function generateGeminiFinancialAnswer({
  aiConfig,
  userContextText,
  userQuestion,
  recentChatHistory = [],
  allUserTransactions = [],
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

แนวทางการคิดวิเคราะห์และตอบคำถาม (สำคัญมาก):
1. คุณมีเครื่องมือเครื่องคิดเลขชื่อ \`calculate_financial_query\` ติดตั้งอยู่! เมื่อผู้ใช้ถามยอดเงินตามช่วงวันที่ (เช่น "ตั้งแต่วันที่...ถึงวันที่...", "ตั้งแต่วันที่...ถึงวันนี้", "3 วันล่าสุด", "สัปดาห์ก่อน"), ถามยอดตั้งแต่รายรับล่าสุด, ถามยอดเฉพาะหมวดหมู่ หรือค้นหารายการเฉพาะคำ ให้คุณเรียกใช้ \`calculate_financial_query\` เพื่อส่งเงื่อนไขให้ระบบคำนวณยอดเงินที่แม่นยำ 100% มาให้คุณตอบ ห้ามบวกเลขหลายรายการในหัวเองเด็ดขาด
2. ยึดตัวเลขที่ได้จากผลลัพธ์ของ \`calculate_financial_query\` หรือตัวเลขสำเร็จรูปในฐานข้อมูลเป็นความจริงสูงสุดเสมอ
3. หากผู้ใช้ถามย้ำหรือทักท้วงตัวเลข (เช่น "ถูกใช่ไหม", "รวมวันนี้หรือยัง") ให้เรียก \`calculate_financial_query\` หรือตรวจสอบฐานข้อมูลใหม่ทุกครั้ง ห้ามยืนยันตามข้อความเก่าหากตัวเลขเก่าไม่ตรงกับผลคำนวณจริง
4. ระบุ "จำนวนเงินรวม (฿...)" และจำนวนรายการให้ชัดเจนทุกครั้ง แสดงวันที่เป็นภาษาไทยเข้าใจง่าย (เช่น 18 พฤศจิกายน 2569)`;

  let historySection = "";
  if (recentChatHistory && recentChatHistory.length > 0) {
    const historyLines = recentChatHistory
      .map((m) => `${m.sender === "user" ? "ผู้ใช้" : "AI"}: ${m.text}`)
      .join("\n");
    historySection = `\n=== ประวัติการสนทนาก่อนหน้า (เพื่อความต่อเนื่อง) ===\n${historyLines}\n`;
  }

  const fullPrompt = `${userContextText}${historySection}\nคำถามล่าสุดจากผู้ใช้: "${userQuestion}"`;

  const errors = [];

  for (let i = 0; i < modelsToTry.length; i++) {
    const modelName = modelsToTry[i];
    try {
      const answer = await callSingleGeminiModel({
        apiKey,
        model: modelName,
        systemInstruction,
        userPrompt: fullPrompt,
        temperature: aiConfig?.temperature ?? 0.2,
        allUserTransactions,
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
 */
export function buildUserFinancialContext({
  currentUser,
  walletOwner,
  allUserTransactions,
  allUserDebts = [],
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
      dailyStats[dKey] = { income: 0, expense: 0, count: 0, expenseCount: 0, incomeCount: 0 };
    }
    if (isIncome) {
      dailyStats[dKey].income += amt;
      dailyStats[dKey].incomeCount += 1;
    } else {
      dailyStats[dKey].expense += amt;
      dailyStats[dKey].expenseCount += 1;
    }
    dailyStats[dKey].count += 1;
  }

  const netBalance = totalIncome - totalExpense;

  // 1. Complete Monthly Summary Table
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

  // 2. Complete Daily Summary Table + Pre-calculated Cumulative Range Totals
  let runningExpenseToToday = 0;
  let runningIncomeToToday = 0;
  let runningExpenseCountToToday = 0;

  const dailySummaryLines = Object.entries(dailyStats)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([dKey, st]) => {
      runningExpenseToToday += st.expense;
      runningIncomeToToday += st.income;
      runningExpenseCountToToday += st.expenseCount || 0;
      return `• ${dKey} (${formatThaiDayLabel(
        dKey
      )}): เฉพาะวันนี้ รายจ่าย = ฿${st.expense.toLocaleString()} (${
        st.expenseCount || 0
      } รายการจ่าย), รายรับ = ฿${st.income.toLocaleString()} | 👉 [ยอดรายจ่ายสะสมตั้งแต่วันที่ ${formatThaiDayLabel(
        dKey
      )} ถึงปัจจุบัน = ฿${runningExpenseToToday.toLocaleString()} (${runningExpenseCountToToday} รายการจ่าย) | รายรับสะสมถึงปัจจุบัน = ฿${runningIncomeToToday.toLocaleString()}]`;
    })
    .join("\n");

  // 2.5 Pre-calculated Latest Income Cycle
  const sortedChronological = [...allUserTransactions].sort((a, b) => {
    const dCmp = (b.dateStr || "").localeCompare(a.dateStr || "");
    if (dCmp !== 0) return dCmp;
    const tCmp = (b.timeStr || "00:00").localeCompare(a.timeStr || "00:00");
    if (tCmp !== 0) return tCmp;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  let latestIncomeCycleText = "(ยังไม่มีรายการรายรับในระบบ)";
  const latestIncIdx = sortedChronological.findIndex((tx) => tx.type === "income");
  if (latestIncIdx !== -1) {
    const latestInc = sortedChronological[latestIncIdx];
    const expensesAfterInc = sortedChronological
      .slice(0, latestIncIdx)
      .filter((tx) => tx.type === "expense");
    const spentAfterInc = expensesAfterInc.reduce(
      (sum, tx) => sum + (Number(tx.amount) || 0),
      0
    );
    const incAmt = Number(latestInc.amount) || 0;
    const remainAfterInc = incAmt - spentAfterInc;
    const spentPct = incAmt > 0 ? Math.round((spentAfterInc / incAmt) * 100) : 0;

    latestIncomeCycleText = `- รายรับล่าสุด: หมวด "${latestInc.category}"${
      latestInc.description ? ` (รายละเอียด: "${latestInc.description}")` : ""
    } เมื่อวันที่ ${latestInc.dateStr} (${formatThaiDayLabel(latestInc.dateStr)}) เวลา ${
      latestInc.timeStr || "00:00"
    } จำนวนเงิน +฿${incAmt.toLocaleString()}
- ยอดใช้จ่ายรวมตั้งแต่ได้รับรายรับล่าสุดก้อนนี้จนถึงปัจจุบัน (ตรงกับการ์ดหน้าแดชบอร์ด 100%): ฿${spentAfterInc.toLocaleString()} (รวม ${
      expensesAfterInc.length
    } รายการจ่าย, คิดเป็น ${spentPct}% ของรายรับก้อนนี้)
- ยอดเงินคงเหลือจากรายรับก้อนล่าสุดนี้: ฿${remainAfterInc.toLocaleString()} (เหลือ ${Math.max(
      100 - spentPct,
      0
    )}%)`;
  }

  // 3. Complete Individual Transactions List
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

  // 4. Debt Summary & Records
  let totalLentUnpaid = 0;
  let totalBorrowedUnpaid = 0;
  for (const d of allUserDebts) {
    if (d.status !== "paid") {
      if (d.direction === "lent") totalLentUnpaid += Number(d.amount) || 0;
      else totalBorrowedUnpaid += Number(d.amount) || 0;
    }
  }

  const debtLines = allUserDebts
    .map((d) => {
      const dirLabel =
        d.direction === "lent" ? "ลูกหนี้ (คนอื่นติดหนี้เรา)" : "เจ้าหนี้ (เราติดหนี้คนอื่น)";
      const statusLabel =
        d.status === "paid"
          ? `จ่ายคืนแล้วเมื่อ ${d.paidDateStr || "-"}`
          : "ยังค้างชำระ";
      const duePart = d.dueDateStr ? ` | นัดคืน: ${d.dueDateStr}` : "";
      const notePart = d.note ? ` | หมายเหตุ: "${d.note}"` : "";
      return `• [${dirLabel}] ชื่อ: ${d.personName} | จำนวน: ฿${Number(
        d.amount
      ).toLocaleString()} | สถานะ: ${statusLabel} | วันที่ยืม: ${d.dateStr}${duePart}${notePart}`;
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

=== ข้อมูลรอบรายรับล่าสุด (คำนวณแม่นยำ 100% ตรงกับหน้าแดชบอร์ด) ===
${latestIncomeCycleText}

=== ข้อมูลหนี้สิน (ลูกหนี้/เจ้าหนี้) ของบัญชี @${walletOwner} ===
- ยอดรวมคนอื่นติดหนี้เรา (ค้างชำระ): ฿${totalLentUnpaid.toLocaleString()}
- ยอดรวมเราติดหนี้คนอื่น (ค้างชำระ): ฿${totalBorrowedUnpaid.toLocaleString()}
- รายการหนี้ทั้งหมด:
${debtLines || "(ไม่มีรายการหนี้ในระบบ)"}

=== ตารางสรุปยอดรายเดือนทุกเดือน (คำนวณยอดรวมถูกต้อง 100%) ===
${monthlySummaryLines || "(ยังไม่มีข้อมูลรายเดือน)"}

=== ตารางสรุปยอดรายวันทุกวันที่มีธุรกรรม (คำนวณยอดรวมรายวันถูกต้อง 100%) ===
${dailySummaryLines || "(ยังไม่มีข้อมูลรายวัน)"}

=== ประวัติธุรกรรมทุกรายการของบัญชี @${walletOwner} (เรียงจากใหม่สุดไปเก่าสุด) ===
${allTxLines || "(ยังไม่มีประวัติรายการบันทึกในบัญชีนี้)"}`;
}
