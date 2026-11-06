// Comprehensive Mapping of Thai, English, and OCR-distorted month names to month numbers (01-12)
export const THAI_MONTH_MAP = {
  // 01: มกราคม / ม.ค. (OCR can read ม as U/u, ค as A/a)
  "มกราคม": "01", "january": "01", "jan": "01",
  "ม.ค.": "01", "ม.ค": "01", "ม,ค,": "01", "ม,ค": "01", "ม ค": "01", "มค": "01",
  "u.a.": "01", "u.a": "01", "u a": "01", "ua": "01", "u.a,": "01",
  "u.ค.": "01", "u.ค": "01", "u ค": "01", "uค": "01",
  "ม.a.": "01", "ม.a": "01", "ม a": "01", "มa": "01",
  "u.d.": "01", "u.d": "01",

  // 02: กุมภาพันธ์ / ก.พ. (OCR can read ก as n, พ as w/W)
  "กุมภาพันธ์": "02", "february": "02", "feb": "02",
  "ก.พ.": "02", "ก.พ": "02", "ก,พ,": "02", "ก,พ": "02", "ก พ": "02", "กพ": "02",
  "ก.w.": "02", "ก.w": "02", "ก w": "02", "กw": "02", "ก.w,": "02",
  "n.w.": "02", "n.w": "02", "n w": "02", "nw": "02",
  "n.พ.": "02", "n.พ": "02",

  // 03: มีนาคม / มี.ค.
  "มีนาคม": "03", "march": "03", "mar": "03",
  "มี.ค.": "03", "มี.ค": "03", "มี,ค,": "03", "มี,ค": "03", "มี ค": "03", "มีค": "03",
  "มี.a.": "03", "มี.a": "03", "มี a": "03", "มีa": "03",
  "uี.a.": "03", "uี.a": "03", "มึ.ค.": "03", "มื.ค.": "03",

  // 04: เมษายน / เม.ย. (OCR can read เม as iu/lu, ย as u/y)
  "เมษายน": "04", "april": "04", "apr": "04",
  "เม.ย.": "04", "เม.ย": "04", "เม,ย,": "04", "เม,ย": "04", "เม ย": "04", "เมย": "04",
  "เม.u.": "04", "เม.u": "04", "เม.y.": "04", "เม.y": "04",
  "iu.ย.": "04", "iu.ย": "04", "iu.u.": "04", "iu.u": "04",

  // 05: พฤษภาคม / พ.ค. (OCR can read พ as w/W, ค as a/A)
  "พฤษภาคม": "05", "may": "05",
  "พ.ค.": "05", "พ.ค": "05", "พ,ค,": "05", "พ,ค": "05", "พ ค": "05", "พค": "05",
  "w.a.": "05", "w.a": "05", "w a": "05", "wa": "05",
  "w.ค.": "05", "w.ค": "05", "w ค": "05", "wค": "05",
  "พ.a.": "05", "พ.a": "05", "พ a": "05", "พa": "05",

  // 06: มิถุนายน / มิ.ย.
  "มิถุนายน": "06", "june": "06", "jun": "06",
  "มิ.ย.": "06", "มิ.ย": "06", "มิ,ย,": "06", "มิ,ย": "06", "มิ ย": "06", "มิย": "06",
  "มิ.u.": "06", "มิ.u": "06", "มิ.y.": "06", "มิ.y": "06",
  "uิ.u.": "06", "uิ.u": "06",

  // 07: กรกฎาคม / ก.ค.
  "กรกฎาคม": "07", "july": "07", "jul": "07",
  "ก.ค.": "07", "ก.ค": "07", "ก,ค,": "07", "ก,ค": "07", "ก ค": "07", "กค": "07",
  "ก.a.": "07", "ก.a": "07", "ก a": "07", "กa": "07",
  "n.a.": "07", "n.a": "07", "n a": "07", "na": "07",
  "n.ค.": "07", "n.ค": "07",

  // 08: สิงหาคม / ส.ค.
  "สิงหาคม": "08", "august": "08", "aug": "08",
  "ส.ค.": "08", "ส.ค": "08", "ส,ค,": "08", "ส,ค": "08", "ส ค": "08", "สค": "08",
  "ส.a.": "08", "ส.a": "08", "ส a": "08", "สa": "08",
  "a.a.": "08", "a.a": "08", "a a": "08", "a.ค.": "08", "a.ค": "08",

  // 09: กันยายน / ก.ย.
  "กันยายน": "09", "september": "09", "sep": "09",
  "ก.ย.": "09", "ก.ย": "09", "ก,ย,": "09", "ก,ย": "09", "ก ย": "09", "กย": "09",
  "ก.u.": "09", "ก.u": "09", "ก.y.": "09", "ก.y": "09",
  "n.u.": "09", "n.u": "09", "n.y.": "09", "n.y": "09",

  // 10: ตุลาคม / ต.ค.
  "ตุลาคม": "10", "october": "10", "oct": "10",
  "ต.ค.": "10", "ต.ค": "10", "ต,ค,": "10", "ต,ค": "10", "ต ค": "10", "ตค": "10",
  "ต.a.": "10", "ต.a": "10", "ต a": "10", "ตa": "10",
  "m.a.": "10", "m.a": "10", "m.ค.": "10", "m.ค": "10",

  // 11: พฤศจิกายน / พ.ย.
  "พฤศจิกายน": "11", "november": "11", "nov": "11",
  "พ.ย.": "11", "พ.ย": "11", "พ,ย,": "11", "พ,ย": "11", "พ ย": "11", "พย": "11",
  "พ.u.": "11", "พ.u": "11", "w.u.": "11", "w.u": "11",
  "พ.y.": "11", "พ.y": "11", "w.y.": "11", "w.y": "11",

  // 12: ธันวาคม / ธ.ค.
  "ธันวาคม": "12", "december": "12", "dec": "12",
  "ธ.ค.": "12", "ธ.ค": "12", "ธ,ค,": "12", "ธ,ค": "12", "ธ ค": "12", "ธค": "12",
  "ธ.a.": "12", "ธ.a": "12", "ธ a": "12", "ธa": "12",
};

