import { z } from "zod";

export const orderQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  userId: z.string().optional(),
});

export const orderUpdateSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  trackingCode: z.string().optional(),
});

export type OrderQuery = z.infer<typeof orderQuerySchema>;
export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;
