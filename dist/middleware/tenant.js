"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantMiddleware = tenantMiddleware;
const prisma_1 = require("../prisma");
async function tenantMiddleware(req, res, next) {
    const fromHeader = String(req.header("X-Tenant") || "").trim();
    const fromQuery = typeof req.query.tenant === "string" ? String(req.query.tenant).trim() : "";
    const fromEnv = String(process.env.DEFAULT_TENANT || "").trim();
    const slug = fromHeader || fromQuery || fromEnv;
    if (!slug)
        return res.status(400).json({ error: "TENANT_REQUIRED", message: "Falta cabecera X-Tenant" });
    const tenant = await prisma_1.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant)
        return res.status(404).json({ error: "TENANT_NOT_FOUND", message: `Tenant '${slug}' no existe` });
    req.tenantId = tenant.id;
    req.tenantSlug = tenant.slug;
    next();
}
