"use server";

import clientPromise from "@/lib/db";
import bcrypt from "bcryptjs";
import {
  ensureDefaultAdmin,
  signToken,
  setSessionCookie,
  clearSessionCookie,
  getCurrentUser,
} from "@/lib/auth";

export async function loginAction(formData) {
  try {
    await ensureDefaultAdmin();

    const username = (formData.username || "").toLowerCase().trim();
    const password = formData.password || "";

    if (!username || !password) {
      return { success: false, error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" };
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return { success: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    if (user.status === "inactive") {
      return { success: false, error: "บัญชีนี้ถูกปิดการใช้งาน กรุณาติดต่อผู้ดูแลระบบ" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
    }

    // Generate 7-day token
    const tokenPayload = {
      userId: user._id.toString(),
      username: user.username,
      displayName: user.displayName || user.username,
      role: user.role || "member",
      familyGroup: user.familyGroup || null,
    };

    const token = signToken(tokenPayload);
    await setSessionCookie(token);

    return {
      success: true,
      token,
      user: {
        ...tokenPayload,
        walletOwner: tokenPayload.familyGroup || tokenPayload.username,
      },
    };
  } catch (error) {
    console.error("Login action error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ: " + error.message };
  }
}

export async function registerAction(formData) {
  try {
    await ensureDefaultAdmin();

    const username = (formData.username || "").toLowerCase().trim();
    const password = formData.password || "";
    const displayName = (formData.displayName || "").trim() || username;

    if (!username || username.length < 3) {
      return { success: false, error: "ชื่อผู้ใช้ (Username) ต้องมีความยาวอย่างน้อย 3 ตัวอักษร" };
    }

    if (!/^[a-z0-9_.-]+$/.test(username)) {
      return {
        success: false,
        error: "ชื่อผู้ใช้ต้องประกอบด้วยตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข หรือ _ . - เท่านั้น",
      };
    }

    if (!password || password.length < 6) {
      return { success: false, error: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" };
    }

    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return { success: false, error: `ชื่อผู้ใช้ '${username}' มีผู้ใช้งานแล้ว กรุณาตั้งชื่ออื่น` };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserDoc = {
      username,
      password: hashedPassword,
      displayName,
      role: "member",
      familyGroup: null, // Independent personal account
      accountType: "personal",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUserDoc);

    // Auto-login with 7-day token
    const tokenPayload = {
      userId: result.insertedId.toString(),
      username,
      displayName,
      role: "member",
      familyGroup: null,
    };

    const token = signToken(tokenPayload);
    await setSessionCookie(token);

    return {
      success: true,
      token,
      user: {
        ...tokenPayload,
        walletOwner: username,
      },
    };
  } catch (error) {
    console.error("Register action error:", error);
    return { success: false, error: "เกิดข้อผิดพลาดในการสมัครสมาชิก: " + error.message };
  }
}

export async function logoutAction() {
  try {
    await clearSessionCookie();
    return { success: true };
  } catch (error) {
    console.error("Logout action error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAuthSessionAction() {
  try {
    const user = await getCurrentUser();
    return { success: true, user };
  } catch (error) {
    console.error("Get session error:", error);
    return { success: false, user: null };
  }
}
