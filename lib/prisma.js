import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton for Next.js.
 *
 * In development, Next.js HMR creates a new module scope on every hot-reload.
 * Without this pattern each reload leaks a new PrismaClient instance and
 * exhausts the MongoDB connection pool. The singleton is stored on `global`
 * so it survives across reloads.
 *
 * In production there is no HMR so the module is instantiated once anyway,
 * but we still use this pattern so the code path is identical.
 *
 * @see https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-long-running-applications
 */

const globalForPrisma = /** @type {{ prisma?: PrismaClient }} */ (global);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
