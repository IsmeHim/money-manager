"use server";

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

function serializeDebt(doc) {
  return {
    ...doc,
    _id: doc._id.toString(),
    dateStr: doc.dateStr || "",
    dueDateStr: doc.dueDateStr || "",
    paidDateStr: doc.paidDateStr || "",
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
    paidAt: doc.paidAt ? doc.paidAt.toISOString() : null,
  };
}

function getUserScope(targetUsername) {
  return targetUsername === "him"
    ? {
        $or: [
          { username: "him" },
          { username: { $exists: false } },
          { username: null },
        ],
      }
    : { username: targetUsername };
}

export async function getDebtsData() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, unauthorized: true, error: "กรุณาเข้าสู่ระบบก่อนใช้งาน" };
    }

    const targetUsername =
      currentUser.walletOwner || currentUser.familyGroup || currentUser.username;
    const userScope = getUserScope(targetUsername);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("debts");

    const rawDebts = await collection
      .find(userScope)
      .sort({ status: -1, dateStr: -1, createdAt: -1 }) // 'unpaid' comes before 'paid' alphabetically descending
      .toArray();

    const debts = rawDebts.map(serializeDebt);

    let totalLentUnpaid = 0;
    let totalBorrowedUnpaid = 0;
    let lentUnpaidCount = 0;
    let borrowedUnpaidCount = 0;

    for (const d of debts) {
      const amt = Number(d.amount) || 0;
      if (d.status !== "paid") {
        if (d.direction === "lent") {
          totalLentUnpaid += amt;
          lentUnpaidCount += 1;
        } else {
          totalBorrowedUnpaid += amt;
          borrowedUnpaidCount += 1;
        }
      }
    }

    return {
      success: true,
      debts,
      summary: {
        totalLentUnpaid,
        totalBorrowedUnpaid,
        lentUnpaidCount,
        borrowedUnpaidCount,
      },
    };
  } catch (error) {
    console.error("Error fetching debts:", error);
    return { success: false, error: error.message };
  }
}

export async function addDebt(data) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนบันทึกรายการหนี้" };
    }

    const { direction, personName, amount, note, dateStr, dueDateStr } = data;
    if (!direction || !personName || !amount || !dateStr) {
      return { success: false, error: "กรุณากรอกชื่อ จำนวนเงิน และวันที่ให้ครบถ้วน" };
    }

    const walletOwner =
      currentUser.walletOwner || currentUser.familyGroup || currentUser.username;

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("debts");

    const newDebt = {
      direction: direction === "borrowed" ? "borrowed" : "lent", // 'lent' = คนติดหนี้เรา, 'borrowed' = เราติดหนี้คนอื่น
      personName: personName.trim(),
      amount: parseFloat(amount),
      note: (note || "").trim(),
      dateStr,
      dueDateStr: dueDateStr || "",
      status: "unpaid", // 'unpaid' | 'paid'
      paidDateStr: "",
      paidAt: null,
      username: walletOwner,
      recordedBy: currentUser.displayName || currentUser.username,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newDebt);
    revalidatePath("/");
    return { success: true, id: result.insertedId.toString() };
  } catch (error) {
    console.error("Error adding debt:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleDebtPaid(id, markAsPaid = true) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" };
    }

    const targetUsername =
      currentUser.walletOwner || currentUser.familyGroup || currentUser.username;
    const userScope = getUserScope(targetUsername);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("debts");

    const todayStr = new Date().toLocaleDateString("sv-SE");
    const updateFields = markAsPaid
      ? {
          status: "paid",
          paidDateStr: todayStr,
          paidAt: new Date(),
        }
      : {
          status: "unpaid",
          paidDateStr: "",
          paidAt: null,
        };

    await collection.updateOne(
      { $and: [{ _id: new ObjectId(id) }, userScope] },
      { $set: updateFields }
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating debt status:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteDebt(id) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนลบรายการ" };
    }

    const targetUsername =
      currentUser.walletOwner || currentUser.familyGroup || currentUser.username;
    const userScope = getUserScope(targetUsername);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("debts");

    await collection.deleteOne({
      $and: [{ _id: new ObjectId(id) }, userScope],
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting debt:", error);
    return { success: false, error: error.message };
  }
}
