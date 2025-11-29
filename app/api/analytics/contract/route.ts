import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contractAddress, contractCode, blockchain } = await req.json();

    if (!contractAddress && !contractCode) {
      return NextResponse.json(
        { error: "Contract address or code is required" },
        { status: 400 }
      );
    }

    // Analyze contract with Gemini
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash-exp" });

    const prompt = `Analyze this Solidity smart contract and provide detailed performance metrics and optimization recommendations:

${contractCode}

Provide a JSON response with:
{
  "gasOptimizationScore": <number 0-100>,
  "securityScore": <number 0-100>,
  "codeQuality": <number 0-100>,
  "estimatedDeploymentCost": <number in USD>,
  "recommendations": [
    {
      "category": "gas|security|quality",
      "severity": "critical|high|medium|low",
      "title": "...",
      "description": "...",
      "codeExample": "..."
    }
  ],
  "metrics": {
    "functions": <number>,
    "lines": <number>,
    "complexity": <number 0-100>,
    "dependencies": <number>
  },
  "hotspots": [
    {
      "function": "...",
      "issue": "...",
      "suggestion": "..."
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse analysis response");
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Save to database
    const contractAnalytics = await prisma.contractAnalytics.create({
      data: {
        contractAddress: contractAddress || "draft",
        contractName: extractContractName(contractCode),
        blockchain: blockchain || "polygon",
        optimizationScore: analysis.gasOptimizationScore,
        securityScore: analysis.securityScore,
        metadata: analysis as any,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      id: contractAnalytics.id,
      ...analysis,
    });
  } catch (error) {
    console.error("Error analyzing contract:", error);
    return NextResponse.json({ error: "Failed to analyze contract" }, { status: 500 });
  }
}

// GET /api/analytics/contract - Get user's contract analytics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analytics = await prisma.contractAnalytics.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

function extractContractName(code: string): string {
  const match = code.match(/contract\s+(\w+)/);
  return match ? match[1] : "Unknown";
}

