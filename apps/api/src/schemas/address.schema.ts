import { z } from "zod";

const cepRegex = /^\d{5}-?\d{3}$/;

export const addressCreateSchema = z.object({
  label: z.string().min(2, "Label obrigatório"),
  street: z.string().min(2, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "UF com 2 letras"),
  zipCode: z.string().regex(cepRegex, "CEP inválido. Ex: 01310-100"),
  country: z.string().default("Brasil"),
  isDefault: z.boolean().default(false),
});

export const addressUpdateSchema = addressCreateSchema.partial();

export type AddressCreateInput = z.infer<typeof addressCreateSchema>;
export type AddressUpdateInput = z.infer<typeof addressUpdateSchema>;
