// Thai Month definitions
const THAI_MONTH_NAMES = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

const THAI_SHORT_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

const CATEGORY_KEYWORDS = {
  "อาหาร": ["อาหาร", "ข้าว", "กิน", "กาแฟ", "ขนม", "บุฟเฟต์", "ชาบู", "ก๋วยเตี๋ยว", "เครื่องดื่ม", "ฟู้ด", "food"],
  "เดินทาง": ["เดินทาง", "น้ำมัน", "รถ", "แท็กซี่", "bts", "mrt", "ทางด่วน", "ค่ารถ", "วิน", "grab", "bolt", "ตั๋ว", "ซ่อมรถ", "น้ำมันเครื่อง"],
  "ช้อปปิ้ง": ["ช้อปปิ้ง", "ช็อป", "ซื้อของ", "เสื้อผ้า", "shopee", "lazada", "tiktok", "ของใช้", "รองเท้า", "กระเป๋า"],
  "ค่าบ้าน/บิล": ["ค่าบ้าน", "ค่าห้อง", "บิล", "ค่าน้ำ", "ค่าไฟ", "เน็ต", "ค่าเน็ต", "เติมเน็ต", "ค่าส่วนกลาง", "ค่าเช่า", "โทรศัพท์", "ค่าโทร"],
  "ความบันเทิง": ["บันเทิง", "หนัง", "เกม", "เที่ยว", "คอนเสิร์ต", "netflix", "youtube", "สตรีม", "โรงแรม"],
  "สุขภาพ": ["สุขภาพ", "ยา", "หมอ", "พยาบาล", "หาหมอ", "คลินิก", "โรงพยาบาล", "ฟิตเนส", "วิตามิน", "ตัดผม", "ทำฟัน"],
  "การศึกษา": ["การศึกษา", "หนังสือ", "เรียน", "คอร์ส", "ค่าเทอม", "ติว", "เครื่องเขียน"],
  "เงินเดือน": ["เงินเดือน", "salary", "โบนัส", "ค่าจ้าง", "รายได้หลัก"],
  "ธุรกิจ": ["ธุรกิจ", "ค้าขาย", "ขายของ", "กำไร", "ยอดขาย"],
  "ลงทุน": ["ลงทุน", "หุ้น", "คริปโต", "กองทุน", "ดอกเบี้ย", "ปันผล"],
  "ของขวัญ": ["ของขวัญ", "แต๊ะเอีย", "เงินให้", "รางวัล"],
};

const STOP_PREFIXES = [
  "ผมเคยไปกิน", "ผมเคยไปซื้อ", "ผมเคยซื้อ", "ฉันเคยซื้อ", "ผมเคยจ่าย", "ผมเคยกิน",
  "เคยซื้อ", "เคยกิน", "เคยจ่าย", "เคยเปลี่ยน", "เคยเติม", "เคยไป", "เคยทำ",
  "ผมไปกิน", "ฉันไปกิน", "ผมไปซื้อ", "ฉันไปซื้อ", "ไปกิน", "ไปซื้อ",
  "ผมกิน", "ฉันกิน", "กิน", "ผมซื้อ", "ฉันซื้อ", "ซื้อ",
  "ผมจ่ายค่า", "จ่ายค่า", "ผมจ่าย", "ฉันจ่าย", "จ่าย",
  "ผมเปลี่ยน", "ฉันเปลี่ยน", "เปลี่ยน",
  "ผมเติม", "ฉันเติม", "เติม",
  "ผมโอน", "ฉันโอน", "โอน",
  "ผมสั่ง", "ฉันสั่ง", "สั่ง",
  "ผมทำ", "ฉันทำ", "ทำ",
  "ผมไป", "ฉันไป", "ไป",
  "ช่วยหา", "เช็คให้หน่อย", "ดูให้หน่อย", "เช็ค", "หา", "ค้นหา",
  "ผม", "ฉัน", "เรา", "หนู"
];

