import { NextRequest, NextResponse } from "next/server";
import { getContractInfo } from "@/lib/blockchain/deployer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const contractAddress = searchParams.get("address");
    const network = searchParams.get("network") as "mumbai" | "amoy" | "polygon";

    if (!contractAddress || !network) {
      return NextResponse.json(
        { error: "Invalid request: address and network required" },
        { status: 400 }
      );
    }

    const info = await getContractInfo(contractAddress, network);

    return NextResponse.json({
      success: true,
      info,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

