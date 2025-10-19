import { NextRequest, NextResponse } from "next/server";
import { compileContracts, ContractFile } from "@/lib/blockchain/compiler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { files } = body as { files: ContractFile[] };

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: "Invalid request: files array required" },
        { status: 400 }
      );
    }

    const logs: string[] = [];
    const onLog = (message: string) => {
      logs.push(message);
    };

    const result = await compileContracts(files, onLog);

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

