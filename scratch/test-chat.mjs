import { parseFinancialQuery, generateChatResponse } from "../lib/chatEngine.js";

const sampleTransactions = [
  {
    type: "expense",
    amount: 0.57,
    category: "อาหาร",
    description: "เทส",
    dateStr: "2026-08-30",
    timeStr: "18:44",
  },
  {
    type: "income",
    amount: 50000,
    category: "เงินเดือน",
    description: "เงินเดือนประจำเดือน",
    dateStr: "2026-08-01",
    timeStr: "09:00",
  },
  {
    type: "expense",
    amount: 350,
    category: "เดินทาง",
    description: "ค่าน้ำมัน",
    dateStr: "2026-08-25",
    timeStr: "14:30",
  }
];

const testQueries = [
  "เมื่อวานผมใช้ไปเท่าไร",
  "เดือนนี้ค่าอาหารเท่าไร",
  "ยอดเงินคงเหลือตอนนี้มีเท่าไร",
  "สัปดาห์นี้ใช้อะไรไปบ้าง",
  "สวัสดีครับ"
];

for (const q of testQueries) {
  console.log("-----------------------------------------");
  console.log("USER:", q);
  const parsed = parseFinancialQuery(q);
  console.log("PARSED:", parsed);
  const response = generateChatResponse(parsed, sampleTransactions);
  console.log("BOT:\n", response);
}
