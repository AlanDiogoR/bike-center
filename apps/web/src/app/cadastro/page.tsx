import type { Metadata } from "next";
import { CadastroForm } from "./CadastroForm";

export const metadata: Metadata = {
  title: "Cadastro",
  description: "Crie sua conta na Bike Center",
  robots: "noindex, nofollow",
};

export default function CadastroPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-heading font-bold text-2xl text-brand-text uppercase tracking-[0.015em] mb-6">
        Crie sua conta
      </h1>
      <CadastroForm />
    </div>
  );
}
