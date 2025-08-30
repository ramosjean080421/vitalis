"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("./prisma");
const tenant_1 = require("./middleware/tenant");
const products_1 = require("./routes/products");
const tenants_1 = require("./routes/tenants");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Healthchecks
app.get("/health", (_req, res) => res.json({ status: "ok", service: "VITALIS", version: "0.1.0" }));
app.get("/db/health", async (_req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.json({ db: "ok" });
    }
    catch (e) {
        res.status(500).json({ db: "error", detail: String(e) });
    }
});
// Tenants (no requieren X-Tenant)
app.use("/tenants", tenants_1.tenantsRouter);
// A partir de aqui, exigir X-Tenant
app.use(tenant_1.tenantMiddleware);
// Products (ligados al tenant)
app.use("/products", products_1.productsRouter);
// 404
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));
// Error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "INTERNAL_ERROR" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VITALIS listo en http://localhost:${PORT}`));
