import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getProduct } from "../../lib/api";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { useCartStore } from "../../store/cart.store";
import { ShoppingCart, Truck, Shield, RotateCcw, Clock } from "lucide-react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addItem = useCartStore((s) => s.addItem);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id ?? ""),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-brand-neutral">Carregando...</Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-brand-onSale text-center">Produto não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 py-3 px-5 bg-brand-primary rounded-full">
          <Text className="text-white font-semibold">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageUrl = product.images?.[0] ?? "";
  const hasComparePrice = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPercent = hasComparePrice
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="p-4" style={{ paddingTop: insets.top + 8 }}>
        <TouchableOpacity onPress={() => router.back()} className="mb-4 py-2 active:opacity-80">
          <Text className="text-brand-primary font-medium">← Voltar</Text>
        </TouchableOpacity>

        <View className="bg-white rounded-2xl overflow-hidden border border-gray-200">
          <View className="relative aspect-square bg-gray-50">
            {imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/")) ? (
              <Image
                source={{ uri: imageUrl }}
                className="w-full h-full"
                resizeMode="contain"
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-6xl">🚴</Text>
              </View>
            )}
            {hasComparePrice && (
              <View className="absolute top-3 left-3 bg-brand-onSale px-2.5 py-1 rounded-lg">
                <Text className="text-white text-sm font-bold">-{discountPercent}% OFF</Text>
              </View>
            )}
            {product.stock <= 0 && (
              <View className="absolute top-3 left-3 bg-brand-soldOut px-2.5 py-1 rounded-lg">
                <Text className="text-white text-sm font-semibold">Esgotado</Text>
              </View>
            )}
          </View>

          <View className="p-4">
            {product.category && (
              <Text className="text-brand-primary text-sm font-medium mb-1">{product.category.name}</Text>
            )}
            <Text className="font-heading font-bold text-xl text-brand-text uppercase tracking-tight mb-2">
              {product.name}
            </Text>

            <View className="flex-row flex-wrap items-center gap-2 mb-2">
              <Text className="text-2xl font-bold text-brand-text">
                R$ {product.price.toFixed(2)}
              </Text>
              {hasComparePrice && (
                <>
                  <Text className="text-base text-brand-neutral" style={{ textDecorationLine: "line-through" }}>
                    R$ {product.compareAtPrice!.toFixed(2)}
                  </Text>
                  <View className="bg-brand-onSale/15 px-2 py-0.5 rounded">
                    <Text className="text-brand-onSale text-sm font-bold">-{discountPercent}%</Text>
                  </View>
                </>
              )}
            </View>
            <Text className="text-sm text-brand-neutral mb-4">
              Impostos incluídos. Frete grátis acima de R$ 199.
            </Text>

            <TouchableOpacity
              onPress={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.images?.[0] ?? "",
                  quantity: 1,
                })
              }
              disabled={product.stock <= 0}
              activeOpacity={0.85}
              className="flex-row items-center justify-center gap-2 py-4 bg-brand-cta rounded-xl disabled:opacity-50"
            >
              <ShoppingCart size={22} color="#ffffff" strokeWidth={2} />
              <Text className="text-white font-bold text-base">
                {product.stock <= 0 ? "Esgotado" : "Adicionar ao carrinho"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row flex-wrap gap-4 mt-6 py-4 border-t border-b border-gray-100">
              <View className="flex-row items-center gap-2">
                <Truck size={18} color="#ec6e37" strokeWidth={1.5} />
                <Text className="text-sm text-brand-neutral">Frete grátis R$ 199</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Shield size={18} color="#ec6e37" strokeWidth={1.5} />
                <Text className="text-sm text-brand-neutral">Pagamento seguro</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <RotateCcw size={18} color="#ec6e37" strokeWidth={1.5} />
                <Text className="text-sm text-brand-neutral">Devolução 14 dias</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Clock size={18} color="#ec6e37" strokeWidth={1.5} />
                <Text className="text-sm text-brand-neutral">30 anos no mercado</Text>
              </View>
            </View>

            <Text className="text-brand-text leading-relaxed mt-4">
              {product.shortDescription ?? product.description}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