const MONTH_NAMES_REGEX = Object.keys(THAI_MONTH_MAP)
  .sort((a, b) => b.length - a.length)
  .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

/**
 * Normalizes Thai Unicode variations and converts Thai numerals to Arabic numerals
 */
export function normalizeThaiText(text) {
  if (!text) return "";

  const thaiDigits = ["๐", "๑", "๒", "๓", "๔", "๕", "๖", "๗", "๘", "๙"];
  let cleaned = text;
  for (let i = 0; i < 10; i++) {
    cleaned = cleaned.replaceAll(thaiDigits[i], String(i));
  }

  return cleaned
    .replace(/\u0e4d\u0e32/g, "\u0e33") // Sara Am normalization
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Zero-width spaces
    .replace(/\r\n/g, "\n");
}

function normalizeYear(rawYear) {
  let y = parseInt(rawYear, 10);
  if (isNaN(y)) return new Date().getFullYear();

  if (y < 100) {
    if (y >= 50) {
      y += 2500;
    } else {
      y += 2000;
    }
  }

  if (y > 2400) {
    y -= 543;
  }

  return y;
}

function extractTimeCandidate(str) {
  if (!str) return null;

  const colonMatch = str.match(/(?:เวลา\s*[:\s]*)?\b([01]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?(?:\s*[นuU]\.?)?/);
  if (colonMatch) {
    const hh = String(parseInt(colonMatch[1], 10)).padStart(2, "0");
    const mm = String(parseInt(colonMatch[2], 10)).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  const dotTimeMatch = str.match(/(?:เวลา\s*[:\s]*)?\b([01]?[0-9]|2[0-3])\.([0-5][0-9])\s*[นuU]\./);
  if (dotTimeMatch) {
    const hh = String(parseInt(dotTimeMatch[1], 10)).padStart(2, "0");
    const mm = String(parseInt(dotTimeMatch[2], 10)).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  const velaDotMatch = str.match(/เวลา\s*[:\s]*\b([01]?[0-9]|2[0-3])\.([0-5][0-9])/);
  if (velaDotMatch) {
    const hh = String(parseInt(velaDotMatch[1], 10)).padStart(2, "0");
    const mm = String(parseInt(velaDotMatch[2], 10)).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  return null;
}

/**
 * Universal Multi-Bank Slip Date & Time Parser
 */
export function extractDateAndTime(lines) {
  let detectedDate = "";
  let detectedTime = "";

  const namedDatePattern = new RegExp(`\\b(\\d{1,2})\\s*[-/]?\\s*(${MONTH_NAMES_REGEX})\\s*[-/]?\\s*(\\d{2,4})\\b`, "i");

  // Step 1: Scan lines for explicit Date keywords
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isDateHeader = /วันที่|ทำรายการ|date|trans/i.test(line);

    const textToCheck = isDateHeader && i + 1 < lines.length ? `${line} ${lines[i + 1]}` : line;
    const match = textToCheck.match(namedDatePattern);

    if (match) {
      const day = String(parseInt(match[1], 10)).padStart(2, "0");
      const rawMonth = match[2].toLowerCase();
      const monthNum = THAI_MONTH_MAP[rawMonth] || THAI_MONTH_MAP[rawMonth.replace(/[\s.,]/g, "")] || "01";
      const year = normalizeYear(match[3]);

      detectedDate = `${year}-${monthNum}-${day}`;

      const timeFound = extractTimeCandidate(textToCheck);
      if (timeFound) {
        detectedTime = timeFound;
      }
      break;
    }
  }

  // Step 2: Search named date pattern in ANY line
  if (!detectedDate) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(namedDatePattern);
      if (match) {
        const day = String(parseInt(match[1], 10)).padStart(2, "0");
        const rawMonth = match[2].toLowerCase();
        const monthNum = THAI_MONTH_MAP[rawMonth] || THAI_MONTH_MAP[rawMonth.replace(/[\s.,]/g, "")] || "01";
        const year = normalizeYear(match[3]);

        detectedDate = `${year}-${monthNum}-${day}`;

        const timeFound = extractTimeCandidate(line) || (i + 1 < lines.length ? extractTimeCandidate(lines[i + 1]) : null);
        if (timeFound && !detectedTime) {
          detectedTime = timeFound;
        }
        break;
      }
    }
  }

  // Step 3: Numeric date patterns (DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY, YYYY-MM-DD)
  if (!detectedDate) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/xxx|บัญชี|รหัส|ref|acc|id/i.test(line)) continue;

      const numMatch = line.match(/\b([0-3]?[0-9])[\/\-.]([0-1]?[0-9])[\/\-.](\d{2,4})\b/);
      if (numMatch) {
        const p1 = parseInt(numMatch[1], 10);
        const p2 = parseInt(numMatch[2], 10);
        const p3 = parseInt(numMatch[3], 10);

        if (p1 >= 1 && p1 <= 31 && p2 >= 1 && p2 <= 12) {
          const day = String(p1).padStart(2, "0");
          const month = String(p2).padStart(2, "0");
          const year = normalizeYear(p3);
          detectedDate = `${year}-${month}-${day}`;

          const timeFound = extractTimeCandidate(line);
          if (timeFound && !detectedTime) {
            detectedTime = timeFound;
          }
          break;
        }
      }

      const isoMatch = line.match(/\b(\d{4})[\/\-.]([0-1]?[0-9])[\/\-.]([0-3]?[0-9])\b/);
      if (isoMatch) {
        const yRaw = parseInt(isoMatch[1], 10);
        const mRaw = parseInt(isoMatch[2], 10);
        const dRaw = parseInt(isoMatch[3], 10);
        if (mRaw >= 1 && mRaw <= 12 && dRaw >= 1 && dRaw <= 31) {
          const year = normalizeYear(yRaw);
          const month = String(mRaw).padStart(2, "0");
          const day = String(dRaw).padStart(2, "0");
          detectedDate = `${year}-${month}-${day}`;

          const timeFound = extractTimeCandidate(line);
          if (timeFound && !detectedTime) {
            detectedTime = timeFound;
          }
          break;
        }
      }
    }
  }

  // Step 4: Standalone Time Extraction
  if (!detectedTime) {
    for (const line of lines) {
      if (/เวลา|time/i.test(line)) {
        const t = extractTimeCandidate(line);
        if (t) {
          detectedTime = t;
          break;
        }
      }
    }

    if (!detectedTime) {
      for (const line of lines) {
        const t = extractTimeCandidate(line);
        if (t) {
          detectedTime = t;
          break;
        }
      }
    }
  }

  return { detectedDate, detectedTime };
}
