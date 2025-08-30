"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
// Opcional: logs en dev
// export const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });
