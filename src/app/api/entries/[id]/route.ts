import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const entry = await prisma.entry.findUnique({
      where: {
        id,
        user: {
          clerkId: userId,
        },
      },
    });

    if (!entry) {
      return new NextResponse("Entry not found", { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error("[ENTRY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
