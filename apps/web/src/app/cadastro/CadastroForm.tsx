"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cadastroSchema, type CadastroFormData } from "./cadastro.schema";

export function CadastroForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
  });

  async function onSubmit(data: CadastroFormData) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
      const res = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone.replace(/\D/g, ""),
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError("root", { message: json.error?.message ?? "Erro ao cadastrar" });
        return;
      }

      toast.success("Conta criada com sucesso! Faça login para continuar.");
      router.push("/login?registered=1");
    } catch {
      setError("root", { message: "Erro de conexão. Tente novamente." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <p className="text-brand-error text-sm">{errors.root.message}</p>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-brand-text mb-1">
          Nome completo
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          placeholder="Seu nome"
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-brand-error text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-brand-text mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          placeholder="seu@email.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-brand-error text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-brand-text mb-1">
          Telefone
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          placeholder="(11) 99999-9999"
          autoComplete="tel"
        />
        {errors.phone && (
          <p className="text-brand-error text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-brand-text mb-1">
          Senha
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          placeholder="Mín. 8 caracteres, 1 maiúscula, 1 número"
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="text-brand-error text-xs mt-1">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-text mb-1">
          Confirmar senha
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-brand-primary focus:border-transparent"
          placeholder="Repita a senha"
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="text-brand-error text-xs mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-brand-primary hover:bg-transparent hover:border-2 hover:border-brand-primary hover:text-brand-primary disabled:opacity-50 text-brand-primaryText font-semibold rounded-[60px] transition-colors"
      >
        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
      </button>
        <p className="text-center text-sm text-brand-text">
        Já tem conta?{" "}
        <Link href="/login" className="text-brand-primary font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
