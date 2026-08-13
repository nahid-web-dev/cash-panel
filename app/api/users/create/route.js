import { adminDb } from "@/lib/firebase";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/lib/lib";

export async function POST(req) {
  try {
    const OWNER = process.env.NEXT_PUBLIC_OWNER;
    const { username, password } = await req.json();

    const currentUser = await getCurrentUser();
    if (
      !currentUser ||
      currentUser?.role !== "admin" ||
      currentUser?.owner !== OWNER
    ) {
      return NextResponse.json({
        success: false,
        message: "You aren't an admin.",
      });
    }

    // 1. Validate incoming data
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const existingUsersQuery = await adminDb
      .collection("users")
      .where("username", "==", username)
      .where("owner", "==", OWNER)
      .get();

    if (!existingUsersQuery.empty) {
      return NextResponse.json({
        success: false,
        message: "Username is already taken.",
      });
    }

    // 2. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Prepare user payload (never store plain-text passwords!)
    const userData = {
      username,
      password: hashedPassword, // Store the hashed password
      role: "user",
      owner: OWNER,
      createdAt: new Date().toISOString(),
    };

    // 4. Insert into Firestore collection (e.g., "users")
    // Option A: Auto-generate document ID
    const docRef = await adminDb.collection("users").add(userData);

    /* // Option B: Use `username` as the document ID (ensures unique usernames)
    const docRef = adminDb.collection("users").doc(username);
    await docRef.set(userData);
    */

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId: docRef.id,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
}
