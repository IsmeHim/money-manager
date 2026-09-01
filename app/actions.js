"use server";

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

// Helper function to serialize MongoDB documents (converting ObjectId to string, etc.)
function serializeDoc(doc) {
  if (!doc) return null;
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
  };
}

export async function addTransaction(data) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("transactions");

    const transaction = {
      type: data.type, // 'income' | 'expense'
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description || "",
      dateStr: data.dateStr, // "YYYY-MM-DD"
      timeStr: data.timeStr || "00:00", // "HH:MM"
      createdAt: new Date(),
    };

    if (isNaN(transaction.amount) || transaction.amount <= 0) {
      throw new Error("กรุณากรอกจำนวนเงินให้ถูกต้อง");
    }

    const result = await collection.insertOne(transaction);
    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error adding transaction:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteTransaction(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("transactions");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return { success: true };
    } else {
      throw new Error("ไม่พบรายการที่ต้องการลบ");
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { success: false, error: error.message };
  }
}

export async function getDashboardData(view, dateStr) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("transactions");

    // Normalize dateStr to Christian Calendar (AD) if Buddhist Calendar (BE > 2400) is used
    if (dateStr) {
      const parts = dateStr.split("-");
      let year = parseInt(parts[0], 10);
      if (year > 2400) {
        year -= 543;
        parts[0] = String(year);
        dateStr = parts.join("-");
      }
    }

    let query = {};
    if (view === "daily") {
      query.dateStr = dateStr; // Exact match: "YYYY-MM-DD"
    } else if (view === "monthly") {
      // Range query: from "YYYY-MM-01" to "YYYY-MM-DD" (days in month)
      const year = parseInt(dateStr.split("-")[0], 10);
      const monthIndex = parseInt(dateStr.split("-")[1], 10);
      const daysInMonth = new Date(year, monthIndex, 0).getDate();
      query.dateStr = {
        $gte: `${dateStr}-01`,
        $lte: `${dateStr}-${String(daysInMonth).padStart(2, "0")}`,
      };
    } else if (view === "yearly") {
      // Range query: from "YYYY-01-01" to "YYYY-12-31"
      query.dateStr = {
        $gte: `${dateStr}-01-01`,
        $lte: `${dateStr}-12-31`,
      };
    }

    const rawTransactions = await collection.find(query).sort({ dateStr: -1, createdAt: -1 }).toArray();
    const transactions = rawTransactions.map(serializeDoc);

    // Calculate Summary stats
    let totalIncome = 0;
    let totalExpense = 0;

    // Structure for chart data depending on view
    const chartMap = {};
    const categoryMap = {};

    transactions.forEach((tx) => {
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else {
        totalExpense += tx.amount;
      }

      // Grouping category breakdown
      const key = `${tx.type}-${tx.category}`;
      if (!categoryMap[key]) {
        categoryMap[key] = {
          category: tx.category,
          type: tx.type,
          amount: 0,
        };
      }
      categoryMap[key].amount += tx.amount;

      // Grouping chart details
      if (view === "monthly") {
        // Group by Day (DD)
        const day = tx.dateStr.split("-")[2]; // "DD"
        if (!chartMap[day]) {
          chartMap[day] = { label: day, income: 0, expense: 0 };
        }
        if (tx.type === "income") {
          chartMap[day].income += tx.amount;
        } else {
          chartMap[day].expense += tx.amount;
        }
      } else if (view === "yearly") {
        // Group by Month (MM)
        const month = tx.dateStr.split("-")[1]; // "MM"
        if (!chartMap[month]) {
          chartMap[month] = { label: month, income: 0, expense: 0 };
        }
        if (tx.type === "income") {
          chartMap[month].income += tx.amount;
        } else {
          chartMap[month].expense += tx.amount;
        }
      } else if (view === "daily") {
        // For daily, group by category directly
        const cat = tx.category;
        if (!chartMap[cat]) {
          chartMap[cat] = { label: cat, income: 0, expense: 0 };
        }
        if (tx.type === "income") {
          chartMap[cat].income += tx.amount;
        } else {
          chartMap[cat].expense += tx.amount;
        }
      }
    });

    const balance = totalIncome - totalExpense;

    // Convert chart Map to sorted array
    let chartData = [];
    if (view === "monthly") {
      // Days 01-31
      const year = dateStr.split("-")[0];
      const monthIndex = parseInt(dateStr.split("-")[1], 10);
      const daysInMonth = new Date(year, monthIndex, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = String(d).padStart(2, "0");
        chartData.push(
          chartMap[dayStr] || { label: dayStr, income: 0, expense: 0 }
        );
      }
    } else if (view === "yearly") {
      // Months 01-12
      const monthNames = [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
        "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
      ];
      for (let m = 1; m <= 12; m++) {
        const monthStr = String(m).padStart(2, "0");
        const data = chartMap[monthStr] || { income: 0, expense: 0 };
        chartData.push({
          label: monthNames[m - 1],
          income: data.income,
          expense: data.expense,
        });
      }
    } else {
      // Daily: breakdown by categories
      chartData = Object.values(chartMap);
    }

    // Convert categoryMap to arrays and compute percentages
    const categoryBreakdown = Object.values(categoryMap).map((item) => {
      const totalOfType = item.type === "income" ? totalIncome : totalExpense;
      return {
        ...item,
        percentage: totalOfType > 0 ? Math.round((item.amount / totalOfType) * 100) : 0,
      };
    });

    return {
      success: true,
      transactions,
      summary: {
        totalIncome,
        totalExpense,
        balance,
      },
      chartData,
      categoryBreakdown: categoryBreakdown.sort((a, b) => b.amount - a.amount),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return { success: false, error: error.message };
  }
}

export async function askFinancialBot(userMessage) {
  try {
    const { parseFinancialQuery, generateChatResponse } = await import("@/lib/chatEngine");
    const parsed = parseFinancialQuery(userMessage);

    if (parsed.intent === "greeting") {
      return {
        success: true,
        response: generateChatResponse(parsed, []),
      };
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("transactions");

    let query = {};
    if (parsed.searchKeyword) {
      const escapedKw = parsed.searchKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const conditions = [
        { description: { $regex: escapedKw, $options: "i" } },
        { category: { $regex: escapedKw, $options: "i" } },
      ];

      // If user asks for generic food like 'ข้าว', also match 'อาหาร' category or 'ข้า'
      if (
        parsed.searchKeyword === "ข้าว" ||
        parsed.searchKeyword === "อาหาร" ||
        parsed.searchKeyword === "กินข้าว" ||
        parsed.searchKeyword === "กับข้าว"
      ) {
        conditions.push({ category: "อาหาร" });
        conditions.push({ description: { $regex: "ข้า", $options: "i" } });
      }

      const keywordFilter = { $or: conditions };

      if (parsed.timeFilter && Object.keys(parsed.timeFilter).length > 0) {
        query = {
          $and: [keywordFilter, parsed.timeFilter],
        };
      } else {
        query = keywordFilter;
      }
    } else {
      query = parsed.timeFilter || {};
    }

    const rawTransactions = await collection.find(query).sort({ dateStr: -1, createdAt: -1 }).toArray();
    const transactions = rawTransactions.map(serializeDoc);

    const response = generateChatResponse(parsed, transactions);

    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("Error in financial chatbot:", error);
    return {
      success: false,
      response: "ขออภัยครับ เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้งนะครับ",
    };
  }
}
