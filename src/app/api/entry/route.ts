import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
/// this creates an entry
export async function POST(req: Request) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { title, content } = await req.json();

    // Ensure user exists in our DB
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        // Fallback names if not present
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
      },
    });

    const entry = await prisma.entry.create({
      data: {
        title: title || "Untitled", // Schema requires title
        content,
        userId: dbUser.id,
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("[ENTRY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
