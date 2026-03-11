import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("[FATAL] JWT_SECRET env var is required");
  return s;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token de autenticação obrigatório" },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as unknown as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({
      error: { code: "INVALID_TOKEN", message: "Token inválido ou expirado" },
    });
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Autenticação necessária" },
    });
    return;
  }
  if (req.user.role !== "ADMIN") {
    res.status(403).json({
      error: { code: "FORBIDDEN", message: "Acesso restrito a administradores" },
    });
    return;
  }
  next();
}

export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, getJwtSecret()) as unknown as JwtPayload;
      req.user = decoded;
    } catch {
      // Ignora token inválido, continua sem usuário
    }
  }
  next();
}
