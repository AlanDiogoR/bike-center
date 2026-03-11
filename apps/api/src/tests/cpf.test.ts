import { describe, it, expect } from "vitest";
import { isValidCPF } from "../utils/cpf.js";

describe("isValidCPF", () => {
  it("deve aceitar CPF válido", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
    expect(isValidCPF("52998224725")).toBe(true);
  });

  it("deve aceitar outro CPF válido", () => {
    expect(isValidCPF("111.444.777-35")).toBe(true);
  });

  it("deve rejeitar CPF com dígitos verificadores errados", () => {
    expect(isValidCPF("111.444.777-99")).toBe(false);
    expect(isValidCPF("52998224799")).toBe(false);
  });

  it("deve rejeitar CPF com todos dígitos iguais", () => {
    expect(isValidCPF("111.111.111-11")).toBe(false);
    expect(isValidCPF("00000000000")).toBe(false);
  });

  it("deve rejeitar CPF com tamanho incorreto", () => {
    expect(isValidCPF("123")).toBe(false);
    expect(isValidCPF("123456789012")).toBe(false);
  });
});