const STOP_SUFFIXES = [
  "ล่าสุดวันไหน", "ล่าสุดเมื่อไหร่", "ล่าสุดเมื่อไร", "ครั้งล่าสุดวันไหน", "ครั้งล่าสุดเมื่อไหร่",
  "ล่าสุดไปวันไหน", "ล่าสุดตอนไหน", "ล่าสุด", "ครั้งล่าสุด",
  "ไปกี่ครั้งแล้ว", "กี่ครั้งแล้ว", "ไปกี่ครั้ง", "กี่ครั้ง", "ไปกี่รอบแล้ว", "กี่รอบแล้ว", "กี่รอบ",
  "ไปกี่บาท", "กี่บาท", "เท่าไร", "เท่าไหร่", "ไปเท่าไร", "ไปเท่าไหร่",
  "วันไหน", "เมื่อไหร่", "เมื่อไร", "ตอนไหน", "วันไหนบ้าง", "เมื่อไหร่บ้าง",
  "เคยไหม", "เคยรึยัง", "เคยหรือยัง",
  "ไปแล้ว", "มาแล้ว", "แล้ว", "ไป", "มา",
  "บ้าง", "หรือยัง", "รึยัง", "ครับ", "ค่ะ", "นะ", "หน่อย", "จ๊ะ", "จ้า"
];

/**
 * Extracts specific item/action entity from a user question
 * e.g., "ผมกิน ข้าวผัดเผ็ด ล่าสุดวันไหน" -> "ข้าวผัดเผ็ด"
 */
function extractSearchKeyword(query) {
  let q = query.trim();

  // Strip prefixes (longest first)
  const sortedPrefixes = [...STOP_PREFIXES].sort((a, b) => b.length - a.length);
  for (const prefix of sortedPrefixes) {
    if (q.toLowerCase().startsWith(prefix.toLowerCase())) {
      q = q.slice(prefix.length).trim();
      break;
    }
  }

  // Strip suffixes (repeatedly until clean)
  const sortedSuffixes = [...STOP_SUFFIXES].sort((a, b) => b.length - a.length);
  let changed = true;
  while (changed) {
    changed = false;
    for (const suffix of sortedSuffixes) {
      if (q.toLowerCase().endsWith(suffix.toLowerCase())) {
        q = q.slice(0, q.length - suffix.length).trim();
        changed = true;
        break;
      }
    }
  }

  return q.trim();
}

/**
 * Calculates human-readable Thai relative date (e.g., วันนี้, เมื่อวานนี้, 5 วันที่แล้ว)
 */
function getRelativeDateLabel(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  const target = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "วันนี้";
  if (diffDays === 1) return "เมื่อวานนี้";
  if (diffDays === 2) return "เมื่อ 2 วันที่แล้ว";
  if (diffDays > 2 && diffDays <= 30) return `เมื่อ ${diffDays} วันที่แล้ว`;
  if (diffDays > 30 && diffDays <= 60) return "ประมาณ 1 เดือนที่แล้ว";
  if (diffDays > 60) return `เมื่อประมาณ ${Math.round(diffDays / 30)} เดือนที่แล้ว`;
  return "";
}

/**
 * Formats YYYY-MM-DD into full Thai date
 */
function formatFullThaiDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${day} ${THAI_MONTH_NAMES[month]} ${year + 543}`;
}

/**
 * Parses user Thai query into intent, time filter, search keyword, and category filter
 * @param {string} userQuery
 * @returns {object}
 */
export function parseFinancialQuery(userQuery) {
  const q = userQuery.trim().toLowerCase();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const date = now.getDate();

  let timeFilter = null;
  let periodLabel = "ทั้งหมด";
  let targetCategory = null;
  let searchKeyword = null;
  let intent = "summary"; // 'item_search' | 'expense' | 'income' | 'balance' | 'category' | 'list' | 'greeting' | 'summary'

  // 1. Check for specific item / keyword query (e.g. "กินข้าวผัดเผ็ดล่าสุดวันไหน", "เปลี่ยนน้ำมันเครื่อง", "เติมเน็ต")
  const isItemQuery =
    q.includes("ล่าสุด") ||
    q.includes("เมื่อไหร่") ||
    q.includes("เมื่อไร") ||
    q.includes("วันไหน") ||
    q.includes("เคย") ||
    q.includes("กี่ครั้ง") ||
    q.includes("กี่รอบ");

  const extractedKeyword = extractSearchKeyword(userQuery);

  if (isItemQuery && extractedKeyword.length >= 2) {
    searchKeyword = extractedKeyword;
    intent = "item_search";
  }

  // 2. Check Category Keyword if not item search or as complementary
  for (const [catName, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => q.includes(kw))) {
      targetCategory = catName;
      if (intent !== "item_search") {
        intent = "category";
      }
      break;
    }
  }

  // 3. Check Greeting & Standard Intents
  if (
    q.includes("สวัสดี") ||
    q.includes("ทำอะไรได้บ้าง") ||
    q.includes("ช่วยอะไรได้") ||
    q.includes("ใคร") ||
    q.includes("hello") ||
    q.includes("hi")
  ) {
    intent = "greeting";
  } else if (intent !== "item_search" && intent !== "category") {
    if (
      q.includes("ใช้ไป") ||
      q.includes("จ่ายไป") ||
      q.includes("จ่าย") ||
      q.includes("รายจ่าย") ||
      q.includes("หมดไป") ||
      q.includes("ค่าใช้จ่าย")
    ) {
      intent = "expense";
    } else if (
      q.includes("ได้เงิน") ||
      q.includes("ได้มา") ||
      q.includes("รายรับ") ||
      q.includes("รายได้") ||
      q.includes("เงินเข้า")
    ) {
      intent = "income";
    } else if (
      q.includes("เหลือ") ||
      q.includes("คงเหลือ") ||
      q.includes("ยอดรวม") ||
      q.includes("สรุป") ||
      q.includes("ภาพรวม")
    ) {
      intent = "balance";
    } else if (
      q.includes("รายการ") ||
      q.includes("ล่าสุด") ||
      q.includes("ประวัติ") ||
      q.includes("อะไรบ้าง")
    ) {
      intent = "list";
    }
  }

  // 4. Temporal Entity / Time Window
  if (q.includes("วันนี้") || q.includes("today")) {
    const todayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    timeFilter = { dateStr: todayStr };
    periodLabel = `วันนี้ (${date} ${THAI_SHORT_MONTHS[month]} ${year + 543})`;
  } else if (q.includes("เมื่อวาน") || q.includes("วานนี้") || q.includes("yesterday")) {
    const yDate = new Date(year, month, date - 1);
    const yStr = `${yDate.getFullYear()}-${String(yDate.getMonth() + 1).padStart(2, "0")}-${String(yDate.getDate()).padStart(2, "0")}`;
    timeFilter = { dateStr: yStr };
    periodLabel = `เมื่อวานนี้ (${yDate.getDate()} ${THAI_SHORT_MONTHS[yDate.getMonth()]} ${yDate.getFullYear() + 543})`;
  } else if (q.includes("เดือนนี้") || q.includes("this month")) {
    const mStr = `${year}-${String(month + 1).padStart(2, "0")}`;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    timeFilter = {
      dateStr: {
        $gte: `${mStr}-01`,
        $lte: `${mStr}-${String(daysInMonth).padStart(2, "0")}`,
      },
    };
    periodLabel = `เดือนนี้ (${THAI_MONTH_NAMES[month]} ${year + 543})`;
  } else if (q.includes("เดือนที่แล้ว") || q.includes("เดือนก่อน") || q.includes("last month")) {
    const prevMonthDate = new Date(year, month - 1, 1);
    const pYear = prevMonthDate.getFullYear();
    const pMonth = prevMonthDate.getMonth();
    const pStr = `${pYear}-${String(pMonth + 1).padStart(2, "0")}`;
    const daysInMonth = new Date(pYear, pMonth + 1, 0).getDate();
    timeFilter = {
      dateStr: {
        $gte: `${pStr}-01`,
        $lte: `${pStr}-${String(daysInMonth).padStart(2, "0")}`,
      },
    };
    periodLabel = `เดือนที่แล้ว (${THAI_MONTH_NAMES[pMonth]} ${pYear + 543})`;
  } else if (q.includes("สัปดาห์นี้") || q.includes("อาทิตย์นี้") || q.includes("week")) {
    const weekStart = new Date(year, month, date - 6);
    const startStr = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
    const endStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    timeFilter = {
      dateStr: {
        $gte: startStr,
        $lte: endStr,
      },
    };
    periodLabel = "7 วันล่าสุด";
  } else if (q.includes("ปีนี้") || q.includes("this year")) {
    timeFilter = {
      dateStr: {
        $gte: `${year}-01-01`,
        $lte: `${year}-12-31`,
      },
    };
    periodLabel = `ปีนี้ (พ.ศ. ${year + 543})`;
  } else if (q.includes("ปีที่แล้ว") || q.includes("ปีก่อน") || q.includes("last year")) {
    const prevYear = year - 1;
    timeFilter = {
      dateStr: {
        $gte: `${prevYear}-01-01`,
        $lte: `${prevYear}-12-31`,
      },
    };
    periodLabel = `ปีที่แล้ว (พ.ศ. ${prevYear + 543})`;
  } else {
    if (intent === "item_search" || intent === "balance" || intent === "greeting") {
      timeFilter = {};
      periodLabel = "ภาพรวมทั้งหมด";
    } else {
      const mStr = `${year}-${String(month + 1).padStart(2, "0")}`;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      timeFilter = {
        dateStr: {
          $gte: `${mStr}-01`,
          $lte: `${mStr}-${String(daysInMonth).padStart(2, "0")}`,
        },
      };
      periodLabel = `เดือนนี้ (${THAI_MONTH_NAMES[month]} ${year + 543})`;
    }
  }

  return {
    intent,
    timeFilter,
    periodLabel,
    category: targetCategory,
    searchKeyword,
  };
}

/**
 * Formats data into a rich, natural Thai assistant response
 */
export function generateChatResponse(parsedQuery, transactions) {
  const { intent, periodLabel, category, searchKeyword } = parsedQuery;

  // 1. GREETING
  if (intent === "greeting") {
    return `สวัสดีครับ! ผมคือผู้ช่วยการเงินส่วนตัวของคุณ 🤖✨
