import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";

/**
 * Garante que o usuário autenticado só acesse seus próprios recursos (userId nos params)
 * Admins podem acessar qualquer recurso.
 */
export function requireOwnResourceOrAdmin(
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
  const resourceUserId = req.params.userId;
  if (req.user.role === "ADMIN" || req.user.userId === resourceUserId) {
    next();
    return;
  }
  res.status(403).json({
    error: { code: "FORBIDDEN", message: "Acesso negado a este recurso" },
  });
}
