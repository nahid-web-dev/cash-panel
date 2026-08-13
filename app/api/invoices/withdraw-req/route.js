import { adminDb } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/lib";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { invoiceId } = await req.json();
    const currentUser = await getCurrentUser();
    const invoiceData = (
      await adminDb.collection("invoices").doc(invoiceId).get()
    ).data();

    if (invoiceData?.generatedBy !== currentUser?.username) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized user!",
      });
    }

    const paidStatus = await axios.get(invoiceData?.statusLink);

    if (!paidStatus.data?.settled) {
      return NextResponse.json({
        success: false,
        message: "Invoice not paid!",
      });
    }

    if (currentUser?.role === "admin") {
      return NextResponse.json({
        success: false,
        message: "Admin can not make withdraw request but can approve.",
      });
    }

    await adminDb.collection("invoices").doc(invoiceId).update({
      withdrawStatus: "pending",
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
