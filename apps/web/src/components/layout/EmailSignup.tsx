"use client";

import { useState } from "react";

/**
 * Formulário de cadastro para email marketing (estilo Pagani Design)
 */
export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-gray-900 text-white py-12 md:py-16">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="font-heading font-bold text-xl md:text-2xl uppercase tracking-wide mb-2">
            Fique por dentro das novidades
          </h3>
          <p className="text-gray-400 text-sm md:text-base mb-6">
            Cadastre seu e-mail e receba ofertas exclusivas, lançamentos e novidades antes de todos.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={status === "loading" || status === "success"}
              className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-brand-cta hover:bg-brand-ctaHover text-white font-semibold rounded-full transition-colors disabled:opacity-70"
            >
              {status === "loading" ? "Enviando..." : status === "success" ? "Cadastrado!" : "Cadastrar"}
            </button>
          </form>
          {status === "success" && (
            <p className="mt-3 text-brand-cta text-sm">Obrigado! Você receberá nossas ofertas em breve.</p>
          )}
        </div>
      </div>
    </div>
  );
}
