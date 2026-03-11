import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";
import { ShoppingCart } from "lucide-react-native";
import type { Product } from "../lib/api";
import { useCartStore } from "../store/cart.store";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
      {products.map((item) => {
        const imageUrl = item.images?.[0] ?? "";
        const isOnSale = item.compareAtPrice != null && item.compareAtPrice > item.price;

        return (
          <View
            key={item.id}
            className="w-1/2 p-2"
            style={{ minWidth: 0 }}
          >
            <View className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <Link href={`/product/${item.id}`} asChild>
                <TouchableOpacity activeOpacity={0.9}>
                  <View className="relative aspect-square bg-gray-50">
                    {imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/")) ? (
                      <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="flex-1 justify-center items-center">
                        <Text className="text-4xl">🚴</Text>
                      </View>
                    )}
                    {isOnSale && (
                      <View className="absolute top-2 left-2 bg-brand-onSale px-2 py-0.5 rounded">
                        <Text className="text-white text-[10px] font-bold">Oferta</Text>
                      </View>
                    )}
                  </View>
                  <View className="p-3">
                    {item.category && (
                      <Text className="text-[10px] font-medium text-brand-neutral uppercase tracking-wide" numberOfLines={1}>
                        {item.category.name}
                      </Text>
                    )}
                    <Text className="font-semibold text-brand-text text-sm mt-0.5" numberOfLines={2}>
                      {item.name}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-1.5">
                      <Text className={`text-base font-bold ${isOnSale ? "text-brand-onSale" : "text-brand-text"}`}>
                        R$ {item.price.toFixed(2)}
                      </Text>
                      {isOnSale && (
                        <Text className="text-xs text-brand-neutral" style={{ textDecorationLine: "line-through" }}>
                          R$ {item.compareAtPrice!.toFixed(2)}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
              <View className="px-3 pb-3">
                <TouchableOpacity
                  onPress={() =>
                    addItem({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      imageUrl: item.images?.[0] ?? "",
                      quantity: 1,
                    })
                  }
                  activeOpacity={0.85}
                  className="flex-row items-center justify-center gap-1.5 py-2.5 bg-brand-cta rounded-full"
                >
                  <ShoppingCart size={16} color="#ffffff" strokeWidth={2} />
                  <Text className="text-white font-semibold text-sm">Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
