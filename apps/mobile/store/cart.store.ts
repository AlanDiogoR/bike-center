import AsyncStorage from "@react-native-async-storage/async-storage";
import { createCartStore, createJSONStorage } from "@bikecenter/cart-store";

export const useCartStore = createCartStore({
  name: "bikecenter-cart-mobile",
  storage: createJSONStorage(() => AsyncStorage),
});
export type { CartItem } from "@bikecenter/cart-store";
