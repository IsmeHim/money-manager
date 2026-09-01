import { parseFinancialQuery, generateChatResponse } from "../lib/chatEngine.js";

const sampleTransactions = [
  {
    type: "expense",
    amount: 50,
    category: "อาหาร",
    description: "ข้าวผัดเผ็ดหมูกรอบ",
    dateStr: "2026-08-30",
    timeStr: "12:30",
  },
  {
    type: "expense",
    amount: 1200,
    category: "เดินทาง",
    description: "เปลี่ยนน้ำมันเครื่องสังเคราะห์แท้",
    dateStr: "2026-08-15",
    timeStr: "10:00",
  },
  {
    type: "expense",
    amount: 299,
    category: "ค่าบ้าน/บิล",
    description: "เติมเน็ต AIS รายเดือน 30 วัน",
    dateStr: "2026-08-01",
    timeStr: "08:15",
  },
  {
    type: "expense",
    amount: 55,
    category: "อาหาร",
    description: "ข้าวผัดเผ็ดไก่",
    dateStr: "2026-08-20",
    timeStr: "18:45",
  }
];

const testQueries = [
  "ผมกิน ข้าวผัดเผ็ด ล่าสุดวันไหน",
  "ผมเปลี่ยนน้ำมันเครื่องล่าสุดวันไหน",
  "ผมเติมเน็ตล่าสุดวันไหน",
  "เคยเปลี่ยนน้ำมันเครื่องไปกี่บาท",
  "กินข้าวผัดเผ็ดไปกี่ครั้งแล้ว",
  "ตัดผม ล่าสุดเมื่อไหร่"
];

for (const q of testQueries) {
  console.log("=========================================");
  console.log("USER:", q);
  const parsed = parseFinancialQuery(q);
  console.log("PARSED:", parsed);
  // Simulate filtering by item or description
  let filtered = sampleTransactions;
  if (parsed.searchKeyword) {
    const kw = parsed.searchKeyword.toLowerCase();
    filtered = sampleTransactions.filter(
      (tx) => (tx.description && tx.description.toLowerCase().includes(kw)) ||
              (tx.category && tx.category.toLowerCase().includes(kw))
    );
  }
  const response = generateChatResponse(parsed, filtered);
  console.log("BOT:\n" + response);
}
