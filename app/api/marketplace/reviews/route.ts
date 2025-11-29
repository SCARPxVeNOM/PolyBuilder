import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  templateId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = reviewSchema.parse(body);

    // Check if user has purchased the template
    const purchase = await prisma.templatePurchase.findFirst({
      where: {
        userId: session.user.id,
        templateId: validatedData.templateId,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: "You must purchase the template before reviewing" },
        { status: 403 }
      );
    }

    // Create or update review
    const review = await prisma.templateReview.upsert({
      where: {
        userId_templateId: {
          userId: session.user.id,
          templateId: validatedData.templateId,
        },
      },
      create: {
        userId: session.user.id,
        templateId: validatedData.templateId,
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
      update: {
        rating: validatedData.rating,
        comment: validatedData.comment,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

