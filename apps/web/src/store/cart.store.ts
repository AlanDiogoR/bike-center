import { createCartStore } from "@bikecenter/cart-store";

export const useCartStore = createCartStore({ name: "bikecenter-cart" });
export type { CartItem } from "@bikecenter/cart-store";
