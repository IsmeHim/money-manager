import { MongoClient } from "mongodb";
import { parseFinancialQuery, generateChatResponse } from "../lib/chatEngine.js";

// Let's test with the actual MongoDB data!
async function run() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const queries = [
    "ผมกินข้าวล่าสุดวันไหน",
    "วันที่ 28 สิงหา ผมใช้ไปเท่าไร",
    "วันที่ 29 สิงหาคม ใช้ไปกี่บาท",
    "วันนี้ผมกินอะไร",
    "ยอดคงเหลือตอนนี้มีเท่าไร"
  ];

  for (const q of queries) {
    console.log("==================================================");
    console.log("USER:", q);
    const parsed = parseFinancialQuery(q);
    console.log("PARSED:", parsed);

    let mongoQuery = {};
    if (parsed.searchKeyword) {
      const escapedKw = parsed.searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const conditions = [
        { description: { $regex: escapedKw, $options: "i" } },
        { category: { $regex: escapedKw, $options: "i" } }
      ];

      // If user searched for generic food like 'ข้าว', also include 'อาหาร' category or 'ข้า'
      if (parsed.searchKeyword === "ข้าว" || parsed.searchKeyword === "อาหาร" || parsed.searchKeyword === "กินข้าว") {
        conditions.push({ category: "อาหาร" });
        conditions.push({ description: { $regex: "ข้า", $options: "i" } });
      }

      const keywordFilter = { $or: conditions };
      if (parsed.timeFilter && Object.keys(parsed.timeFilter).length > 0) {
        mongoQuery = { $and: [keywordFilter, parsed.timeFilter] };
      } else {
        mongoQuery = keywordFilter;
      }
    } else {
      mongoQuery = parsed.timeFilter || {};
    }

    const txs = await db.collection("transactions").find(mongoQuery).sort({ dateStr: -1, createdAt: -1 }).toArray();
    console.log(`Found ${txs.length} transactions in DB`);
    const resp = generateChatResponse(parsed, txs);
    console.log("BOT:\n" + resp);
  }

  await client.close();
}

run().catch(console.error);
