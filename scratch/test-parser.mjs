// Thai month mapping with normalization
const MONTH_MAP = {
  // Short with dots or no dots
  "มค": "01", "ม.ค": "01", "ม.ค.": "01", "มกราคม": "01", "jan": "01",
  "กพ": "02", "ก.พ": "02", "ก.พ.": "02", "กุมภาพันธ์": "02", "feb": "02",
  "มีค": "03", "มี.ค": "03", "มี.ค.": "03", "มีนาคม": "03", "mar": "03",
  "เมย": "04", "เม.ย": "04", "เม.ย.": "04", "เมษายน": "04", "apr": "04",
  "พค": "05", "พ.ค": "05", "พ.ค.": "05", "พฤษภาคม": "05", "may": "05",
  "มิย": "06", "มิ.ย": "06", "มิ.ย.": "06", "มิถุนายน": "06", "jun": "06",
  "กค": "07", "ก.ค": "07", "ก.ค.": "07", "กรกฎาคม": "07", "jul": "07",
  "สค": "08", "ส.ค": "08", "ส.ค.": "08", "สิงหาคม": "08", "aug": "08",
  "กย": "09", "ก.ย": "09", "ก.ย.": "09", "กันยายน": "09", "sep": "09",
  "ตค": "10", "ต.ค": "10", "ต.ค.": "10", "ตุลาคม": "10", "oct": "10",
  "พย": "11", "พ.ย": "11", "พ.ย.": "11", "พฤศจิกายน": "11", "nov": "11",
  "ธค": "12", "ธ.ค": "12", "ธ.ค.": "12", "ธันวาคม": "12", "dec": "12",
};

export function normalizeThaiText(text) {
  if (!text) return "";
  return text
    .replace(/\u0e4d\u0e32/g, "\u0e33") // Sara Am normalization
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Zero-width spaces
    .replace(/\r\n/g, "\n");
}

