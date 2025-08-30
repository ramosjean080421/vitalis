import { Router } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../prisma";
import { z } from "zod";

export const tenantsRouter = Router();

tenantsRouter.get("/", async (_req, res) => {
  const items = await prisma.tenant.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

tenantsRouter.post("/", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/)
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "VALIDATION_ERROR", details: parsed.error.flatten() });

  const { name, slug } = parsed.data;

  try {
    const created = await prisma.tenant.create({ data: { name, slug } });
    res.status(201).json(created);
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return res.status(409).json({ error: "SLUG_EXISTS", message: `El slug '${slug}' ya existe` });
    }
    throw e;
  }
});
