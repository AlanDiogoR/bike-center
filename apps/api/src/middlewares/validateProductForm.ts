import type { Request, Response, NextFunction } from "express";
import { productCreateFormSchema } from "../schemas/product.schema.js";

export function validateProductForm(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const result = productCreateFormSchema.safeParse(req.body);
    if (!result.success) {
      const firstError = result.error.errors[0];
      next(
        new Error(
          firstError?.message ?? "Dados do produto inválidos"
        )
      );
      return;
    }
    req.productFormData = result.data as Record<string, unknown>;
    next();
  } catch (err) {
    next(err);
  }
}
