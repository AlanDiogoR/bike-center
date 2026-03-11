import { z } from "zod";
import { isValidCPF } from "@bikecenter/shared";

export const checkoutSchema = z.object({
  cpf: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(11, "CPF deve ter 11 dígitos"))
    .refine(isValidCPF, "CPF inválido (dígitos verificadores incorretos)"),
  email: z.string().email("E-mail inválido"),
  name: z.string().min(3, "Nome obrigatório"),
  phone: z.string().min(10, "Telefone obrigatório"),
  cep: z.string().min(8, "CEP obrigatório"),
  street: z.string().min(3, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "UF obrigatória (ex: SP)"),
  paymentMethod: z.enum(["PIX", "CREDIT", "DEBIT", "BOLETO"]),
});

export type CheckoutForm = z.infer<typeof checkoutSchema>;
