const THAI_MONTH_DICT = {
  "มกรา": "01", "มกราคม": "01", "ม.ค.": "01", "ม.ค": "01", "มค": "01",
  "กุมภา": "02", "กุมภาพันธ์": "02", "ก.พ.": "02", "ก.พ": "02", "กพ": "02",
  "มีนา": "03", "มีนาคม": "03", "มี.ค.": "03", "มี.ค": "03", "มีค": "03",
  "เมษา": "04", "เมษายน": "04", "เม.ย.": "04", "เม.ย": "04", "เมย": "04",
  "พฤษภา": "05", "พฤษภาคม": "05", "พ.ค.": "05", "พ.ค": "05", "พค": "05",
  "มิถุนา": "06", "มิถุนายน": "06", "มิ.ย.": "06", "มิ.ย": "06", "มิย": "06",
  "กรกฎา": "07", "กรกฎาคม": "07", "ก.ค.": "07", "ก.ค": "07", "กค": "07",
  "สิงหา": "08", "สิงหาคม": "08", "ส.ค.": "08", "ส.ค": "08", "สค": "08",
  "กันยา": "09", "กันยายน": "09", "ก.ย.": "09", "ก.ย": "09", "กย": "09",
  "ตุลา": "10", "ตุลาคม": "10", "ต.ค.": "10", "ต.ค": "10", "ตค": "10",
  "พฤศจิกา": "11", "พฤศจิกายน": "11", "พ.ย.": "11", "พ.ย": "11", "พย": "11",
  "ธันวา": "12", "ธันวาคม": "12", "ธ.ค.": "12", "ธ.ค": "12", "ธค": "12",
};

const THAI_MONTH_NAMES = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

function extractSpecificDate(text, now = new Date()) {
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  // Pattern: "วันที่ 28 สิงหา", "28 สิงหาคม 2569", "วันที่ 28 ส.ค.", "วันที่ 28"
  const monthNamesPattern = Object.keys(THAI_MONTH_DICT).join("|");
  const specificDateRegex = new RegExp(
    `(?:วันที่\\s*)?(\\d{1,2})\\s*(?:(?:เดือน\\s*)?(${monthNamesPattern}))?\\s*(\\d{2,4})?`,
    "i"
  );

  // Look for date in the text
  const match = text.match(specificDateRegex);
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
      return { dateStr, periodLabel };
    }
  }
  return null;
}

const testQueries = [
  "วันที่ 28 สิงหา ผมใช้ไปเท่าไร",
  "28 สิงหาคม ใช้ไปกี่บาท",
  "วันที่ 1 ก.ย. มีรายจ่ายอะไรบ้าง",
  "วันที่ 27 ได้เงินเท่าไร",
  "29 ส.ค. 2569 ใช้เงินไปเท่าไร"
];

for (const q of testQueries) {
  const res = extractSpecificDate(q, new Date(2026, 8, 1));
  console.log(`Query: "${q}" ➔ Result:`, res);
}
