import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
// Opcional: logs en dev
// export const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
