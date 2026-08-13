import { adminDb } from "@/lib/firebase";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const OWNER = process.env.NEXT_PUBLIC_OWNER;
    const { username, password } = await req.json();

    // 1. Validate required fields
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // 2. Fetch user from Firestore
    const usersQuery = await adminDb
      .collection("users")
      .where("username", "==", username)
      .where("owner", "==", OWNER)
      .get();

    if (usersQuery.empty) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const userData = usersQuery.docs[0].data();

    // 3. Compare passwords with bcrypt
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // 4. Check that JWT_SECRET is configured
    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return NextResponse.json({
        success: false,
        message: "Internal server configuration error.",
      });
    }

    // 5. Generate JWT Token
    const token = jwt.sign(
      {
        id: usersQuery.docs[0].id,
        username: userData.username,
        role: userData.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    // 6. Build response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        username: userData.username,
        role: userData.role || "user",
        id: usersQuery.docs[0].id,
      },
    });

    // 7. Attach token as an HTTP-Only cookie for secure session handling
    response.cookies.set("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 day in seconds
    });

    return response;
  } catch (error) {
    console.error("Login error:", error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
