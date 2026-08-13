import { adminDb } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/lib";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const OWNER = process.env.NEXT_PUBLIC_OWNER;
    const { invoiceId } = await req.json();

    const invoiceData = await adminDb
      .collection("invoices")
      .doc(invoiceId)
      .get();
    const currentUser = await getCurrentUser();

    if (invoiceData.data()?.owner !== OWNER || currentUser?.role !== "admin") {
      return NextResponse.json({
        success: false,
        message: "Unauthorized owner!",
      });
    }

    await adminDb.collection("invoices").doc(invoiceId).update({
      withdrawStatus: "complete",
    });

    return NextResponse.json({
      success: true,
      message: "action successful",
    });
  } catch (error) {
    console.log(error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
