import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../lib/api";
import { ProductGrid } from "../../components/ProductGrid";
import { Text, View, ScrollView } from "react-native";

export default function CatalogScreen() {
  const { category, search } = useLocalSearchParams<{ category?: string; search?: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { page: 1, limit: 20, category, search }],
    queryFn: () =>
      getProducts({
        page: 1,
        limit: 20,
        ...(category && { category }),
        ...(search && { search: search }),
      }),
  });

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        <Text className="font-heading font-bold text-xl text-brand-text uppercase tracking-wide mb-1">
          Catálogo
        </Text>
        <Text className="text-brand-neutral text-sm mb-4">
          Bicicletas, peças e acessórios
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
