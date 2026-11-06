"use server";

import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/auth";

/**
 * Helper to ensure caller has admin role
 */
async function assertAdmin() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    throw new Error("ไม่มีสิทธิ์เข้าถึง: เฉพาะผู้ดูแลระบบ (Admin) เท่านั้น");
  }
  return currentUser;
}

// ----------------- USER MANAGEMENT -----------------

export async function getAdminUsers() {
  try {
    await assertAdmin();

    const client = await clientPromise;
    const db = client.db();
    const users = await db
      .collection("users")
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      users: users.map((u) => ({
        ...u,
        _id: u._id.toString(),
        createdAt: u.createdAt ? u.createdAt.toISOString() : null,
        updatedAt: u.updatedAt ? u.updatedAt.toISOString() : null,
      })),
    };
  } catch (error) {
    console.error("getAdminUsers error:", error);
    return { success: false, error: error.message };
  }
}

export async function createAdminUser(data) {
  try {
    const admin = await assertAdmin();

    const username = (data.username || "").toLowerCase().trim();
    const password = data.password || "";
    const displayName = data.displayName || username;
    const role = data.role === "admin" ? "admin" : "member";
    const accountType = data.accountType === "personal" ? "personal" : "family";
    const familyGroup = accountType === "family" ? (admin.familyGroup || admin.username) : null;

    if (!username || username.length < 3) {
      return { success: false, error: "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร" };
    }
    if (!password || password.length < 6) {
      return { success: false, error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" };
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    const existing = await collection.findOne({ username });
    if (existing) {
      return { success: false, error: `ชื่อผู้ใช้ '${username}' มีอยู่ในระบบแล้ว` };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await collection.insertOne({
      username,
      password: hashedPassword,
      displayName,
      role,
      accountType,
      familyGroup,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("createAdminUser error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateAdminUser(id, data) {
  try {
    const admin = await assertAdmin();

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    const updateFields = {
      updatedAt: new Date(),
    };

    if (data.displayName !== undefined) updateFields.displayName = data.displayName;
    if (data.role) updateFields.role = data.role;
    if (data.status) updateFields.status = data.status;
    if (data.accountType) {
      updateFields.accountType = data.accountType;
      updateFields.familyGroup =
        data.accountType === "family" ? (admin.familyGroup || admin.username) : null;
    }

    // Optional password reset
    if (data.password && data.password.trim().length >= 6) {
      updateFields.password = await bcrypt.hash(data.password.trim(), 10);
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return { success: result.matchedCount > 0 };
  } catch (error) {
    console.error("updateAdminUser error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAdminUser(id) {
  try {
    const admin = await assertAdmin();

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    const targetUser = await collection.findOne({ _id: new ObjectId(id) });
    if (!targetUser) {
      return { success: false, error: "ไม่พบผู้ใช้ที่ต้องการลบ" };
    }

    // Protect self and main superadmin
    if (targetUser.username === "him" || targetUser.username === admin.username) {
      return { success: false, error: "ไม่อนุญาตให้ลบบัญชีผู้ดูแลระบบหลัก" };
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  } catch (error) {
    console.error("deleteAdminUser error:", error);
    return { success: false, error: error.message };
  }
}

// ----------------- SYSTEM & AI CONFIG -----------------

export async function getAiConfig() {
  try {
    await assertAdmin();

    const client = await clientPromise;
    const db = client.db();
    const configDoc = await db.collection("system_settings").findOne({ key: "ai_config" });

    const defaultConfig = {
      provider: "gemini",
      apiKey: "",
      model: "gemini-3.5-flash-lite",
      autoFallback: true,
      isEnabled: false,
      systemPrompt:
        "คุณคือผู้ช่วยจัดการการเงินอัจฉริยะ (Smart Money Assistant) ให้ข้อมูลสรุป วิเคราะห์ค่าใช้จ่าย และตอบคำถามการเงินอย่างเป็นมิตร สุภาพ และกระชับ",
      temperature: 0.7,
    };

    if (!configDoc) {
      return { success: true, config: defaultConfig };
    }

    return {
      success: true,
      config: {
        provider: configDoc.provider || defaultConfig.provider,
        apiKey: configDoc.apiKey || "",
        model: configDoc.model || defaultConfig.model,
        autoFallback: configDoc.autoFallback !== undefined ? Boolean(configDoc.autoFallback) : true,
        isEnabled: Boolean(configDoc.isEnabled),
        systemPrompt: configDoc.systemPrompt || defaultConfig.systemPrompt,
        temperature: configDoc.temperature !== undefined ? configDoc.temperature : 0.7,
      },
    };
  } catch (error) {
    console.error("getAiConfig error:", error);
    return { success: false, error: error.message };
  }
}

export async function saveAiConfig(config) {
  try {
    await assertAdmin();

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("system_settings");

    const payload = {
      key: "ai_config",
      provider: config.provider || "gemini",
      apiKey: (config.apiKey || "").trim(),
      model: config.model || "gemini-3.5-flash-lite",
      autoFallback: config.autoFallback !== undefined ? Boolean(config.autoFallback) : true,
      isEnabled: Boolean(config.isEnabled),
      systemPrompt: config.systemPrompt || "",
      temperature: parseFloat(config.temperature) || 0.7,
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { key: "ai_config" },
      { $set: payload },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error("saveAiConfig error:", error);
    return { success: false, error: error.message };
  }
}

export async function testGeminiConfigAction(config) {
  try {
    await assertAdmin();
    const { generateGeminiFinancialAnswer } = await import("@/lib/geminiService");

    const res = await generateGeminiFinancialAnswer({
      aiConfig: config,
      userContextText:
        "=== ข้อมูลจำลองสำหรับทดสอบระบบ ===\n- ผู้ใช้: Super Admin (him)\n- ยอดคงเหลือสุทธิ: ฿15,000",
      userQuestion: "สวัสดี! ทดสอบการเชื่อมต่อ ตอบสั้นๆ 1 ประโยคว่าพร้อมใช้งานและบอกยอดคงเหลือ",
    });

    return res;
  } catch (error) {
    console.error("testGeminiConfigAction error:", error);
    return { success: false, error: error.message };
  }
}
