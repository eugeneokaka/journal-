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

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const entry = await prisma.entry.findFirst({
      where: {
        id,
        userId: user.id,
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;
    const { title, content } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!title || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify user exists and get internal ID
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify ownership
    const existingEntry = await prisma.entry.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingEntry) {
      return new NextResponse("Entry not found or unauthorized", { status: 404 });
    }

    // Update entry
    const entry = await prisma.entry.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("[ENTRY_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
