import { adminDb } from "@/lib/firebase";
import { getCurrentUser } from "@/lib/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.username) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // 1. Fetch invoices matching owner, username, and withdrawStatus "--"
    const balanceQueryFields = adminDb
      .collection("invoices")
      .where("owner", "==", process.env.NEXT_PUBLIC_OWNER);
    // .where("withdrawStatus", "==", "--")

    if (currentUser?.role == "user") {
      balanceQueryFields.where("generatedBy", "==", currentUser?.username);
    }

    const balanceQuery = await balanceQueryFields.get();

    const invoices = balanceQuery.docs.map((doc) => doc.data());

    // 2. Fetch all statusLink endpoints in parallel to check settled state
    const statusChecks = await Promise.all(
      invoices.map(async (invoice) => {
        if (!invoice.statusLink) {
          return { amount: 0, settled: false };
        }

        try {
          const res = await fetch(invoice.statusLink, {
            cache: "no-store", // Guarantees fresh status check on every request
          });

          if (!res.ok) return { amount: 0, settled: false };

          const data = await res.json();
          const amount = parseFloat(invoice.amount) || 0;

          return {
            amount,
            settled: data?.settled === true,
          };
        } catch (err) {
          // If an external link times out or fails, treat safely as unsettled
          return { amount: 0, settled: false };
        }
      }),
    );

    // 3. Calculate total balance for settled invoices
    const totalBalance = statusChecks.reduce((acc, current) => {
      return current.settled ? acc + current.amount : acc;
    }, 0);

    return NextResponse.json({
      success: true,
      message: "Balance fetched successfully",
      balance: totalBalance,
    });
  } catch (error) {
    console.error("Balance calculation error:", error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
