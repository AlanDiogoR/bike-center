import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

type ValidateTarget = "body" | "query";

export function validateRequest(schema: ZodSchema, target: ValidateTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const data = target === "query" ? req.query : req.body;
      const result = schema.safeParse(data);
      if (!result.success) {
        next(result.error);
        return;
      }
      if (target === "query") {
        (req as Request & { validatedQuery: unknown }).validatedQuery = result.data;
      } else {
        req.body = result.data;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
