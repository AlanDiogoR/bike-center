import { useRouter } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useCartStore } from "../store/cart.store";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();

  const handleFinalize = () => {
    // TODO: Integrar com API de checkout
    clearCart();
    router.back();
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-8">
        <Text className="font-heading font-bold text-xl text-brand-text mb-4">
          Carrinho vazio
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-brand-cta px-8 py-3.5 rounded-full"
        >
          <Text className="text-white font-semibold">Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="p-4">
        <Text className="font-heading font-bold text-xl text-brand-text uppercase tracking-wide mb-6">
          Checkout
        </Text>
        <Text className="text-brand-neutral mb-4">
          Total: R$ {totalPrice().toFixed(2)}
        </Text>
        <Text className="text-sm text-gray-500 mb-6">
          Tela de checkout básica. Integração com API e formulário de endereço em desenvolvimento.
        </Text>
        <TouchableOpacity
          onPress={handleFinalize}
          activeOpacity={0.85}
          className="py-3.5 bg-brand-cta rounded-full"
        >
          <Text className="text-white font-semibold text-center">
            Confirmar pedido
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
