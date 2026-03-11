import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
export async function listCategories(req: Request, res: Response): Promise<void> {
  const query = req.validatedQuery ?? req.query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const parentId = query.parentId;
  const isActive = query.isActive;

  const where: Record<string, unknown> = {};
  if (parentId !== undefined) where.parentId = parentId;
  if (isActive !== undefined) where.isActive = isActive;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { children: true },
    }),
    prisma.category.count({ where }),
  ]);

  res.json({
    data: categories,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function getCategoryById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const category = await prisma.category.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { children: true, products: { take: 5 } },
  });

  if (!category) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Categoria não encontrada" } });
    return;
  }

  res.json({ data: category });
}

export async function createCategory(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      slug,
      description,
      imageUrl,
      parentId,
      sortOrder,
      isActive,
    } = req.body ?? {};

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        parentId,
        sortOrder,
        isActive,
      },
    });

    res.status(201).json({ data: category });
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2002") {
      res.status(400).json({
        error: { code: "DUPLICATE", message: "Slug ou nome já existe" },
      });
      return;
    }
    throw err;
  }
}

export async function updateCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      imageUrl,
      parentId,
      sortOrder,
      isActive,
    } = req.body ?? {};

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    res.json({ data: category });
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Categoria não encontrada" } });
      return;
    }
    throw err;
  }
}

export async function deleteCategory(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.category.delete({ where: { id } });

    res.status(204).send();
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Categoria não encontrada" } });
      return;
    }
    throw err;
  }
}
