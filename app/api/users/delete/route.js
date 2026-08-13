import { adminDb } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const OWNER = process.env.NEXT_PUBLIC_OWNER;
    const { username } = await req.json();

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

    const usersQuery = await adminDb
      .collection("users")
      .where("username", "==", username)
      .where("owner", "==", OWNER)
      .get();
    // 2. Check if the user exists
    if (usersQuery.empty) {
      return NextResponse.json({
        success: false,
        message: "user doesn't exist",
      });
    }

    const usersQueryDov = usersQuery.docs[0];
    await usersQueryDov.ref.delete();

    return NextResponse.json({
      success: true,
      message: "User deleted successfully!",
    });
  } catch (error) {
    console.log(error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
