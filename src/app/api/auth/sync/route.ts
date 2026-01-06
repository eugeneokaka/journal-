import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // adjust path to your prisma client

export async function POST(req: Request) {
  try {
    const { clerkId } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
    }

    await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: { clerkId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
