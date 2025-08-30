import { Router } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../prisma";
import { createProductSchema, updateProductSchema } from "../validators/product";

export const productsRouter = Router();

// Listar productos del tenant con búsqueda y paginación
productsRouter.get("/", async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSizeRaw = Number(req.query.pageSize) || Number(req.query.limit) || 10;
  const pageSize = Math.min(Math.max(1, pageSizeRaw), 100);
  const skip = (page - 1) * pageSize;

  const where = {
    tenantId: req.tenantId,
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { sku: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: pageSize }),
    prisma.product.count({ where }),
  ]);

  res.json({ items, total, page, pageSize });
});

// Crear producto
productsRouter.post("/", async (req, res) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });

  const { sku, name, price } = parsed.data;

  // Evitar duplicados por (tenant, sku)
  const exists = await prisma.product.findFirst({ where: { tenantId: req.tenantId, sku } });
  if (exists) return res.status(409).json({ error: "SKU_EXISTS", message: `SKU '${sku}' ya existe` });

  try {
    const created = await prisma.product.create({
      data: { tenantId: req.tenantId!, sku, name, price }
    });
    res.status(201).json(created);
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ error: "SKU_EXISTS", message: `SKU '${sku}' ya existe` });
    }
    throw e;
  }
});

// Actualizar
productsRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });

  // Verifica pertenencia al tenant antes de actualizar
  const found = await prisma.product.findFirst({ where: { id, tenantId: req.tenantId } });
  if (!found) return res.status(404).json({ error: "NOT_FOUND" });

  const { sku, name, price } = parsed.data;

  // Si cambia SKU, evita duplicado
  if (sku && sku !== found.sku) {
    const dupe = await prisma.product.findFirst({ where: { tenantId: req.tenantId, sku } });
    if (dupe) return res.status(409).json({ error: "SKU_EXISTS", message: `SKU '${sku}' ya existe` });
  }

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: { sku, name, price }
    });
    res.json(updated);
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ error: "SKU_EXISTS", message: `SKU '${sku}' ya existe` });
    }
    throw e;
  }
});

// Eliminar
productsRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

  // Verifica pertenencia
  const found = await prisma.product.findFirst({ where: { id, tenantId: req.tenantId } });
  if (!found) return res.status(404).json({ error: "NOT_FOUND" });

  await prisma.product.delete({ where: { id } });
  res.status(204).send();
});