คุณสามารถพิมพ์ถามข้อมูลได้เลยครับ เช่น:
• "ผมกินข้าวผัดล่าสุดวันไหน"
• "ผมเปลี่ยนน้ำมันเครื่องล่าสุดเมื่อไหร่"
• "ผมเติมเน็ตล่าสุดวันไหน"
• "เมื่อวานใช้ไปเท่าไร"
• "เดือนนี้ค่าอาหารเท่าไร"
• "ยอดเงินคงเหลือตอนนี้"`;
  }

  // 2. SPECIFIC ITEM / ACTIVITY SEARCH (e.g. ข้าวผัดเผ็ด, เปลี่ยนน้ำมันเครื่อง, เติมเน็ต)
  if (intent === "item_search" && searchKeyword) {
    if (transactions.length === 0) {
      return `🔍 **ไม่พบประวัติรายการ:**
ระบบไม่พบรายการที่เกี่ยวกับ **"${searchKeyword}"** ในประวัติการบันทึกครับ
💡 *แนะนำ: ลองค้นหาด้วยคำสั้นๆ หรือตรวจสอบว่าเคยบันทึกรายละเอียดไว้ในสลิปหรือไม่ครับ*`;
    }

    const latest = transactions[0]; // sorted newest first
    const relativeTime = getRelativeDateLabel(latest.dateStr);
    const fullDate = formatFullThaiDate(latest.dateStr);
    const timeDisplay = latest.timeStr ? ` เวลา ${latest.timeStr}` : "";
    const memoDisplay = latest.description ? `\n📝 รายละเอียด: *${latest.description}*` : "";

    const totalAmount = transactions.reduce((acc, t) => acc + t.amount, 0);
    const count = transactions.length;

    let historyText = "";
    if (count > 1) {
      historyText = `\n\n📊 **ประวัติทั้งหมด:** คุณเคยบันทึกเกี่ยวกับ "${searchKeyword}" ทั้งหมด **${count} ครั้ง** รวมเป็นเงิน **฿${totalAmount.toLocaleString()}**`;
      if (count > 2) {
        historyText += "\n" + transactions.slice(1, 4).map((t) => {
          return `• ฿${t.amount.toLocaleString()} - ${formatFullThaiDate(t.dateStr)}${t.description ? ` (${t.description})` : ""}`;
        }).join("\n");
      }
    }

    return `🗓️ **รายการล่าสุดเกี่ยวกับ "${searchKeyword}":**
📅 **${fullDate}** ${relativeTime ? `*(${relativeTime})*` : ""}${timeDisplay}
💰 ยอดเงิน: **฿${latest.amount.toLocaleString()}** (${latest.category})${memoDisplay}${historyText}`;
  }

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals = {};
  const matchingTx = [];

  transactions.forEach((tx) => {
    if (tx.type === "income") {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
    }

    if (!categoryTotals[tx.category]) {
      categoryTotals[tx.category] = { amount: 0, count: 0, type: tx.type };
    }
    categoryTotals[tx.category].amount += tx.amount;
    categoryTotals[tx.category].count += 1;

    if (!category || tx.category === category) {
      matchingTx.push(tx);
    }
  });

  const balance = totalIncome - totalExpense;

  // 3. SPECIFIC CATEGORY SUMMARY
  if (category) {
    const catData = categoryTotals[category] || { amount: 0, count: 0 };
    if (catData.count === 0) {
      return `📊 ในช่วง **${periodLabel}**
