"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { toast } from "sonner";
import { checkoutSchema, type CheckoutForm } from "./checkout.schema";
import { formatCpf, formatCep, formatPhone, fetchCep } from "./checkout.utils";

export function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "PIX",
      state: "SP",
    },
  });

  if (items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="font-heading font-bold text-xl mb-4">Carrinho vazio</h2>
        <p className="text-brand-text mb-6">Adicione produtos para finalizar a compra.</p>
        <Link href="/produtos" className="text-brand-primary font-semibold hover:underline">
          Ver produtos
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
      const { getAuthHeaders, getUser } = await import("@/lib/auth");
      const user = getUser();
      const headers: Record<string, string> = { "Content-Type": "application/json", ...getAuthHeaders() };
      const res = await fetch(`${API_URL}/api/v1/checkout`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            imageUrl: i.imageUrl || "",
          })),
          cpf: data.cpf.replace(/\D/g, ""),
          customerEmail: data.email,
          customerName: data.name,
          customerPhone: data.phone.replace(/\D/g, ""),
          shippingAddress: {
            label: "Casa",
            street: data.street,
            number: data.number,
            complement: data.complement,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            zipCode: data.cep.replace(/\D/g, ""),
            country: "Brasil",
          },
          paymentMethod: data.paymentMethod,
          ...(user ? { userId: user.id } : {}),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? "Erro ao processar");

      clearCart();
      toast.success("Pedido realizado! Em breve entraremos em contato.");
      router.push("/");

      // TODO: Integração Mercado Pago
      // - Usar orderId e total do response
      // - Redirecionar para preference_url do Mercado Pago ou abrir checkout MP
      // - Exemplo: window.location.href = preference.init_point;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao finalizar compra");
    }
  };

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 py-12">
      <nav className="mb-8 text-sm">
        <Link href="/" className="text-gray-500 hover:text-brand-primary">Início</Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link href="/carrinho" className="text-gray-500 hover:text-brand-primary">Carrinho</Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-brand-text font-medium">Checkout</span>
      </nav>

      <h1 className="font-heading font-bold text-2xl md:text-3xl uppercase tracking-[0.015em] mb-8">
        Finalizar compra
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Dados pessoais</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Nome completo *</label>
                <input
                  {...register("name")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="João Silva"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">CPF *</label>
                <input
                  {...register("cpf")}
                  onChange={(e) => setValue("cpf", formatCpf(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {errors.cpf && <p className="text-red-500 text-xs mt-1">{errors.cpf.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">E-mail *</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="email@exemplo.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Telefone *</label>
                <input
                  {...register("phone")}
                  onChange={(e) => setValue("phone", formatPhone(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="(14) 99999-9999"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-4">Endereço de entrega</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">CEP *</label>
                <input
                  {...register("cep")}
                  onChange={(e) => setValue("cep", formatCep(e.target.value))}
                  onBlur={async (e) => {
                    const cep = e.target.value.replace(/\D/g, "");
                    if (cep.length === 8) {
                      const data = await fetchCep(cep);
                      if (data) {
                        setValue("street", data.street);
                        setValue("neighborhood", data.neighborhood);
                        setValue("city", data.city);
                        setValue("state", data.state);
                      }
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="12345-678"
                  maxLength={9}
                />
                <p className="text-xs text-gray-500 mt-0.5">Digite o CEP para preencher automaticamente</p>
                {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Rua *</label>
                <input
                  {...register("street")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="Rua das Flores"
                />
                {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Número *</label>
                <input
                  {...register("number")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="123"
                />
                {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Complemento</label>
                <input
                  {...register("complement")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="Apto 45"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Bairro *</label>
                <input
                  {...register("neighborhood")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="Centro"
                />
                {errors.neighborhood && <p className="text-red-500 text-xs mt-1">{errors.neighborhood.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">Cidade *</label>
                <input
                  {...register("city")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  placeholder="Fartura"
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">UF *</label>
                <input
                  {...register("state")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none uppercase"
                  placeholder="SP"
                  maxLength={2}
                />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Forma de pagamento</h2>
            <p className="text-sm text-gray-600 mb-4">
              Pagamento via Mercado Pago (em breve)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { value: "PIX" as const, label: "PIX", color: "bg-[#32BCAD]" },
                { value: "CREDIT" as const, label: "Cartão Crédito", color: "bg-[#1A1F71]" },
                { value: "DEBIT" as const, label: "Cartão Débito", color: "bg-[#EB001B]" },
                { value: "BOLETO" as const, label: "Boleto", color: "bg-[#004CA3]" },
              ].map(({ value, label, color }) => (
                <label
                  key={value}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    watch("paymentMethod") === value
                      ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/30"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input type="radio" {...register("paymentMethod")} value={value} className="sr-only" />
                  <span className={`w-10 h-7 rounded ${color} flex items-center justify-center text-white text-xs font-bold`}>
                    {value}
                  </span>
                  <span className="font-medium text-sm text-center">{label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="font-semibold text-lg mb-4">Resumo do pedido</h3>
            <ul className="space-y-3 mb-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    {item.imageUrl && (item.imageUrl.startsWith("http") || item.imageUrl.startsWith("/")) ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" unoptimized={item.imageUrl.startsWith("http")} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🚴</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-gray-600 text-xs">{item.quantity}x R$ {item.price.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4">
              <p className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>R$ {totalPrice().toFixed(2)}</span>
              </p>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-4 bg-brand-cta hover:bg-brand-ctaHover disabled:opacity-50 text-white font-semibold rounded-full transition-colors"
            >
              {isSubmitting ? "Processando..." : "Confirmar pedido"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
