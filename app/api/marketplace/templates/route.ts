import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(10),
  code: z.string().min(1),
  language: z.string().default("solidity"),
  category: z.string(),
  tags: z.array(z.string()),
  price: z.number().min(0),
  isPremium: z.boolean().default(false),
  isPrivate: z.boolean().default(false),
  thumbnail: z.string().optional(),
  demoUrl: z.string().optional(),
});

// GET /api/marketplace/templates - List all templates
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: any = {
      isPrivate: false,
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy === "popular" ? { downloads: "desc" } : { [sortBy]: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              walletAddress: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.template.count({ where }),
    ]);

    // Calculate average rating for each template
    const templatesWithRating = templates.map((template: any) => {
      const avgRating =
        template.reviews.length > 0
          ? template.reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / template.reviews.length
          : 0;
      return {
        ...template,
        averageRating: avgRating,
        reviewCount: template.reviews.length,
      };
    });

    return NextResponse.json({
      templates: templatesWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}

// POST /api/marketplace/templates - Create new template
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = templateSchema.parse(body);

    const template = await prisma.template.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            walletAddress: true,
          },
        },
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}

