import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      tenantSlug?: string;
    }
  }
}

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const slug = String(req.header("X-Tenant") || "").trim();
  if (!slug) return res.status(400).json({ error: "TENANT_REQUIRED", message: "Falta cabecera X-Tenant" });

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return res.status(404).json({ error: "TENANT_NOT_FOUND", message: `Tenant '${slug}' no existe` });

  req.tenantId = tenant.id;
  req.tenantSlug = tenant.slug;
  next();
}
