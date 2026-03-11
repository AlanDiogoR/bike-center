import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { expandSearchTerms } from "../lib/search-utils.js";
export async function listProducts(req: Request, res: Response): Promise<void> {
  const query = req.validatedQuery ?? req.query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;
  const categorySlug = typeof query.category === "string" ? query.category : undefined;
  const categoryId = typeof query.categoryId === "string" ? query.categoryId : undefined;
  const minPrice = query.minPrice != null ? Number(query.minPrice) : undefined;
  const maxPrice = query.maxPrice != null ? Number(query.maxPrice) : undefined;
  const search = typeof query.search === "string" ? query.search.trim() : undefined;
  const isActive = query.isActive !== undefined ? Boolean(query.isActive) : undefined;

  const where: Record<string, unknown> = {};

  if (categorySlug) {
    where.category = { slug: categorySlug };
  } else if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice != null || maxPrice != null) {
    where.price = {};
    if (minPrice != null) (where.price as Record<string, number>).gte = minPrice;
    if (maxPrice != null) (where.price as Record<string, number>).lte = maxPrice;
  }

  if (search) {
    const terms = expandSearchTerms(search);
    const orConditions = terms.flatMap((term) => [
      { name: { contains: term } },
      { description: { contains: term } },
      { sku: { contains: term } },
      { brand: { contains: term } },
    ]);
    where.OR = orConditions;
  }

  if (isActive !== undefined) where.isActive = isActive;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    data: products,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

const OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/;

export async function getProductById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const where = OBJECT_ID_REGEX.test(id)
    ? { OR: [{ id }, { slug: id }] }
    : { slug: id };
  const product = await prisma.product.findFirst({
    where,
    include: { category: { select: { name: true, slug: true } } },
  });

  if (!product) {
    res.status(404).json({
      error: { code: "NOT_FOUND", message: "Produto não encontrado" },
    });
    return;
  }

  res.json({ data: product });
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const formData = req.productFormData;
    const body = formData ?? req.body;

    const files = req.files as Express.Multer.File[] | undefined;
    const port = process.env.PORT ?? 3333;
    const baseUrl = process.env.API_URL ?? `http://localhost:${port}`;
    const imageUrls =
      files && files.length > 0
        ? files.map((f) => `${baseUrl}/uploads/products/${f.filename}`)
        : Array.isArray(body?.images)
          ? body.images
          : [];

    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      compareAtPrice,
      costPrice,
      stock,
      sku,
      brand,
      weight,
      dimensions,
      categoryId,
      isActive,
    } = body ?? {};

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price,
        compareAtPrice,
        costPrice,
        stock,
        sku,
        brand,
        weight,
        dimensions,
        images: imageUrls,
        categoryId,
        isActive,
      },
      include: { category: { select: { name: true, slug: true } } },
    });

    res.status(201).json({ data: product });
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2002") {
      res.status(400).json({
        error: { code: "DUPLICATE", message: "Slug ou SKU já existe" },
      });
      return;
    }
    throw err;
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      shortDescription,
      price,
      compareAtPrice,
      costPrice,
      stock,
      sku,
      brand,
      weight,
      dimensions,
      images,
      categoryId,
      isActive,
    } = req.body ?? {};

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription;
    if (price !== undefined) updateData.price = price;
    if (compareAtPrice !== undefined) updateData.compareAtPrice = compareAtPrice;
    if (costPrice !== undefined) updateData.costPrice = costPrice;
    if (stock !== undefined) updateData.stock = stock;
    if (sku !== undefined) updateData.sku = sku;
    if (brand !== undefined) updateData.brand = brand;
    if (weight !== undefined) updateData.weight = weight;
    if (dimensions !== undefined) updateData.dimensions = dimensions;
    if (images !== undefined) updateData.images = images;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (isActive !== undefined) updateData.isActive = isActive;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: { select: { name: true, slug: true } } },
    });

    res.json({ data: product });
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Produto não encontrado" },
      });
      return;
    }
    throw err;
  }
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id } });

    res.status(204).send();
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Produto não encontrado" },
      });
      return;
    }
    throw err;
  }
}
