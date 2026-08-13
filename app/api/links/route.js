import { adminDb } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const OWNER = process.env.NEXT_PUBLIC_OWNER;

    const currentUser = await getCurrentUser();

    // 1. Fetch matching link documents from the "links" collection
    let fetchedLinks;
    if (currentUser?.role === "admin") {
      fetchedLinks = await adminDb
        .collection("links")
        .where("owner", "==", OWNER)
        .get();
    } else {
      fetchedLinks = await adminDb
        .collection("links")
        .where("owner", "==", OWNER)
        .where("createdBy", "==", currentUser?.username)
        .get();
    }

    // 2. Map snapshot documents into plain data objects
    const allLinks = fetchedLinks.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id, // Includes document ID for frontend keys and delete actions
        ...data,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Links fetched successfully",
      data: allLinks,
    });
  } catch (error) {
    console.error("Error fetching links:", error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
