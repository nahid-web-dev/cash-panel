import { adminDb } from "@/lib/firebase";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: "Username and password are required",
      });
    }

    const owner = process.env.NEXT_PUBLIC_OWNER;
    if (!owner) {
      return NextResponse.json({
        success: false,
        message: "Owner environment variable is missing",
      });
    }

    // 1. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Query for existing admin matching this owner
    const snapshot = await adminDb
      .collection("users")
      .where("role", "==", "admin")
      .where("owner", "==", owner)
      .limit(1)
      .get();

    // 3. Upsert logic (Update if exists, Create if not)
    if (!snapshot.empty) {
      const adminDoc = snapshot.docs[0];
      await adminDoc.ref.update({
        username,
        password: hashedPassword,
        updatedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: "Admin password and username updated successfully",
      });
    } else {
      await adminDb.collection("users").add({
        username,
        password: hashedPassword,
        role: "admin",
        owner,
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: "Admin created successfully",
      });
    }
  } catch (error) {
    console.error("Admin upsert error:", error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
