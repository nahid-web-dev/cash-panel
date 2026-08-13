// app/api/invoices/route.js
import { adminDb } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/lib";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const OWNER = process.env.NEXT_PUBLIC_OWNER;
    const { searchParams } = new URL(req.url);
    const currentUser = await getCurrentUser();

    // Pagination Params
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);
    const isWalletPage = searchParams.get("from") === "wallet";

    let query = adminDb.collection("invoices").where("owner", "==", OWNER);

    if (currentUser?.role !== "admin") {
      query = query.where("generatedBy", "==", currentUser?.username);
    }

    if (isWalletPage) {
      query = query.where("withdrawStatus", "==", "pending");
    }

    const snapshot = await query.get();

    let allInvoices = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort newest first
    allInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate pagination slice
    const totalItems = allInvoices.length;
    const totalPages = Math.ceil(totalItems / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedInvoices = allInvoices.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      invoices: paginatedInvoices,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error?.message || error);
    return NextResponse.json({
      success: false,
      message: "Internal server error while fetching invoices.",
    });
  }
}
