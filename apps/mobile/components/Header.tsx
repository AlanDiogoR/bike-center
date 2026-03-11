import { View, Text, Pressable } from "react-native";
import { Link, useRouter } from "expo-router";
import { ShoppingCart, Search } from "lucide-react-native";
import { useCartStore } from "../store/cart.store";

export function Header() {
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <View className="bg-brand-headerBg border-b border-gray-800 px-4 py-3 flex-row items-center justify-between min-h-[56px]">
      <Link href="/(tabs)" asChild>
        <Pressable className="flex-row items-center gap-2 active:opacity-90">
          <View className="w-10 h-10 rounded overflow-hidden bg-white justify-center items-center">
            <Text className="text-2xl">🚴</Text>
          </View>
          <Text className="font-heading font-bold text-sm text-white uppercase tracking-wide">
            BIKE CENTER
          </Text>
        </Pressable>
      </Link>

      <View className="flex-row items-center gap-1">
        <Pressable
          onPress={() => router.push("/(tabs)/catalog")}
          className="p-2.5 active:opacity-80"
          accessibilityLabel="Buscar produtos"
        >
          <Search size={22} color="#e5e7eb" />
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tabs)/cart")}
          className="p-2.5 relative active:opacity-80"
          accessibilityLabel={`Carrinho com ${totalItems()} itens`}
        >
          <ShoppingCart size={22} color="#e5e7eb" />
          {totalItems() > 0 && (
            <View className="absolute -top-0.5 -right-0.5 bg-brand-primary min-w-[18px] h-[18px] rounded-full items-center justify-center">
              <Text className="text-white text-[10px] font-bold">
                {totalItems() > 99 ? "99+" : totalItems()}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}
