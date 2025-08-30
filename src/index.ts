import express from "express";
import { prisma } from "./prisma";
import { tenantMiddleware } from "./middleware/tenant";
import { productsRouter } from "./routes/products";
import { tenantsRouter } from "./routes/tenants";
import cors from "cors";

const app = express();
app.use(express.json());
import cors from "cors";

// Healthchecks
app.get("/health", (_req, res) => res.json({ status: "ok", service: "VITALIS", version: "0.1.0" }));
app.get("/db/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ db: "ok" });
  } catch (e) {
    res.status(500).json({ db: "error", detail: String(e) });
  }
});

// Tenants (no requieren X-Tenant)
app.use("/tenants", tenantsRouter);

// A partir de aquí, exigir X-Tenant
app.use(tenantMiddleware);

// Products (ligados al tenant)
app.use("/products", productsRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "INTERNAL_ERROR" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ VITALIS listo en http://localhost:${PORT}`));
