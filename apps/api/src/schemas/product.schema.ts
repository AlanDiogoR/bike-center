import { z } from "zod";

/** Converte string vazia em undefined e trata vírgula como decimal (formato BR) */
function preprocessNum(val: unknown): unknown {
  if (val === undefined || val === null || val === "") return undefined;
  const s = String(val).trim().replace(",", ".");
  const n = Number(s);
  return isNaN(n) ? undefined : n;
}

/** Para campos obrigatórios - retorna valor processado ou mantém para gerar erro */
function preprocessNumRequired(val: unknown): unknown {
  if (val === undefined || val === null || val === "") return val;
  const s = String(val).trim().replace(",", ".");
  const n = Number(s);
  return isNaN(n) ? val : n;
}

export const productQuerySchema = z.object({
  page: z.preprocess(
    (v) => (v === "" || v === undefined ? 1 : Number(v) || 1),
    z.number().min(1)
  ),
  limit: z.preprocess(
    (v) => (v === "" || v === undefined ? 12 : Number(v) || 12),
    z.number().min(1).max(50)
  ),
  category: z.string().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  minPrice: z.preprocess(preprocessNum, z.number().min(0).optional()),
  maxPrice: z.preprocess(preprocessNum, z.number().min(0).optional()),
  search: z.string().optional().or(z.literal("")),
  isActive: z.coerce.boolean().optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug inválido"),
  description: z.string().min(10, "Descrição mínima 10 caracteres"),
  shortDescription: z.string().max(200).optional(),
  price: z.coerce.number().positive("Preço deve ser positivo"),
  compareAtPrice: z.coerce.number().positive().optional(),
  costPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).default(0),
  sku: z.string().optional(),
  brand: z.string().optional(),
  weight: z.coerce.number().min(0).optional(),
  dimensions: z.string().optional(),
  images: z.array(z.string()).default([]),
  categoryId: z.string().min(1, "Categoria obrigatória"),
  isActive: z.boolean().default(true),
});

/** Schema para multipart/form-data ou JSON - aceita ambos */
export const productCreateFormSchema = z.object({
  name: z
    .string({ required_error: "Campo 'name' é obrigatório" })
    .min(2, "Nome obrigatório"),
  slug: z
    .string({ required_error: "Campo 'slug' é obrigatório" })
    .min(2, "Slug inválido")
    .regex(/^[a-z0-9-]+$/, "Slug inválido"),
  description: z
    .string({ required_error: "Campo 'description' é obrigatório" })
    .min(10, "Descrição mínima 10 caracteres"),
  shortDescription: z.string().max(200).optional().or(z.literal("")),
  price: z.preprocess(
    preprocessNumRequired,
    z.number({ required_error: "Campo 'price' é obrigatório" }).positive("Preço deve ser positivo")
  ),
  compareAtPrice: z.preprocess(preprocessNum, z.number().positive().optional()),
  costPrice: z.preprocess(preprocessNum, z.number().min(0).optional()),
  stock: z.preprocess(
    (v) => (preprocessNum(v) ?? 0) as number,
    z.number().int().min(0)
  ),
  sku: z.string().optional().or(z.literal("")),
  brand: z.string().optional().or(z.literal("")),
  weight: z.preprocess(preprocessNum, z.number().min(0).optional()),
  dimensions: z.string().optional().or(z.literal("")),
  images: z.union([z.array(z.string()), z.string()]).optional(),
  categoryId: z
    .string({ required_error: "Campo 'categoryId' é obrigatório" })
    .min(1, "Categoria obrigatória"),
  isActive: z
    .union([z.literal("true"), z.literal("false"), z.boolean(), z.literal("")])
    .optional()
    .default("true")
    .transform((v) => v === true || v === "true"),
}).transform((data) => {
  const images = Array.isArray(data.images)
    ? data.images
    : typeof data.images === "string"
      ? [data.images]
      : [];
  return {
    ...data,
    shortDescription: data.shortDescription || undefined,
    compareAtPrice: data.compareAtPrice ?? undefined,
    costPrice: data.costPrice ?? undefined,
    sku: data.sku || undefined,
    brand: data.brand || undefined,
    weight: data.weight ?? undefined,
    dimensions: data.dimensions || undefined,
    images,
  };
});

export const productUpdateSchema = productCreateSchema.partial();

export const checkoutItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const cartValidateSchema = z.object({
  items: z.array(checkoutItemSchema),
});

import { isValidCPF } from "../utils/cpf.js";

/** Valida CPF (11 dígitos + dígitos verificadores) */
const cpfSchema = z
  .string()
  .min(11, "CPF deve ter 11 dígitos")
  .max(14, "CPF inválido")
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length === 11, "CPF deve ter 11 dígitos")
  .refine(isValidCPF, "CPF inválido (dígitos verificadores incorretos)");

export const checkoutSchema = z.object({
  items: z.array(checkoutItemSchema),
  cpf: cpfSchema,
  userId: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  shippingAddress: z
    .object({
      label: z.string(),
      street: z.string(),
      number: z.string(),
      complement: z.string().optional(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string().default("Brasil"),
    })
    .optional(),
  paymentMethod: z.enum(["PIX", "CREDIT", "DEBIT", "BOLETO"]).optional(),
  notes: z.string().optional(),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CartValidateInput = z.infer<typeof cartValidateSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
