import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Entre na sua conta Bike Center",
  robots: "noindex, nofollow",
};

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-heading font-bold text-2xl text-brand-text uppercase tracking-[0.015em] mb-6">
        Entrar
      </h1>
      <Suspense fallback={<div className="animate-pulse h-40 bg-gray-100 rounded-lg" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
