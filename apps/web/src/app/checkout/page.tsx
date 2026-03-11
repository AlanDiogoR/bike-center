import type { Metadata } from "next";
import { CheckoutPage } from "./CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Finalize sua compra - Bike Center",
  robots: "noindex, nofollow",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
