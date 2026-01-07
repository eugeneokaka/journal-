import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // Keeping POST for consistency if we wanted to expand, but for fetching GET is more appropriate.
  // However, the user asked for "create an api", usually implies a new endpoint.
  // Let's stick to GET for fetching data.
  return new NextResponse("Method not allowed", { status: 405 });
}

export async function GET(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam) : undefined;

  try {
    const entries = await prisma.entry.findMany({
      where: {
        user: {
          clerkId: userId,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("[ENTRIES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
