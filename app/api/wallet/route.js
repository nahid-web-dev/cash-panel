import { adminDb } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/lib"; // Adjust path to your auth helper

// GET: Fetch the wallet mail address for current owner
export async function GET() {
  try {
    const OWNER = process.env.NEXT_PUBLIC_OWNER;
    const user = await getCurrentUser();
    if (user?.role !== "admin" || user?.owner !== OWNER) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // Fetch existing wallet document for this owner
    const walletQuery = await adminDb
      .collection("wallets")
      .where("owner", "==", OWNER)
      .get();

    if (walletQuery.empty) {
      return NextResponse.json({
        success: false,
        message: "Wallet not found.",
        data: null,
      });
    }

    const walletDoc = walletQuery.docs[0];

    return NextResponse.json({
      success: true,
      message: "Wallet fetched successfully.",
      data: {
        id: walletDoc.id,
        ...walletDoc.data(),
      },
    });
  } catch (error) {
    console.error("Error fetching wallet:", error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}

// POST: Create or Edit the wallet mail address
export async function POST(req) {
  try {
    const OWNER = process.env.NEXT_PUBLIC_OWNER;
    const user = await getCurrentUser();
    if (user?.role !== "admin" || user?.owner !== OWNER) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    const { mail } = await req.json();

    if (!mail) {
      return NextResponse.json({
        success: false,
        message: "Email address is required.",
      });
    }

    // Check if wallet document already exists for this owner
    const walletQuery = await adminDb
      .collection("wallets")
      .where("owner", "==", OWNER)
      .get();

    if (!walletQuery.empty) {
      // EDIT / UPDATE existing wallet
      const walletDocRef = walletQuery.docs[0].ref;

      await walletDocRef.update({
        mail,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Wallet email updated successfully.",
        data: {
          id: walletQuery.docs[0].id,
          owner: OWNER,
          mail,
        },
      });
    } else {
      // CREATE new wallet
      const newWallet = {
        owner: OWNER,
        mail,
        createdAt: new Date().toISOString(),
      };

      const walletRef = await adminDb.collection("wallets").add(newWallet);

      return NextResponse.json({
        success: true,
        message: "Wallet created successfully.",
        data: {
          id: walletRef.id,
          ...newWallet,
        },
      });
    }
  } catch (error) {
    console.error("Error saving wallet:", error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
