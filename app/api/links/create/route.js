import { adminDb } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const OWNER = process.env.NEXT_PUBLIC_OWNER;
    const { linkname } = await req.json();

    const currentUser = await getCurrentUser();

    // 1. Validate inputs
    if (!linkname) {
      return NextResponse.json({
        success: false,
        message: "linkname is required!",
      });
    }

    const existinglinkname = await adminDb
      .collection("links")
      .where("linkname", "==", linkname)
      .where("owner", "==", OWNER)
      .get();

    if (!existinglinkname.empty) {
      return NextResponse.json({
        success: false,
        message: "This link is taken!",
      });
    }

    // 2. Define payload
    const linkData = {
      linkname,
      createdBy: currentUser?.username,
      createdAt: new Date().toISOString(),
      owner: OWNER,
    };

    // 3. Save to Firestore (e.g., in a "links" collection)
    const docRef = await adminDb.collection("links").add(linkData);

    return NextResponse.json({
      success: true,
      message: "Link added successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error(error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
