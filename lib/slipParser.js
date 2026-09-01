import { createWorker } from "tesseract.js";

// Mapping of Thai month names (short and full, with and without dots) to month numbers (01-12)
const THAI_MONTH_MAP = {
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

/**
 * Normalizes Thai Unicode variations (e.g. Nikhahit + Sara Aa vs Sara Am)
 */
export function normalizeThaiText(text) {
  if (!text) return "";
  return text
    .replace(/\u0e4d\u0e32/g, "\u0e33") // Sara Am normalization
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Zero-width spaces
    .replace(/\r\n/g, "\n");
}

/**
 * Preprocess image via HTML Canvas to enhance OCR readability:
 * - Upscales low-res text for higher OCR accuracy
 * - Converts to Grayscale
 * - Applies contrast thresholding to eliminate background watermarks/patterns
 * @param {File | Blob | string} imageSource
 * @returns {Promise<string>} Base64 preprocessed image or original image data URL
 */
export async function preprocessImage(imageSource) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(img.src);
          return;
        }

        let width = img.width;
        let height = img.height;

        // Upscale if small image so small text/digits (like time) become crisp
        if (width < 900) {
          const scale = 900 / width;
          width = 900;
          height = Math.round(height * scale);
        } else if (width > 1800) {
          const scale = 1800 / width;
          width = 1800;
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image with smooth filtering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Get image pixel data
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Contrast enhancement
        const contrast = 35;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
          // Standard human perception luminance formula
          let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

          // Apply contrast stretch
          gray = factor * (gray - 128) + 128;

          // Light background whitening threshold (removes bank watermarks/clouds)
          if (gray > 200) {
            gray = 255;
          } else {
            gray = Math.max(0, Math.min(255, gray));
          }

          data[i] = gray;     // R
          data[i + 1] = gray; // G
          data[i + 2] = gray; // B
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        console.warn("Image preprocessing fallback", err);
        resolve(img.src);
      }
    };

    img.onerror = () => {
      if (typeof imageSource === "string") resolve(imageSource);
    };

    if (imageSource instanceof Blob) {
      img.src = URL.createObjectURL(imageSource);
    } else if (typeof imageSource === "string") {
      img.src = imageSource;
    }
  });
}

/**
 * Robust Thai Bank Slip Parser with Multi-pass Regex
 * @param {string} text
 * @returns {object} Extracted information { amount, dateStr, timeStr, memo, rawText }
 */
export function parseSlipText(text) {
  const cleanText = normalizeThaiText(text);
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

  // Fallback: look for currency with Thai baht suffix
  if (amount === null) {
    const bahtMatch = cleanText.match(/([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))\s*(?:บาท|THB|บ\.)/i);
    if (bahtMatch) {
      amount = parseFloat(bahtMatch[1].replace(/,/g, ""));
    }
  }

  // Fallback: any float > 0
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

  // Step A: Search for Date line and extract Date + Time combo together
  for (const line of lines) {
    const dMatch = line.match(thaiDatePattern);
    if (dMatch) {
      const day = String(parseInt(dMatch[1], 10)).padStart(2, "0");
      const normalizedMonth = dMatch[2].replace(/\s+/g, "").toLowerCase();
      const month = THAI_MONTH_MAP[normalizedMonth] || THAI_MONTH_MAP[normalizedMonth.replace(/\./g, "")] || "01";
      let rawYear = parseInt(dMatch[3], 10);
      if (rawYear < 100) rawYear += 2500;
      let year = rawYear;
      if (year > 2400) year -= 543;

      dateStr = `${year}-${month}-${day}`;

      // Check for time on the same line (e.g. "30 ส.ค. 2569 - 18:44" or "30 ส.ค. 2569 18:44 น.")
      const timeInSameLine = line.match(/(?:[-–~—\s,]|^)\s*([01]?[0-9]|2[0-3])[:.]([0-5][0-9])(?::[0-5][0-9])?(?:\s*น\.?)?/);
      if (timeInSameLine) {
        const hour = String(parseInt(timeInSameLine[1], 10)).padStart(2, "0");
        const min = String(parseInt(timeInSameLine[2], 10)).padStart(2, "0");
        timeStr = `${hour}:${min}`;
      }
      break;
    }
  }

  // Step B: Fallback search for date anywhere in text
  if (!dateStr) {
    const dMatch = cleanText.match(thaiDatePattern);
    if (dMatch) {
      const day = String(parseInt(dMatch[1], 10)).padStart(2, "0");
      const normalizedMonth = dMatch[2].replace(/\s+/g, "").toLowerCase();
      const month = THAI_MONTH_MAP[normalizedMonth] || THAI_MONTH_MAP[normalizedMonth.replace(/\./g, "")] || "01";
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

  // Step C: If time wasn't found on the date line, search strictly with colon or Thai time indicators
  if (!timeStr) {
    // 1) Search for strict "HH:MM" (e.g. 18:44, 08:30) - Must use colon to prevent matching 0.57
    const colonTimeMatch = cleanText.match(/(?:เวลา\s*[:\s]*)?([01]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?(?:\s*น\.?)?/);
    if (colonTimeMatch) {
      const hour = String(parseInt(colonTimeMatch[1], 10)).padStart(2, "0");
      const min = String(parseInt(colonTimeMatch[2], 10)).padStart(2, "0");
      timeStr = `${hour}:${min}`;
    } else {
      // 2) Search for "18.44 น." or "เวลา 18.44"
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

  // 3. MEMO / NOTE EXTRACTION
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("บันทึกช่วยจำ") || line.includes("บันทึกช่วยจํา") || line.includes("บันทึก") || line.includes("Memo") || line.includes("Note")) {
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

/**
 * Full Slip Scanning Pipeline: Preprocess Image -> Run Tesseract OCR -> Parse Slip Data
 * @param {File | Blob | string} imageFile
 * @param {Function} onProgress (progressNumber 0-100, statusString)
 * @returns {Promise<object>} Parsed slip data
 */
export async function scanBankSlip(imageFile, onProgress = () => {}) {
  let worker = null;
  try {
    onProgress(10, "กำลังเตรียมรูปภาพและปรับความคมชัด...");
    const preprocessedImg = await preprocessImage(imageFile);

    onProgress(30, "กำลังเริ่มตัวอ่านภาษาไทย (OCR Engine)...");
    worker = await createWorker(["tha", "eng"]);

    onProgress(60, "กำลังวิเคราะห์ข้อความบนสลิป...");
    const ret = await worker.recognize(preprocessedImg);

    onProgress(90, "กำลังดึงยอดเงิน วันที่ และบันทึกช่วยจำ...");
    const parsedData = parseSlipText(ret.data.text);

    onProgress(100, "เสร็จสิ้น!");
    return {
      success: true,
      ...parsedData,
    };
  } catch (error) {
    console.error("Slip scanning error:", error);
    return {
      success: false,
      error: error.message || "ไม่สามารถอ่านข้อมูลจากสลิปได้",
    };
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}
