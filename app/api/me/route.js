import { getCurrentUser } from "@/lib/lib";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    return NextResponse.json({
      success: true,
      message: "action successful",
      data: currentUser,
    });
  } catch (error) {
    console.log(error?.message);
    return NextResponse.json({
      success: false,
      message: "Internal server error!",
    });
  }
}
