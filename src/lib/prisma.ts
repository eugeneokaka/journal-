import { PrismaClient } from "../../generated/prisma/client"; // adjust if your client path is different

// Prevent multiple instances during development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // optional, helpful during development
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
