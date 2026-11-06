import clientPromise from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "money-manager-secure-jwt-secret-2026";
const TOKEN_COOKIE_NAME = "mm_token";
const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

/**
 * Helper to safely get Next.js cookies store in server environment
 */
async function getCookieStore() {
  try {
    const { cookies } = await import("next/headers");
    return await cookies();
  } catch {
    return null;
  }
}

/**
 * Initializes the default admin user 'him' and links existing transactions
 */
export async function ensureDefaultAdmin() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection("users");
    const txCollection = db.collection("transactions");

    // Check if admin user 'him' exists
    const existingAdmin = await usersCollection.findOne({ username: "him" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("him03012548", 10);
      await usersCollection.insertOne({
        username: "him",
        password: hashedPassword,
        displayName: "Him (Admin)",
        role: "admin",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Initialized default admin user: him");
    }

    // Associate existing transactions without a username to 'him'
    await txCollection.updateMany(
      { username: { $exists: false } },
      { $set: { username: "him" } }
    );
  } catch (err) {
    console.error("Error in ensureDefaultAdmin:", err);
  }
}

/**
 * Create a signed JWT token valid for 7 days
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Get the currently logged-in user from request cookies
 */
export async function getCurrentUser() {
  await ensureDefaultAdmin();
  const cookieStore = await getCookieStore();
  if (!cookieStore) return null;

  const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.username) return null;

  return {
    userId: decoded.userId,
    username: decoded.username,
    displayName: decoded.displayName || decoded.username,
    role: decoded.role || "member",
    familyGroup: decoded.familyGroup || null,
    walletOwner: decoded.familyGroup || decoded.username,
  };
}

/**
 * Set the auth session cookie (7 days)
 */
export async function setSessionCookie(token) {
  const cookieStore = await getCookieStore();
  if (!cookieStore) return;

  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS_SECONDS,
  });
}

/**
 * Remove the auth session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await getCookieStore();
  if (!cookieStore) return;
  cookieStore.delete(TOKEN_COOKIE_NAME);
}
