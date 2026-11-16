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

    const { direction, personName, amount, note, dateStr, dueDateStr, syncWithWallet } = data;
    if (!direction || !personName || !amount || !dateStr) {
      return { success: false, error: "กรุณากรอกชื่อ จำนวนเงิน และวันที่ให้ครบถ้วน" };
    }

    const walletOwner =
      currentUser.walletOwner || currentUser.familyGroup || currentUser.username;
    const numericAmount = parseFloat(amount);
    const shouldSync = Boolean(syncWithWallet);

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("debts");

    const newDebt = {
      direction: direction === "borrowed" ? "borrowed" : "lent", // 'lent' = คนติดหนี้เรา, 'borrowed' = เราติดหนี้คนอื่น
      personName: personName.trim(),
      amount: numericAmount,
      note: (note || "").trim(),
      dateStr,
      dueDateStr: dueDateStr || "",
      status: "unpaid", // 'unpaid' | 'paid'
      paidDateStr: "",
      paidAt: null,
      syncWithWallet: shouldSync,
      username: walletOwner,
      recordedBy: currentUser.displayName || currentUser.username,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newDebt);
    const debtIdStr = result.insertedId.toString();

    // If user checked "syncWithWallet", automatically deduct/add to main wallet transactions
    if (shouldSync && !isNaN(numericAmount) && numericAmount > 0) {
      const nowTimeStr = new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const isLent = newDebt.direction === "lent";
      const noteSuffix = newDebt.note ? ` (${newDebt.note})` : "";

      await db.collection("transactions").insertOne({
        type: isLent ? "expense" : "income",
        amount: numericAmount,
        category: isLent ? "ให้ยืมเงิน" : "ยืมเงิน",
        description: isLent
          ? `ให้ ${newDebt.personName} ยืมเงิน${noteSuffix}`
          : `ยืมเงินจาก ${newDebt.personName}${noteSuffix}`,
        dateStr,
        timeStr: nowTimeStr,
        username: walletOwner,
        recordedBy: currentUser.displayName || currentUser.username,
        linkedDebtId: debtIdStr,
        debtEvent: "created",
        createdAt: new Date(),
      });
    }

    revalidatePath("/");
    return { success: true, id: debtIdStr };
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
    const txCol = db.collection("transactions");

    const existingDebt = await collection.findOne({
      $and: [{ _id: new ObjectId(id) }, userScope],
    });
    if (!existingDebt) {
      return { success: false, error: "ไม่พบรายการหนี้ที่ต้องการอัปเดต" };
    }

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

    // Sync settlement with main wallet if this debt is linked to wallet balance
    if (existingDebt.syncWithWallet) {
      if (markAsPaid) {
        const existingSettledTx = await txCol.findOne({
          linkedDebtId: id,
          debtEvent: "settled",
        });

        if (!existingSettledTx) {
          const nowTimeStr = new Date().toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const isLent = existingDebt.direction === "lent";
          const noteSuffix = existingDebt.note ? ` (${existingDebt.note})` : "";

          await txCol.insertOne({
            type: isLent ? "income" : "expense",
            amount: parseFloat(existingDebt.amount),
            category: isLent ? "รับคืนหนี้" : "จ่ายคืนหนี้",
            description: isLent
              ? `ได้รับเงินคืนจาก ${existingDebt.personName}${noteSuffix}`
              : `จ่ายหนี้คืนให้ ${existingDebt.personName}${noteSuffix}`,
            dateStr: todayStr,
            timeStr: nowTimeStr,
            username: targetUsername,
            recordedBy: currentUser.displayName || currentUser.username,
            linkedDebtId: id,
            debtEvent: "settled",
            createdAt: new Date(),
          });
        }
      } else {
        // Revert settlement transaction when changing back to unpaid
        await txCol.deleteMany({
          linkedDebtId: id,
          debtEvent: "settled",
        });
      }
    }

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

    // Clean up any auto-created wallet transactions linked to this debt
    await db.collection("transactions").deleteMany({
      linkedDebtId: id,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting debt:", error);
    return { success: false, error: error.message };
  }
}
