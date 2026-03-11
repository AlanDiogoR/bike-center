import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";
import { isValidCPF, hashCPF } from "../utils/cpf.js";

function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("[FATAL] JWT_SECRET env var is required");
  return s;
}
const JWT_EXPIRES_IN = "7d";

export async function register(req: Request, res: Response): Promise<void> {
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
    if (digits.length === 11) {
      if (!isValidCPF(digits)) {
        res.status(400).json({
          error: { code: "INVALID_CPF", message: "CPF inválido" },
        });
        return;
      }
      cpfHashVal = hashCPF(digits);
    }
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

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );
  res.status(201).json({ data: { user, token } });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    logger.warn({
      msg: "Tentativa de login falhou — usuário não encontrado",
      email,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    res.status(401).json({
      error: { code: "INVALID_CREDENTIALS", message: "Email ou senha inválidos" },
    });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    logger.warn({
      msg: "Tentativa de login falhou — senha incorreta",
      email,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    res.status(401).json({
      error: { code: "INVALID_CREDENTIALS", message: "Email ou senha inválidos" },
    });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    getJwtSecret(),
    { expiresIn: JWT_EXPIRES_IN }
  );
  res.json({
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      token,
      message: "Login realizado com sucesso",
    },
  });
}
