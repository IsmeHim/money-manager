import { createWorker } from "tesseract.js";
import { normalizeThaiText, extractDateAndTime } from "./slipDateTime";

export { normalizeThaiText };

/**
 * Preprocess image via HTML Canvas to enhance OCR readability
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

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        const contrast = 35;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
          let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          gray = factor * (gray - 128) + 128;

          if (gray > 200) {
            gray = 255;
          } else {
            gray = Math.max(0, Math.min(255, gray));
          }

          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
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
 */
export function parseSlipText(text) {
  const cleanText = normalizeThaiText(text);
  const lines = cleanText.split("\n").map((l) => l.trim()).filter(Boolean);

  let amount = null;
  let memo = "";

  // 1. AMOUNT EXTRACTION
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("จำนวนเงิน") || line.includes("ยอดเงิน") || line.includes("Amount") || line.includes("จำนวน:")) {
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

  // 2. MULTI-BANK UNIVERSAL DATE & TIME EXTRACTION
  const { detectedDate, detectedTime } = extractDateAndTime(lines);

  let dateStr = detectedDate;
  let timeStr = detectedTime;

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

/**
 * Batch Slip Scanning Pipeline
 */
export async function scanMultipleBankSlips(imageFiles, onProgress = () => {}) {
  if (!imageFiles || imageFiles.length === 0) {
    return { success: false, error: "ไม่มีไฟล์รูปภาพที่ถูกเลือก", results: [] };
  }

  if (imageFiles.length === 1) {
    const single = await scanBankSlip(imageFiles[0], onProgress);
    return {
      success: single.success,
      results: single.success ? [{ ...single, id: "slip-1" }] : [],
      error: single.error,
    };
  }

  let worker = null;
  const results = [];
  const total = imageFiles.length;

  try {
    onProgress(5, "กำลังเริ่มตัวอ่านภาษาไทย (OCR Engine)...", 0, total);
    worker = await createWorker(["tha", "eng"]);

    for (let i = 0; i < total; i++) {
      const file = imageFiles[i];
      const startPercent = Math.round((i / total) * 90) + 5;
      const fileDisplayName = file.name || `สลิปที่ ${i + 1}`;

      onProgress(
        startPercent,
        `กำลังวิเคราะห์สลิปที่ ${i + 1} จาก ${total} ใบ...`,
        i + 1,
        total
      );

      try {
        const preprocessedImg = await preprocessImage(file);
        const ret = await worker.recognize(preprocessedImg);
        const parsedData = parseSlipText(ret.data.text);

        results.push({
          id: `slip-${i + 1}-${Date.now()}`,
          fileName: fileDisplayName,
          success: true,
          ...parsedData,
        });
      } catch (fileErr) {
        console.warn(`Error scanning slip #${i + 1}:`, fileErr);
        results.push({
          id: `slip-${i + 1}-${Date.now()}`,
          fileName: fileDisplayName,
          success: false,
          error: fileErr.message || "อ่านสลิปใบนี้ไม่สำเร็จ",
          amount: 0,
          dateStr: new Date().toLocaleDateString("sv-SE"),
          timeStr: "00:00",
          memo: "",
        });
      }
    }

    onProgress(100, "ประมวลผลเสร็จสิ้นทุกรายการ!", total, total);
    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error("Batch slip scanning error:", error);
    return {
      success: false,
      error: error.message || "เกิดข้อผิดพลาดในการประมวลผลสลิป",
      results,
    };
  } finally {
    if (worker) {
      await worker.terminate();
    }
  }
}
