import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-11-17.clover",
  });
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { templateId, paymentMethod } = await req.json();

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        author: true,
      },
    });

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

    if (template.price === 0) {
      // Free template - just create purchase record
      const purchase = await prisma.templatePurchase.create({
        data: {
          purchaseId: `free_${Date.now()}`,
          amount: 0,
          currency: "USD",
          paymentMethod: "free",
          userId: session.user.id,
          templateId: template.id,
        },
      });

      await prisma.template.update({
        where: { id: templateId },
        data: { downloads: { increment: 1 } },
      });

      return NextResponse.json({ purchase, template });
    }

    if (paymentMethod === "stripe") {
      // Create Stripe payment intent
      const stripe = getStripe();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(template.price * 100), // Convert to cents
        currency: "usd",
        metadata: {
          templateId: template.id,
          userId: session.user.id,
          authorId: template.authorId,
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        templateId: template.id,
      });
    }

    if (paymentMethod === "crypto") {
      // Return crypto payment details (implement your crypto payment logic)
      return NextResponse.json({
        paymentAddress: template.author.walletAddress,
        amount: template.price,
        templateId: template.id,
        message: "Send payment to complete purchase",
      });
    }

    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  } catch (error) {
    console.error("Error processing purchase:", error);
    return NextResponse.json({ error: "Failed to process purchase" }, { status: 500 });
  }
}

