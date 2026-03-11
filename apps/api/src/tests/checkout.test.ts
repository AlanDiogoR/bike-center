import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { checkoutRouter } from "../routes/checkout.routes.js";
import { prisma } from "../lib/prisma.js";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
    order: {
      create: vi.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use("/api/v1/checkout", checkoutRouter);

describe("Checkout - validação de preço server-side", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve usar preço do banco, ignorando preço do body", async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([
      {
        id: "prod-1",
        name: "Bicicleta",
        price: 1500,
        stock: 10,
        images: [],
        isActive: true,
      } as never,
    ]);

    vi.mocked(prisma.order.create).mockResolvedValue({
      id: "order-1",
      total: 1500,
      status: "PENDING",
    } as never);

    const res = await request(app)
      .post("/api/v1/checkout")
      .send({
        items: [
          { id: "prod-1", name: "Bicicleta", price: 0.01, quantity: 1, imageUrl: "" },
        ],
        cpf: "52998224725",
        customerEmail: "guest@test.com",
        shippingAddress: {
          label: "Casa",
          street: "Rua Teste",
          number: "1",
          neighborhood: "Centro",
          city: "SP",
          state: "SP",
          zipCode: "01000000",
          country: "Brasil",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.data.orderId).toBe("order-1");
    expect(res.body.data.total).toBe(1500);
    const createCall = vi.mocked(prisma.order.create).mock.calls[0];
    const items = createCall[0].data.items as { price: number }[];
    expect(items[0].price).toBe(1500);
  });

  it("deve retornar 400 quando item não existe ou sem estoque", async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([]);

    const res = await request(app)
      .post("/api/v1/checkout")
      .send({
        items: [
          { id: "prod-inexistente", name: "X", price: 1, quantity: 1, imageUrl: "" },
        ],
        cpf: "52998224725",
        customerEmail: "guest@test.com",
      });

    expect(res.status).toBe(400);
    expect(res.body.error?.code).toBe("ITEMS_UNAVAILABLE");
  });
});
