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

    const { contractCode, contractName } = await req.json();

    if (!contractCode) {
      return NextResponse.json({ error: "Contract code is required" }, { status: 400 });
    }

    // Scan with Gemini AI
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash-exp" });

    const prompt = `You are a smart contract security expert. Analyze this Solidity contract for security vulnerabilities:

${contractCode}

Provide a JSON response with:
{
  "vulnerabilities": [
    {
      "id": "...",
      "title": "...",
      "severity": "critical|high|medium|low|info",
      "category": "reentrancy|access-control|arithmetic|unchecked-calls|front-running|other",
      "description": "...",
      "location": {
        "function": "...",
        "line": <number>
      },
      "recommendation": "...",
      "codeExample": "..."
    }
  ],
  "summary": {
    "totalIssues": <number>,
    "critical": <number>,
    "high": <number>,
    "medium": <number>,
    "low": <number>,
    "info": <number>
  },
  "overallRisk": "critical|high|medium|low",
  "recommendations": [
    "..."
  ]
}

Focus on:
- Reentrancy attacks
- Access control issues
- Integer overflow/underflow
- Unchecked external calls
- Front-running vulnerabilities
- Gas optimization issues
- Best practices violations`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse scan response");
    }

    const scanResult = JSON.parse(jsonMatch[0]);

    // Determine overall severity
    const severity = scanResult.overallRisk;

    // Save to database
    const securityScan = await prisma.securityScan.create({
      data: {
        contractCode,
        contractName: contractName || extractContractName(contractCode),
        vulnerabilities: scanResult.vulnerabilities as any,
        severity,
        totalIssues: scanResult.summary.totalIssues,
        criticalIssues: scanResult.summary.critical,
        highIssues: scanResult.summary.high,
        mediumIssues: scanResult.summary.medium,
        lowIssues: scanResult.summary.low,
        recommendations: scanResult.recommendations.join("\n"),
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      id: securityScan.id,
      ...scanResult,
      scannedAt: securityScan.scannedAt,
    });
  } catch (error) {
    console.error("Error scanning contract:", error);
    return NextResponse.json({ error: "Failed to scan contract" }, { status: 500 });
  }
}

// GET /api/security/scan - Get user's security scans
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scans = await prisma.securityScan.findMany({
      where: { userId: session.user.id },
      orderBy: { scannedAt: "desc" },
      take: 50,
      select: {
        id: true,
        contractName: true,
        severity: true,
        totalIssues: true,
        criticalIssues: true,
        highIssues: true,
        mediumIssues: true,
        lowIssues: true,
        scannedAt: true,
      },
    });

    return NextResponse.json(scans);
  } catch (error) {
    console.error("Error fetching scans:", error);
    return NextResponse.json({ error: "Failed to fetch scans" }, { status: 500 });
  }
}

function extractContractName(code: string): string {
  const match = code.match(/contract\s+(\w+)/);
  return match ? match[1] : "Unknown";
}

