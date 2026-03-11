import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
export async function listOrders(req: Request, res: Response): Promise<void> {
  const query = req.validatedQuery ?? req.query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = query.status;
  const userId = query.userId;
  const authReq = req;
  const isAdmin = authReq.user?.role === "ADMIN";

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (userId && isAdmin) where.userId = userId;
  if (!isAdmin) where.userId = authReq.user!.userId;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  res.json({
    data: orders,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const authReq = req;
  const isAdmin = authReq.user?.role === "ADMIN";

  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true, phone: true } } },
  });

  if (!order) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Pedido não encontrado" } });
    return;
  }
  if (!isAdmin && order.userId !== authReq.user!.userId) {
    res.status(403).json({ error: { code: "FORBIDDEN", message: "Acesso negado" } });
    return;
  }

  res.json({ data: order });
}

export async function updateOrder(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, trackingCode } = req.body ?? {};

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (trackingCode !== undefined) updateData.trackingCode = trackingCode;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.json({ data: order });
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Pedido não encontrado" } });
      return;
    }
    throw err;
  }
}
