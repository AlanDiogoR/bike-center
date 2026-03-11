import { useCartStore } from "../../store/cart.store";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { Minus, Plus, ShoppingBag } from "lucide-react-native";

export default function CartScreen() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCartStore();

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-8">
        <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
          <ShoppingBag size={32} color="#6b7280" strokeWidth={1.5} />
        </View>
        <Text className="font-heading font-bold text-xl text-brand-text uppercase tracking-wide mb-2">
          Carrinho vazio
        </Text>
        <Text className="text-brand-neutral mb-6 text-center">
          Adicione produtos para continuar
        </Text>
        <Link href="/(tabs)/catalog" asChild>
          <TouchableOpacity activeOpacity={0.85} className="bg-brand-cta px-8 py-3.5 rounded-full">
            <Text className="text-white font-semibold">Ver produtos</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        <Text className="font-heading font-bold text-xl text-brand-text uppercase tracking-wide mb-6">
          Carrinho ({totalItems()})
        </Text>

        {items.map((item) => (
          <View
            key={item.id}
            className="flex-row gap-4 p-4 bg-white rounded-xl mb-4 border border-gray-100"
          >
            <View className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              {item.imageUrl && (item.imageUrl.startsWith("http") || item.imageUrl.startsWith("/")) ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 justify-center items-center">
                  <Text className="text-2xl">🚴</Text>
                </View>
              )}
            </View>
            <View className="flex-1 min-w-0">
              <Text className="font-semibold text-brand-text" numberOfLines={2}>{item.name}</Text>
              <Text className="text-brand-primary font-bold mt-0.5">
                R$ {item.price.toFixed(2)}
              </Text>
              <View className="flex-row items-center gap-2 mt-3">
                <TouchableOpacity
                  onPress={() =>
                    updateQuantity(item.id, Math.max(0, item.quantity - 1))
                  }
                  activeOpacity={0.7}
                  className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center"
                >
                  <Minus size={18} color="#374151" strokeWidth={2} />
                </TouchableOpacity>
                <Text className="w-8 text-center font-medium text-base">{item.quantity}</Text>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  activeOpacity={0.7}
                  className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center"
                >
                  <Plus size={18} color="#374151" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => removeItem(item.id)}
              activeOpacity={0.7}
              className="self-start pt-1"
            >
              <Text className="text-brand-onSale text-sm font-medium">Remover</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View className="mt-6 p-5 bg-white rounded-xl border border-gray-100">
          <Text className="text-lg font-bold text-brand-text mb-4">
            Total: R$ {totalPrice().toFixed(2)}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/checkout")}
            activeOpacity={0.85}
            className="py-3.5 bg-brand-cta rounded-full"
          >
            <Text className="text-white font-semibold text-center">
              Finalizar compra
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
