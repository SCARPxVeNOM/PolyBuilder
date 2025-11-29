import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const grantSchema = z.object({
  projectName: z.string().min(1),
  description: z.string().min(100),
  category: z.enum(["DeFi", "NFT", "Gaming", "Infrastructure", "Tooling", "Other"]),
  fundingAmount: z.number().min(1000).max(100000),
  milestones: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      deadline: z.string(),
      amount: z.number(),
    })
  ),
  teamInfo: z.object({
    size: z.number(),
    experience: z.string(),
    githubUrl: z.string().optional(),
    previousWork: z.string().optional(),
  }),
  technicalDetails: z.object({
    contracts: z.array(z.string()),
    architecture: z.string(),
    timeline: z.string(),
  }),
});

// POST /api/grants/apply - Submit grant application
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = grantSchema.parse(body);

    // Check if user has deployed contracts (requirement)
    const deployedContracts = await prisma.contractAnalytics.count({
      where: { userId: session.user.id },
    });

    if (deployedContracts < 1) {
      return NextResponse.json(
        { error: "You must deploy at least 1 contract before applying for grants" },
        { status: 403 }
      );
    }

    // Create grant application
    const application = await prisma.grantApplication.create({
      data: {
        projectName: validatedData.projectName,
        description: validatedData.description,
        category: validatedData.category,
        fundingAmount: validatedData.fundingAmount,
        milestones: validatedData.milestones as any,
        status: "draft",
        metadata: {
          teamInfo: validatedData.teamInfo,
          technicalDetails: validatedData.technicalDetails,
          applicantId: session.user.id,
        } as any,
      },
    });

    // In production, integrate with Polygon Grants API
    if (process.env.POLYGON_GRANTS_API_KEY && process.env.POLYGON_GRANTS_API_URL) {
      try {
        const response = await fetch(`${process.env.POLYGON_GRANTS_API_URL}/applications`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.POLYGON_GRANTS_API_KEY}`,
          },
          body: JSON.stringify({
            ...validatedData,
            applicantId: session.user.id,
            platform: "PolyBuilder",
          }),
        });

        if (response.ok) {
          const externalData = await response.json();
          await prisma.grantApplication.update({
            where: { id: application.id },
            data: {
              status: "submitted",
              submittedAt: new Date(),
              metadata: {
                ...(application.metadata as any),
                externalId: externalData.id,
              } as any,
            },
          });
        }
      } catch (error) {
        console.error("Error submitting to Polygon Grants:", error);
      }
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating grant application:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}

// GET /api/grants/apply - Get user's grant applications
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await prisma.grantApplication.findMany({
      where: {
        metadata: {
          path: ["applicantId"],
          equals: session.user.id,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

