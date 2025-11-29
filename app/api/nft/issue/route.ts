import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { ethers } from "ethers";

const NFT_CONTRACT_ABI = [
  "function issueCertificate(address recipient, string memory name, uint8 level, string[] memory skills, string memory achievementType, string memory tokenURI) public returns (uint256)",
  "function getCertificates(address owner) public view returns (uint256[] memory)",
  "function getCertificate(uint256 tokenId) public view returns (string memory, uint8, uint256, string[] memory, string memory)",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { walletAddress, level, skills, achievementType, name } = await req.json();

    if (!walletAddress || !level || !skills || !achievementType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user qualifies for the certificate
    const qualified = await checkQualification(session.user.id, level, achievementType);
    if (!qualified) {
      return NextResponse.json(
        { error: "User does not meet requirements for this certificate" },
        { status: 403 }
      );
    }

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(
      process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology"
    );
    const wallet = new ethers.Wallet(process.env.NFT_MINTER_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      process.env.NFT_CONTRACT_ADDRESS!,
      NFT_CONTRACT_ABI,
      wallet
    );

    // Generate metadata URI (in production, upload to IPFS)
    const metadata = {
      name: `PolyBuilder Certificate - ${name}`,
      description: `Certification of ${level} level skills in smart contract development`,
      image: `https://polybuilder.com/certificates/${level}.png`,
      attributes: [
        { trait_type: "Level", value: level },
        { trait_type: "Achievement Type", value: achievementType },
        { trait_type: "Issued Date", value: new Date().toISOString() },
        ...skills.map((skill: string) => ({ trait_type: "Skill", value: skill })),
      ],
    };

    const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString("base64")}`;

    // Issue certificate NFT
    const tx = await contract.issueCertificate(
      walletAddress,
      name,
      getLevelEnum(level),
      skills,
      achievementType,
      tokenURI
    );

    const receipt = await tx.wait();
    const tokenId = receipt.logs[0].topics[3]; // Extract token ID from event

    // Save to database
    const certificate = await prisma.nFTCertificate.create({
      data: {
        name,
        description: metadata.description,
        imageUrl: metadata.image,
        contractAddress: process.env.NFT_CONTRACT_ADDRESS!,
        tokenId: tokenId.toString(),
        blockchain: "polygon",
        txHash: receipt.hash,
        level,
        skills,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      certificate,
      tokenId: tokenId.toString(),
      txHash: receipt.hash,
      explorerUrl: `https://amoy.polygonscan.com/tx/${receipt.hash}`,
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return NextResponse.json({ error: "Failed to issue certificate" }, { status: 500 });
  }
}

// GET /api/nft/issue - Get user's certificates
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certificates = await prisma.nFTCertificate.findMany({
      where: { userId: session.user.id },
      orderBy: { issuedAt: "desc" },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}

async function checkQualification(
  userId: string,
  level: string,
  achievementType: string
): Promise<boolean> {
  // Check user's achievements
  const [contractsDeployed, templatesCreated, scansPassed] = await Promise.all([
    prisma.contractAnalytics.count({ where: { userId } }),
    prisma.template.count({ where: { authorId: userId } }),
    prisma.securityScan.count({
      where: {
        userId,
        criticalIssues: 0,
        highIssues: 0,
      },
    }),
  ]);

  const requirements: Record<string, any> = {
    beginner: { contracts: 1 },
    intermediate: { contracts: 5, scans: 3 },
    advanced: { contracts: 10, scans: 5, templates: 2 },
    expert: { contracts: 20, scans: 10, templates: 5 },
    master: { contracts: 50, scans: 20, templates: 10 },
  };

  const req = requirements[level.toLowerCase()];
  if (!req) return false;

  return (
    contractsDeployed >= (req.contracts || 0) &&
    scansPassed >= (req.scans || 0) &&
    templatesCreated >= (req.templates || 0)
  );
}

function getLevelEnum(level: string): number {
  const levels: Record<string, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
    expert: 3,
    master: 4,
  };
  return levels[level.toLowerCase()] || 0;
}

