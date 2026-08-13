import { adminDb } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/lib"; // Adjust path to your auth helper

export async function POST(req) {
  try {
    // 1. Check authentication
    const user = await getCurrentUser();

    // 2. Extract link ID from request body
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Link ID is required.",
      });
    }

    // 3. Fetch the link document from Firestore
    const linkRef = adminDb.collection("links").doc(id);
    const linkDoc = await linkRef.get();

    if (!linkDoc.exists) {
      return NextResponse.json({ success: false, message: "Link not found." });
    }

    // 4. Delete the document
    await linkRef.delete();

    return NextResponse.json({
      success: true,
      message: "Link deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting link:", error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
