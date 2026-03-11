import { z } from "zod";

const phoneRegex = /^\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/;
const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

export const userCreateSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Pelo menos uma letra minúscula")
    .regex(/\d/, "Pelo menos um número"),
  name: z.string().min(2, "Nome muito curto"),
  phone: z.string().regex(phoneRegex, "Telefone inválido. Ex: 11999999999"),
  cpf: z.string().regex(cpfRegex).optional().or(z.literal("")),
});

export const userUpdateSchema = userCreateSchema.partial().omit({ password: true }).extend({
  password: z.string().min(8).optional(),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
  search: z.string().optional(),
  role: z.enum(["CUSTOMER", "ADMIN"]).optional(),
});

export const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Senha obrigatória"),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
export type AuthLoginInput = z.infer<typeof authLoginSchema>;
