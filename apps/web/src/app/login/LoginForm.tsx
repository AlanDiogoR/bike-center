"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const registered = searchParams.get("registered") === "1";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
      const res = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setError("root", { message: json.error?.message ?? "Erro ao entrar" });
        return;
      }

      if (json.data?.user && json.data?.token) {
        setAuth(json.data.token, json.data.user);
      }
      toast.success("Login realizado com sucesso!");
      router.push("/");
    } catch {
      setError("root", { message: "Erro de conexão. Tente novamente." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {registered && (
        <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">
          Cadastro realizado! Faça login para continuar.
        </p>
      )}
      {errors.root && (
        <p className="text-brand-error text-sm">{errors.root.message}</p>
      )}
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
        />
        {errors.email && (
          <p className="text-brand-error text-xs mt-1">{errors.email.message}</p>
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
        />
        {errors.password && (
          <p className="text-brand-error text-xs mt-1">{errors.password.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-brand-primary hover:bg-transparent hover:border-2 hover:border-brand-primary hover:text-brand-primary disabled:opacity-50 text-brand-primaryText font-semibold rounded-[60px] transition-colors"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
        <p className="text-center text-sm text-brand-text">
        Não tem conta?{" "}
        <Link href="/cadastro" className="text-brand-primary font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
