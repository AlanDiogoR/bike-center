/**
 * Valida CPF pelos dígitos verificadores (algoritmo oficial da Receita Federal).
 * Aceita CPF com ou sem formatação (apenas números).
 */
export function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false; // todos dígitos iguais

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(digits[10])) return false;

  return true;
}

import crypto from "node:crypto";

/** Gera hash SHA-256 do CPF para armazenamento (não reversível) */
export function hashCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  return crypto.createHash("sha256").update(digits).digest("hex");
}