export function parseSlipTextEnhanced(rawText) {
  const cleanText = normalizeThaiText(rawText);
  const lines = cleanText.split("\n").map((l) => l.trim()).filter(Boolean);

  let amount = null;
  let dateStr = "";
  let timeStr = "";
  let memo = "";

  // 1. AMOUNT EXTRACTION
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("จำนวนเงิน") || line.includes("ยอดเงิน") || line.includes("Amount")) {
      const matchInLine = line.match(/([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))/);
      if (matchInLine) {
        amount = parseFloat(matchInLine[1].replace(/,/g, ""));
        break;
      } else if (i + 1 < lines.length) {
        const matchNext = lines[i + 1].match(/([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))/);
        if (matchNext) {
          amount = parseFloat(matchNext[1].replace(/,/g, ""));
          break;
        }
      }
    }
  }

  if (amount === null) {
    const bahtMatch = cleanText.match(/([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))\s*(?:บาท|THB|บ\.)/i);
    if (bahtMatch) {
      amount = parseFloat(bahtMatch[1].replace(/,/g, ""));
    }
  }

  if (amount === null) {
    const allAmounts = [...cleanText.matchAll(/([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))/g)]
      .map((m) => parseFloat(m[1].replace(/,/g, "")))
      .filter((val) => val > 0);
    if (allAmounts.length > 0) {
      amount = allAmounts[0];
    }
  }

  // 2. DATE & TIME EXTRACTION
  const monthNamesRegex = "ม\\.?\\s*ค\\.?|ก\\.?\\s*พ\\.?|มี\\.?\\s*ค\\.?|เม\\.?\\s*ย\\.?|พ\\.?\\s*ค\\.?|มิ\\.?\\s*ย\\.?|ก\\.?\\s*ค\\.?|ส\\.?\\s*ค\\.?|ก\\.?\\s*ย\\.?|ต\\.?\\s*ค\\.?|พ\\.?\\s*ย\\.?|ธ\\.?\\s*ค\\.?|มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec";
  const thaiDatePattern = new RegExp(`(\\d{1,2})\\s*(${monthNamesRegex})\\s*(\\d{2,4})`, "i");

  // Check line by line for date + time combo
  for (const line of lines) {
    const dMatch = line.match(thaiDatePattern);
    if (dMatch) {
      const day = String(parseInt(dMatch[1], 10)).padStart(2, "0");
      const normalizedMonth = dMatch[2].replace(/\s+/g, "").toLowerCase();
      const month = MONTH_MAP[normalizedMonth] || MONTH_MAP[normalizedMonth.replace(/\./g, "")] || "01";
      let rawYear = parseInt(dMatch[3], 10);
      if (rawYear < 100) rawYear += 2500;
      let year = rawYear;
      if (year > 2400) year -= 543;

      dateStr = `${year}-${month}-${day}`;

      // Check if time is in this same line!
      const timeInSameLine = line.match(/(?:[-–~—\s,]|^)\s*([01]?[0-9]|2[0-3])[:.]([0-5][0-9])(?::[0-5][0-9])?(?:\s*น\.?)?/);
      if (timeInSameLine) {
        const hour = String(parseInt(timeInSameLine[1], 10)).padStart(2, "0");
        const min = String(parseInt(timeInSameLine[2], 10)).padStart(2, "0");
        timeStr = `${hour}:${min}`;
      }
      break;
    }
  }

  // If date not found by line, try full text search
  if (!dateStr) {
    const dMatch = cleanText.match(thaiDatePattern);
    if (dMatch) {
      const day = String(parseInt(dMatch[1], 10)).padStart(2, "0");
      const normalizedMonth = dMatch[2].replace(/\s+/g, "").toLowerCase();
      const month = MONTH_MAP[normalizedMonth] || MONTH_MAP[normalizedMonth.replace(/\./g, "")] || "01";
      let rawYear = parseInt(dMatch[3], 10);
      if (rawYear < 100) rawYear += 2500;
      let year = rawYear;
      if (year > 2400) year -= 543;
      dateStr = `${year}-${month}-${day}`;
    } else {
      const standardDateMatch = cleanText.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
      if (standardDateMatch) {
        const p1 = parseInt(standardDateMatch[1], 10);
        const p2 = parseInt(standardDateMatch[2], 10);
        let year = parseInt(standardDateMatch[3], 10);
        if (year < 100) year += 2500;
        if (year > 2400) year -= 543;
        dateStr = `${year}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
      }
    }
  }

  // 3. TIME EXTRACTION (if not found on the date line)
  if (!timeStr) {
    // Look for explicit time patterns e.g. "เวลา 18:44", "18:44 น.", or strict HH:MM with colons
    // Notice: we strictly require ':' unless preceded by 'เวลา' or followed by 'น.' to avoid matching numbers like '0.57' or '0.00'
    const strictColonTime = cleanText.match(/(?:เวลา\s*[:\s]*)?([01]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?(?:\s*น\.?)?/);
    if (strictColonTime) {
      const hour = String(parseInt(strictColonTime[1], 10)).padStart(2, "0");
      const min = String(parseInt(strictColonTime[2], 10)).padStart(2, "0");
      timeStr = `${hour}:${min}`;
    } else {
      // Look for "18.44 น." or "เวลา 18.44"
      const dotTimeWithThaiUnit = cleanText.match(/(?:เวลา\s*[:\s]*)?([01]?[0-9]|2[0-3])\.([0-5][0-9])\s*น\./);
      if (dotTimeWithThaiUnit) {
        const hour = String(parseInt(dotTimeWithThaiUnit[1], 10)).padStart(2, "0");
        const min = String(parseInt(dotTimeWithThaiUnit[2], 10)).padStart(2, "0");
        timeStr = `${hour}:${min}`;
      }
    }
  }

  // Fallbacks if date or time completely missing
  if (!dateStr) {
    const today = new Date();
    dateStr = today.toLocaleDateString("sv-SE");
  }
  if (!timeStr) {
    const today = new Date();
    timeStr = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
  }

  // 4. MEMO / NOTE EXTRACTION
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("บันทึกช่วยจำ") || line.includes("บันทึก") || line.includes("Memo") || line.includes("Note")) {
      const memoText = line
        .replace(/.*(?:บันทึกช่วยจำ|บันทึกช่วยจํา|บันทึก|Memo|Note)[:\s-]*/i, "")
        .trim();
      if (memoText && memoText.length > 0) {
        memo = memoText;
        break;
      } else if (i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        if (nextLine && !nextLine.includes("รหัส") && !nextLine.includes("จำนวนเงิน") && !nextLine.includes("บาท")) {
          memo = nextLine;
          break;
        }
      }
    }
  }

  return {
    amount: amount !== null ? amount : "",
    dateStr,
    timeStr,
    memo,
    rawText: cleanText,
  };
}

const rawText = `
โอนเงินสําเร็จ
รหัสอ้างอิง
N006781267486027846397014
อับดุลรอฮีม จ” * *
กรุงไทย
XXX-X-XX528-6
นาย อับดุลรอฮีม
กรุงไทย
XXX-X-XX157-0
จํานวนเงิน 0.57 บาท
ค่าธรรมเนียม 0.00 บาท
วันที่ทํารายการ 30 ส.ค. 2569 - 18:44
บันทึกช่วยจํา เทส
`;

console.log("TEST RESULT:", JSON.stringify(parseSlipTextEnhanced(rawText), null, 2));
