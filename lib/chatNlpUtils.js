// Thai Month definitions
export const THAI_MONTH_NAMES = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export const THAI_SHORT_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

export const THAI_MONTH_DICT = {
  "มกรา": "01", "มกราคม": "01", "ม.ค.": "01", "ม.ค": "01", "มค": "01", "jan": "01",
  "กุมภา": "02", "กุมภาพันธ์": "02", "ก.พ.": "02", "ก.พ": "02", "กพ": "02", "feb": "02",
  "มีนา": "03", "มีนาคม": "03", "มี.ค.": "03", "มี.ค": "03", "มีค": "03", "mar": "03",
  "เมษา": "04", "เมษายน": "04", "เม.ย.": "04", "เม.ย": "04", "เมย": "04", "apr": "04",
  "พฤษภา": "05", "พฤษภาคม": "05", "พ.ค.": "05", "พ.ค": "05", "พค": "05", "may": "05",
  "มิถุนา": "06", "มิถุนายน": "06", "มิ.ย.": "06", "มิ.ย": "06", "มิย": "06", "jun": "06",
  "กรกฎา": "07", "กรกฎาคม": "07", "ก.ค.": "07", "ก.ค": "07", "กค": "07", "jul": "07",
  "สิงหา": "08", "สิงหาคม": "08", "ส.ค.": "08", "ส.ค": "08", "สค": "08", "aug": "08",
  "กันยา": "09", "กันยายน": "09", "ก.ย.": "09", "ก.ย": "09", "กย": "09", "sep": "09",
  "ตุลา": "10", "ตุลาคม": "10", "ต.ค.": "10", "ต.ค": "10", "ตค": "10", "oct": "10",
  "พฤศจิกา": "11", "พฤศจิกายน": "11", "พ.ย.": "11", "พ.ย": "11", "พย": "11", "nov": "11",
  "ธันวา": "12", "ธันวาคม": "12", "ธ.ค.": "12", "ธ.ค": "12", "ธค": "12", "dec": "12",
};

export const CATEGORY_KEYWORDS = {
  "อาหาร": ["อาหาร", "ข้าว", "กิน", "กาแฟ", "ขนม", "บุฟเฟต์", "ชาบู", "ก๋วยเตี๋ยว", "เครื่องดื่ม", "ฟู้ด", "food", "ข้าวมันไก่", "ข้าวผัด"],
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
 */
export function extractSearchKeyword(query) {
  let q = query.trim();

  const sortedPrefixes = [...STOP_PREFIXES].sort((a, b) => b.length - a.length);
  for (const prefix of sortedPrefixes) {
    if (q.toLowerCase().startsWith(prefix.toLowerCase())) {
      q = q.slice(prefix.length).trim();
      break;
    }
  }

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
 * Parses specific calendar dates from Thai text (e.g. "วันที่ 28 สิงหา", "28 ส.ค. 2569", "เดือนสิงหาคม")
 */
export function extractSpecificDate(text, now = new Date()) {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthKeys = Object.keys(THAI_MONTH_DICT).sort((a, b) => b.length - a.length).join("|");

  // 1. Match Specific Day + Month + Year
  const specificDayRegex = new RegExp(
    `(?:วันที่\\s*)?(\\d{1,2})\\s*(?:(?:เดือน\\s*)?(${monthKeys}))?\\s*(\\d{2,4})?`,
    "i"
  );

  const match = text.match(specificDayRegex);
  if (match && match[1]) {
    const day = parseInt(match[1], 10);
    if (day >= 1 && day <= 31) {
      let monthStr = String(currentMonth + 1).padStart(2, "0");
      let monthIndex = currentMonth;
      if (match[2]) {
        const key = match[2].toLowerCase();
        if (THAI_MONTH_DICT[key]) {
          monthStr = THAI_MONTH_DICT[key];
          monthIndex = parseInt(monthStr, 10) - 1;
        }
      }

      let year = currentYear;
      if (match[3]) {
        let rawYear = parseInt(match[3], 10);
        if (rawYear < 100) rawYear += 2500;
        if (rawYear > 2400) rawYear -= 543;
        year = rawYear;
      }

      const dateStr = `${year}-${monthStr}-${String(day).padStart(2, "0")}`;
      const periodLabel = `วันที่ ${day} ${THAI_MONTH_NAMES[monthIndex]} ${year + 543}`;
      return {
        type: "day",
        timeFilter: { dateStr },
        periodLabel,
      };
    }
  }

  // 2. Match Whole Month
  const specificMonthRegex = new RegExp(`(?:เดือน\\s*)?(${monthKeys})\\s*(\\d{2,4})?`, "i");
  const monthMatch = text.match(specificMonthRegex);
  if (monthMatch && monthMatch[1]) {
    const key = monthMatch[1].toLowerCase();
    if (THAI_MONTH_DICT[key]) {
      const monthStr = THAI_MONTH_DICT[key];
      const monthIndex = parseInt(monthStr, 10) - 1;

      let year = currentYear;
      if (monthMatch[2]) {
        let rawYear = parseInt(monthMatch[2], 10);
        if (rawYear < 100) rawYear += 2500;
        if (rawYear > 2400) rawYear -= 543;
        year = rawYear;
      }

      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      return {
        type: "month",
        timeFilter: {
          dateStr: {
            $gte: `${year}-${monthStr}-01`,
            $lte: `${year}-${monthStr}-${String(daysInMonth).padStart(2, "0")}`,
          },
        },
        periodLabel: `เดือน${THAI_MONTH_NAMES[monthIndex]} ${year + 543}`,
      };
    }
  }

  return null;
}

/**
 * Calculates human-readable Thai relative date (e.g., วันนี้, เมื่อวานนี้, 5 วันที่แล้ว)
 */
export function getRelativeDateLabel(dateStr) {
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
export function formatFullThaiDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return `${day} ${THAI_MONTH_NAMES[month]} ${year + 543}`;
}
