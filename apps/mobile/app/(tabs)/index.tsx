import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../lib/api";
import { ProductGrid } from "../../components/ProductGrid";
import { BannerCarousel } from "../../components/BannerCarousel";
import { TrustBar } from "../../components/TrustBar";
import { Text, View, ScrollView } from "react-native";

export default function HomeScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page: 1, limit: 8 }],
    queryFn: () => getProducts({ page: 1, limit: 8 }),
  });

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="pt-2">
        <BannerCarousel />
      </View>
      <TrustBar />
      <View className="px-4 py-6">
        <Text className="font-heading font-bold text-xl text-brand-text uppercase tracking-wide mb-1">
          Destaques
        </Text>
        <Text className="text-brand-neutral text-sm mb-4">
          Mais de 30 anos no mercado
        </Text>
        {isLoading && (
          <Text className="text-brand-neutral py-4">Carregando...</Text>
        )}
        {isError && (
          <Text className="text-brand-onSale py-4">Erro ao carregar produtos</Text>
        )}
        {data?.data && <ProductGrid products={data.data} />}
      </View>
    </ScrollView>
  );
}
