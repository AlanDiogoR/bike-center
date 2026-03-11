import type { Metadata } from "next";
import { CartPage } from "./CartPage";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Seu carrinho de compras - Bike Center",
  robots: "noindex, nofollow",
};

export default function CarrinhoPage() {
  return <CartPage />;
}
