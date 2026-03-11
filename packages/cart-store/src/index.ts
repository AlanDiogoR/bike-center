import { create } from "zustand";
import { persist, type PersistOptions, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

interface CreateCartStoreOptions {
  name: string;
  storage?: PersistOptions<CartState>["storage"];
}

export { createJSONStorage };

export function createCartStore(options: CreateCartStoreOptions) {
  const { name, storage } = options;

  const useCartStore = create<CartState>()(
    persist(
      (set, get) => ({
        items: [],

        addItem: (item) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            const qty = item.quantity ?? 1;
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
                ),
              };
            }
            return {
              items: [
                ...state.items,
                { ...item, quantity: qty, imageUrl: item.imageUrl ?? "" },
              ],
            };
          }),

        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((i) => i.id !== id),
          })),

        updateQuantity: (id, quantity) =>
          set((state) => {
            if (quantity <= 0) {
              return { items: state.items.filter((i) => i.id !== id) };
            }
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity } : i
              ),
            };
          }),

        clearCart: () => set({ items: [] }),

        totalItems: () =>
          get().items.reduce((acc, i) => acc + i.quantity, 0),

        totalPrice: () =>
          get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      }),
      storage ? { name, storage } : { name }
    )
  );

  return useCartStore;
}
