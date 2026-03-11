import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger.js";

interface AppError {
  code: string;
  message: string;
  statusCode?: number;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  try {
    if (err instanceof ZodError) {
      logger.info({ msg: "Erro de validação", errors: err.errors });
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
        },
      });
      return;
    }

    const appError = err as AppError;
    const statusCode = appError?.statusCode ?? 500;
    if (statusCode >= 500) {
      logger.error({ err, msg: (err as Error)?.message });
    }
    const code = appError?.code ?? "INTERNAL_SERVER_ERROR";
    const message =
      process.env.NODE_ENV === "production"
        ? "Ocorreu um erro interno."
        : (err as Error)?.message ?? "Erro desconhecido";

    res.status(statusCode).json({
      error: { code, message },
    });
  } catch (_handlerError) {
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Falha no tratamento de erros.",
      },
    });
  }
}
