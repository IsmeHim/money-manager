"use server";

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/auth";

function serializeMessage(msg, idx = 0) {
  return {
    id: msg.id || msg._id?.toString() || `msg-${idx}`,
    sender: msg.sender, // 'user' | 'bot'
    text: msg.text || "",
    usedModel: msg.usedModel || null,
    fallbackUsed: Boolean(msg.fallbackUsed),
    source: msg.source || "local",
    time:
      msg.time ||
      (msg.createdAt
        ? new Date(msg.createdAt).toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""),
    createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : null,
  };
}

function serializeSession(doc) {
  const messages = Array.isArray(doc.messages)
    ? doc.messages.map((m, i) => serializeMessage(m, i))
    : [];
  return {
    id: doc._id.toString(),
    title: doc.title || "แชทการเงิน",
    isPinned: Boolean(doc.isPinned),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
    messageCount: messages.length,
    messages,
  };
}

/**
 * Fetches all chat sessions for the logged-in user (Pinned first, then newest updatedAt).
 * Also migrates any legacy flat chat_messages into a session once so old history is preserved.
 */
export async function getChatSessionsAction() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, unauthorized: true, sessions: [] };
    }

    const client = await clientPromise;
    const db = client.db();
    const sessionsCol = db.collection("chat_sessions");
    const legacyCol = db.collection("chat_messages");

    // One-time migration if legacy messages exist for this user
    const legacyDocs = await legacyCol
      .find({ username: currentUser.username })
      .sort({ createdAt: 1 })
      .toArray();

    if (legacyDocs.length > 0) {
      const firstUserMsg = legacyDocs.find((m) => m.sender === "user");
      const title = firstUserMsg?.text
        ? firstUserMsg.text.trim().slice(0, 40)
        : "ประวัติแชทก่อนหน้า";

      const migratedMessages = legacyDocs.map((m) => ({
        id: m._id.toString(),
        sender: m.sender,
        text: m.text || "",
        usedModel: m.usedModel || null,
        fallbackUsed: Boolean(m.fallbackUsed),
        source: m.source || "local",
        time: m.time || "",
        createdAt: m.createdAt || new Date(),
      }));

      await sessionsCol.insertOne({
        username: currentUser.username,
        title,
        isPinned: false,
        messages: migratedMessages,
        createdAt: legacyDocs[0]?.createdAt || new Date(),
        updatedAt: legacyDocs[legacyDocs.length - 1]?.createdAt || new Date(),
      });

      await legacyCol.deleteMany({ username: currentUser.username });
    }

    const docs = await sessionsCol
      .find({ username: currentUser.username })
      .sort({ isPinned: -1, updatedAt: -1 })
      .limit(100)
      .toArray();

    return {
      success: true,
      sessions: docs.map(serializeSession),
    };
  } catch (error) {
    console.error("getChatSessionsAction error:", error);
    return { success: false, error: error.message, sessions: [] };
  }
}

/**
 * Toggles pin/unpin status for a specific chat session
 */
export async function togglePinChatSessionAction(sessionId) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "กรุณาเข้าสู่ระบบ" };
    }

    if (!sessionId || !ObjectId.isValid(sessionId)) {
      return { success: false, error: "รหัสห้องแชทไม่ถูกต้อง" };
    }

    const client = await clientPromise;
    const db = client.db();
    const sessionsCol = db.collection("chat_sessions");

    const existing = await sessionsCol.findOne({
      _id: new ObjectId(sessionId),
      username: currentUser.username,
    });

    if (!existing) {
      return { success: false, error: "ไม่พบประวัติแชทนี้" };
    }

    const newPinned = !existing.isPinned;
    await sessionsCol.updateOne(
      { _id: new ObjectId(sessionId), username: currentUser.username },
      { $set: { isPinned: newPinned } }
    );

    return { success: true, isPinned: newPinned };
  } catch (error) {
    console.error("togglePinChatSessionAction error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Deletes an entire chat session (round) by ID
 */
export async function deleteChatSessionAction(sessionId) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "กรุณาเข้าสู่ระบบ" };
    }

    if (!sessionId || !ObjectId.isValid(sessionId)) {
      return { success: false, error: "รหัสห้องแชทไม่ถูกต้อง" };
    }

    const client = await clientPromise;
    const db = client.db();
    await db.collection("chat_sessions").deleteOne({
      _id: new ObjectId(sessionId),
      username: currentUser.username,
    });

    return { success: true };
  } catch (error) {
    console.error("deleteChatSessionAction error:", error);
    return { success: false, error: error.message };
  }
}
