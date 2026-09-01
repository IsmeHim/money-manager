const STOP_PREFIXES = [
  "ผมกิน", "ฉันกิน", "กิน", "ไปกิน",
  "ผมซื้อ", "ฉันซื้อ", "ซื้อ", "ไปซื้อ",
  "ผมจ่าย", "ฉันจ่าย", "จ่ายค่า", "จ่าย",
  "ผมเปลี่ยน", "ฉันเปลี่ยน", "เปลี่ยน",
  "ผมเติม", "ฉันเติม", "เติม",
  "ผมโอน", "ฉันโอน", "โอน",
  "ผมสั่ง", "ฉันสั่ง", "สั่ง",
  "ผมทำ", "ฉันทำ", "ทำ",
  "ผมไป", "ฉันไป", "ไป",
  "ช่วยหา", "เช็ค", "ดูให้หน่อย", "หา", "เช็คให้หน่อย",
  "เคย", "ผมเคย", "ฉันเคย"
];

const STOP_SUFFIXES = [
  "ล่าสุดวันไหน", "ล่าสุดเมื่อไหร่", "ล่าสุดเมื่อไร", "ครั้งล่าสุดวันไหน", "ครั้งล่าสุดเมื่อไหร่",
  "ล่าสุด", "ครั้งล่าสุด",
  "วันไหน", "เมื่อไหร่", "เมื่อไร",
  "ไปกี่บาท", "กี่บาท", "เท่าไร", "เท่าไหร่", "ไปเท่าไร", "ไปเท่าไหร่",
  "กี่ครั้งแล้ว", "กี่ครั้ง", "ไปกี่ครั้ง",
  "วันไหนบ้าง", "เมื่อไหร่บ้าง",
  "เคยไหม", "เคยรึยัง", "เคยหรือยัง",
  "บ้าง", "หรือยัง", "รึยัง", "ครับ", "ค่ะ", "นะ", "หน่อย"
];

function extractItemEntity(query) {
  let q = query.trim();

  // Strip prefixes (longest first)
  const sortedPrefixes = [...STOP_PREFIXES].sort((a, b) => b.length - a.length);
  for (const prefix of sortedPrefixes) {
    if (q.toLowerCase().startsWith(prefix.toLowerCase())) {
      q = q.slice(prefix.length).trim();
      break;
    }
  }

  // Strip suffixes (longest first)
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

const tests = [
  "ผมกิน ข้าวผัดเผ็ด ล่าสุดวันไหน",
  "ผมเปลี่ยนน้ำมันเครื่องล่าสุดวันไหน",
  "ผมเติมเน็ตล่าสุดวันไหน",
  "กิน ชาบู ล่าสุดเมื่อไหร่ครับ",
  "เคยซื้อ รองเท้า ไปกี่บาท",
  "จ่ายค่าไฟล่าสุดวันไหน"
];

for (const t of tests) {
  console.log(`Original: "${t}" ➔ Extracted Item: "${extractItemEntity(t)}"`);
}
