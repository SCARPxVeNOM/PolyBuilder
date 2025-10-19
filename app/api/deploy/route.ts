import { NextRequest, NextResponse } from "next/server";
import { deployContract, DeploymentConfig } from "@/lib/blockchain/deployer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contractName,
      artifact,
      constructorArgs,
      network,
      privateKey,
    } = body as DeploymentConfig;

    if (!contractName || !artifact || !network) {
      return NextResponse.json(
        { error: "Invalid request: contractName, artifact, and network required" },
        { status: 400 }
      );
    }

    // Use environment variable if no private key provided
    const deployKey = privateKey || process.env.PRIVATE_KEY;
    if (!deployKey) {
      return NextResponse.json(
        { error: "No private key provided and PRIVATE_KEY not set in environment" },
        { status: 400 }
      );
    }

    const logs: string[] = [];
    const onLog = (message: string) => {
      logs.push(message);
    };

    const result = await deployContract(
      {
        contractName,
        artifact,
        constructorArgs,
        network,
        privateKey: deployKey,
      },
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