คุณยังไม่มีรายการบันทึกในหมวด **"${category}"** ครับ 👍`;
    }

    let breakdownText = "";
    if (matchingTx.length > 0) {
      const topItems = matchingTx.slice(0, 4);
      breakdownText = "\n\n**รายการล่าสุด:**\n" + topItems.map((tx) => {
        const memo = tx.description ? ` (${tx.description})` : "";
        return `• ฿${tx.amount.toLocaleString()} - ${formatFullThaiDate(tx.dateStr)}${memo}`;
      }).join("\n");
    }

    return `📊 ในช่วง **${periodLabel}**
คุณมียอดในหมวด **"${category}"** รวม **฿${catData.amount.toLocaleString()}** (ทั้งหมด ${catData.count} รายการ) ครับ${breakdownText}`;
  }

  // 4. EXPENSE SUMMARY
  if (intent === "expense") {
    if (totalExpense === 0) {
      return `🎉 ยอดเยี่ยมมากครับ! ในช่วง **${periodLabel}** คุณยังไม่มียอดรายจ่ายเลยครับ`;
    }

    const sortedCats = Object.entries(categoryTotals)
      .filter(([_, data]) => data.type === "expense")
      .sort((a, b) => b[1].amount - a[1].amount);

    let catDetails = "";
    if (sortedCats.length > 0) {
      catDetails = "\n\n**หมวดหมู่ที่มีการใช้จ่ายสูงสุด:**\n" + sortedCats.slice(0, 3).map(([name, data]) => {
        return `• ${name}: ฿${data.amount.toLocaleString()} (${data.count} รายการ)`;
      }).join("\n");
    }

    return `💸 ในช่วง **${periodLabel}**
คุณมียอดรายจ่ายรวม **฿${totalExpense.toLocaleString()}** (${transactions.filter(t => t.type === "expense").length} รายการ) ครับ${catDetails}`;
  }

  // 5. INCOME SUMMARY
  if (intent === "income") {
    if (totalIncome === 0) {
      return `ℹ️ ในช่วง **${periodLabel}** ยังไม่มียอดบันทึกรายรับเข้ามาครับ`;
    }

    return `💰 ในช่วง **${periodLabel}**
คุณมียอดรายรับรวม **฿${totalIncome.toLocaleString()}** (${transactions.filter(t => t.type === "income").length} รายการ) ครับ ✨`;
  }

  // 6. BALANCE / OVERALL SUMMARY
  if (intent === "balance" || intent === "summary") {
    const netEmoji = balance >= 0 ? "📈" : "📉";
    const balanceSign = balance >= 0 ? "+" : "";

    return `💼 **สรุปการเงิน (${periodLabel})**
• รายรับรวม: **+฿${totalIncome.toLocaleString()}**
• รายจ่ายรวม: **-฿${totalExpense.toLocaleString()}**
• ยอดคงเหลือสุทธิ: **${netEmoji} ${balanceSign}฿${balance.toLocaleString()}**

(บันทึกทั้งหมด ${transactions.length} รายการ)`;
  }

  // 7. TRANSACTION LIST
  if (intent === "list") {
    if (transactions.length === 0) {
      return `📭 ในช่วง **${periodLabel}** ยังไม่มีประวัติรายการบันทึกครับ`;
    }

    const recent = transactions.slice(0, 5);
    const listStr = recent.map((tx) => {
      const sign = tx.type === "income" ? "+" : "-";
      const memo = tx.description ? ` (${tx.description})` : "";
      return `• [${tx.category}] ${sign}฿${tx.amount.toLocaleString()} - ${formatFullThaiDate(tx.dateStr)}${memo}`;
    }).join("\n");

    return `📋 **รายการบันทึกล่าสุด (${periodLabel}):**
${listStr}

*(แสดง ${recent.length} จากทั้งหมด ${transactions.length} รายการ)*`;
  }

  return `📊 สรุปข้อมูลสำหรับ **${periodLabel}**
รายรับ ฿${totalIncome.toLocaleString()} | รายจ่าย ฿${totalExpense.toLocaleString()} (คงเหลือ ฿${balance.toLocaleString()})`;
}
