import { adminDb } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const OWNER = process.env.NEXT_PUBLIC_OWNER;

    // 1. Fetch matching user documents
    const fetchedUsers = await adminDb
      .collection("users")
      .where("role", "==", "user")
      .where("owner", "==", OWNER)
      .get();

    // 2. Map snapshot documents into plain data objects
    const allUsers = fetchedUsers.docs.map((doc) => {
      const data = doc.data();

      // Omit sensitive data like password hash before sending to client
      const { password, ...safeUserData } = data;

      return {
        id: doc.id, // Ensure document ID is passed for table keys / delete actions
        ...safeUserData,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Users fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
