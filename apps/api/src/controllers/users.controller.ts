import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { isValidCPF, hashCPF } from "../utils/cpf.js";

export async function listUsers(req: Request, res: Response): Promise<void> {
  const query = req.validatedQuery ?? req.query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = query.search as string | undefined;
  const role = query.role as string | undefined;

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { email: { contains: search } },
      { name: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  res.json({ data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const authReq = req;
  const isAdmin = authReq.user?.role === "ADMIN";
  const isSelf = authReq.user?.userId === id;

  if (!isAdmin && !isSelf) {
    res.status(403).json({ error: { code: "FORBIDDEN", message: "Acesso negado" } });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      cpfHash: true,
      role: true,
      createdAt: true,
      addresses: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Usuário não encontrado" } });
    return;
  }

  const data = { ...user };
  if (!isAdmin && !isSelf) delete (data as Record<string, unknown>).cpfHash;
  res.json({ data });
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { email, password, name, phone, cpf } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({
      error: { code: "EMAIL_TAKEN", message: "Email já cadastrado" },
    });
    return;
  }

  let cpfHashVal: string | null = null;
  if (cpf) {
    const digits = String(cpf).replace(/\D/g, "");
    if (digits.length === 11 && !isValidCPF(digits)) {
      res.status(400).json({
        error: { code: "INVALID_CPF", message: "CPF inválido" },
      });
      return;
    }
    cpfHashVal = hashCPF(digits);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
      cpfHash: cpfHashVal,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  res.status(201).json({ data: user });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const body = req.body;
    const authReq = req;
    const isAdmin = authReq.user?.role === "ADMIN";
    const isSelf = authReq.user?.userId === id;

    if (!isAdmin && !isSelf) {
      res.status(403).json({ error: { code: "FORBIDDEN", message: "Acesso negado" } });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (body.name) updateData.name = body.name;
    if (body.phone) updateData.phone = body.phone;
    if (body.cpf !== undefined) {
      const digits = String(body.cpf).replace(/\D/g, "");
      if (digits.length === 11 && !isValidCPF(digits)) {
        res.status(400).json({ error: { code: "INVALID_CPF", message: "CPF inválido" } });
        return;
      }
      updateData.cpfHash = digits.length === 11 ? hashCPF(digits) : null;
    }
    if (isAdmin && body.role) updateData.role = body.role;
    if (body.password) updateData.password = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        updatedAt: true,
      },
    });

    res.json({ data: user });
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Usuário não encontrado" } });
      return;
    }
    throw err;
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    res.status(204).send();
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Usuário não encontrado" } });
      return;
    }
    throw err;
  }
}
