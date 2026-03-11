import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/store/cart.store";

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("addItem adiciona item ao carrinho", () => {
    useCartStore.getState().addItem({
      id: "1",
      name: "Bicicleta",
      price: 1000,
      imageUrl: "",
    });
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it("addItem incrementa quantidade se item já existe", () => {
    useCartStore.getState().addItem({ id: "1", name: "X", price: 10, imageUrl: "" });
    useCartStore.getState().addItem({ id: "1", name: "X", price: 10, imageUrl: "", quantity: 2 });
    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it("removeItem remove item do carrinho", () => {
    useCartStore.getState().addItem({ id: "1", name: "X", price: 10, imageUrl: "" });
    useCartStore.getState().removeItem("1");
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clearCart limpa o carrinho", () => {
    useCartStore.getState().addItem({ id: "1", name: "X", price: 10, imageUrl: "" });
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("totalItems e totalPrice calculam corretamente", () => {
    useCartStore.getState().addItem({ id: "1", name: "A", price: 100, imageUrl: "", quantity: 2 });
    useCartStore.getState().addItem({ id: "2", name: "B", price: 50, imageUrl: "" });
    expect(useCartStore.getState().totalItems()).toBe(3);
    expect(useCartStore.getState().totalPrice()).toBe(250);
  });
});
