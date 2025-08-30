import { Router } from "express";
import { prisma } from "../prisma";
import { createProductSchema, updateProductSchema } from "../validators/product";

export const productsRouter = Router();

// Listar productos del tenant
productsRouter.get("/", async (req, res) => {
  const items = await prisma.product.findMany({
    where: { tenantId: req.tenantId },
    orderBy: { createdAt: "desc" }
  });
  res.json(items);
});

// Crear producto
productsRouter.post("/", async (req, res) => {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });

  const { sku, name, price } = parsed.data;

  // Evitar duplicados por (tenant, sku)
  const exists = await prisma.product.findFirst({ where: { tenantId: req.tenantId, sku } });
  if (exists) return res.status(409).json({ error: "SKU_EXISTS", message: `SKU '${sku}' ya existe` });

  const created = await prisma.product.create({
    data: { tenantId: req.tenantId!, sku, name, price }
  });
  res.status(201).json(created);
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

  const updated = await prisma.product.update({
    where: { id },
    data: { sku, name, price }
  });
  res.json(updated);
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
