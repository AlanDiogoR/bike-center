import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import type { CartValidateInput, CheckoutInput } from "../schemas/product.schema.js";
import { hashCPF } from "../utils/cpf.js";

interface ItemValidation {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

/** Busca produtos no banco, valida estoque e retorna itens com preços server-side */
async function validateItemsFromDb(
  items: { id: string; quantity: number }[]
): Promise<{ valid: ItemValidation[]; itemsIndisponiveis: string[] }> {
  const ids = items.map((i) => i.id).filter(Boolean);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isActive: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const valid: ItemValidation[] = [];
  const itemsIndisponiveis: string[] = [];

  for (const item of items) {
    const product = productMap.get(item.id);
    if (!product) {
      itemsIndisponiveis.push(item.id);
      continue;
    }
    if (product.stock < item.quantity) {
      itemsIndisponiveis.push(`${item.id} (estoque insuficiente)`);
      continue;
    }
    valid.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      imageUrl: product.images?.[0],
    });
  }

  return { valid, itemsIndisponiveis };
}

export async function validateCart(req: Request, res: Response): Promise<void> {
  const body = req.body as CartValidateInput;
  const items = body?.items ?? [];
  const itemIds = items.map((i) => ({ id: i.id, quantity: i.quantity ?? 1 })).filter((i) => i.id);

  if (itemIds.length === 0) {
    res.json({ data: { valid: true, total: 0 } });
    return;
  }

  const { valid, itemsIndisponiveis } = await validateItemsFromDb(itemIds);

  if (itemsIndisponiveis.length > 0) {
    res.status(400).json({
      error: {
        code: "ITEMS_UNAVAILABLE",
        message: `Itens indisponíveis: ${itemsIndisponiveis.join(", ")}`,
        itemsIndisponiveis,
      },
    });
    return;
  }

  const total = valid.reduce((acc, i) => acc + i.price * i.quantity, 0);
  res.json({ data: { valid: true, total } });
}

export async function createCheckout(req: Request, res: Response): Promise<void> {
  const body = req.body as CheckoutInput;
  const items = body?.items ?? [];
  const itemIds = items.map((i) => ({ id: i.id, quantity: i.quantity ?? 1 })).filter((i) => i.id);
  const cpf = body?.cpf;
  let userId = body?.userId;
  const authReq = req;
  const guestEmail = body?.customerEmail;
  const shippingAddress = body?.shippingAddress;
  const paymentMethod = body?.paymentMethod;
  const notes = body?.notes;

  if (itemIds.length === 0) {
    res.status(400).json({
      error: { code: "VALIDATION_ERROR", message: "Carrinho vazio" },
    });
    return;
  }

  const { valid: validatedItems, itemsIndisponiveis } = await validateItemsFromDb(itemIds);

  if (itemsIndisponiveis.length > 0) {
    res.status(400).json({
      error: {
        code: "ITEMS_UNAVAILABLE",
        message: `Itens indisponíveis: ${itemsIndisponiveis.join(", ")}`,
        itemsIndisponiveis,
      },
    });
    return;
  }

  const subtotal = validatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  const orderItems = validatedItems.map((i) => ({
    productId: i.productId,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    imageUrl: i.imageUrl ?? "",
    total: i.price * i.quantity,
  }));

  // Validações de autorização
  if (userId && authReq.user && authReq.user.userId !== userId) {
    res.status(403).json({
      error: { code: "FORBIDDEN", message: "Não é permitido criar pedido em nome de outro usuário" },
    });
    return;
  }
  if (userId && !authReq.user) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token necessário para pedido de usuário logado" },
    });
    return;
  }
  if (authReq.user && !userId) userId = authReq.user.userId;

  const cpfForAddress = cpf ? hashCPF(String(cpf).replace(/\D/g, "")) : null;

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          guestEmail: null,
          status: "PENDING",
          subtotal,
          shipping,
          discount,
          total,
          paymentMethod: paymentMethod ?? null,
          notes: notes ?? null,
          shippingAddress: { ...(shippingAddress ?? {}), cpfHash: cpfForAddress } as object,
          items: orderItems,
        },
        include: { user: { select: { name: true, email: true } } },
      });

      res.status(201).json({
        data: {
          orderId: order.id,
          status: order.status,
          total: order.total,
          message: "Pedido criado com sucesso",
        },
      });
      return;
    }
  }

  // Pedido guest — salvar no banco
  const order = await prisma.order.create({
    data: {
      userId: null,
      guestEmail: guestEmail ?? null,
      status: "PENDING",
      subtotal,
      shipping,
      discount,
      total,
      paymentMethod: paymentMethod ?? null,
      notes: notes ?? null,
      shippingAddress: { ...(shippingAddress ?? {}), cpfHash: cpfForAddress } as object,
      items: orderItems,
    },
  });

  res.status(201).json({
    data: {
      orderId: order.id,
      status: order.status,
      total: order.total,
      message: "Pedido registrado. Pronto para integração Mercado Pago.",
    },
  });
}
