"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantsRouter = void 0;
const express_1 = require("express");
const library_1 = require("@prisma/client/runtime/library");
const prisma_1 = require("../prisma");
const zod_1 = require("zod");
exports.tenantsRouter = (0, express_1.Router)();
exports.tenantsRouter.get("/", async (_req, res) => {
    const items = await prisma_1.prisma.tenant.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
});
exports.tenantsRouter.post("/", async (req, res) => {
    const schema = zod_1.z.object({
        name: zod_1.z.string().min(1),
        slug: zod_1.z.string().min(1).regex(/^[a-z0-9-]+$/)
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });
    const { name, slug } = parsed.data;
    try {
        const created = await prisma_1.prisma.tenant.create({ data: { name, slug } });
        res.status(201).json(created);
    }
    catch (e) {
        if (e instanceof library_1.PrismaClientKnownRequestError && e.code === "P2002") {
            return res.status(409).json({ error: "SLUG_EXISTS", message: `El slug '${slug}' ya existe` });
        }
        throw e;
    }
});
