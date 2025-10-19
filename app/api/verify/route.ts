import { NextRequest, NextResponse } from "next/server";
import { verifyContract } from "@/lib/blockchain/deployer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contractAddress,
      contractName,
      sourceCode,
      constructorArgs,
      network,
    } = body;

    if (!contractAddress || !contractName || !sourceCode || !network) {
      return NextResponse.json(
        {
          error:
            "Invalid request: contractAddress, contractName, sourceCode, and network required",
        },
        { status: 400 }
      );
    }

    const logs: string[] = [];
    const onLog = (message: string) => {
      logs.push(message);
    };

    const result = await verifyContract(
      contractAddress,
      contractName,
      sourceCode,
      constructorArgs || [],
      network,
      onLog
    );

    return NextResponse.json({
      ...result,
      logs,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        logs: [`Error: ${error.message}`],
      },
      { status: 500 }
    );
  }
}

