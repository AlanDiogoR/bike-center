import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { authRouter } from "../routes/auth.routes.js";
import { prisma } from "../lib/prisma.js";

vi.mock("../lib/prisma.js", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRouter);

describe("POST /api/v1/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve registrar usuário com sucesso (happy path)", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue({
      id: "user-1",
      email: "test@test.com",
      name: "Test User",
      phone: "11999999999",
      role: "CUSTOMER",
      createdAt: new Date(),
    } as never);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "test@test.com",
        password: "Senha123!",
        name: "Test User",
        phone: "11999999999",
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user.email).toBe("test@test.com");
  });

  it("deve retornar 400 quando email já existe", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "existing",
      email: "test@test.com",
    } as never);

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: "test@test.com",
        password: "Senha123!",
        name: "Test",
        phone: "11999999999",
      });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/v1/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar 401 quando credenciais inválidas", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "notfound@test.com",
        password: "wrong",
      });

    expect(res.status).toBe(401);
  });
});
