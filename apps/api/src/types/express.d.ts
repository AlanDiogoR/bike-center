declare namespace Express {
  interface Request {
    validatedBody?: unknown;
    validatedQuery?: Record<string, unknown>;
    productFormData?: Record<string, unknown>;
    user?: { userId: string; email: string; role: string };
  }
}
