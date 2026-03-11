import { View, Text } from "react-native";
import { Truck, Shield, RotateCcw, Headphones } from "lucide-react-native";

const benefits = [
  {
    icon: Truck,
    title: "Frete Grátis",
    desc: "Acima de R$ 250",
  },
  {
    icon: Shield,
    title: "Site Oficial",
    desc: "Produtos autênticos",
  },
  {
    icon: RotateCcw,
    title: "Devolução 14 dias",
    desc: "Política fácil",
  },
  {
    icon: Headphones,
    title: "Atendimento",
    desc: "Sempre à disposição",
  },
];

export function TrustBar() {
  return (
    <View className="border-y border-gray-200 bg-white py-4 px-2">
      <View className="flex-row flex-wrap justify-around gap-2">
        {benefits.map(({ icon: Icon, title, desc }) => (
          <View
            key={title}
            className="flex-1 min-w-[140px] items-center py-2 px-1"
          >
            <View className="w-10 h-10 rounded-full bg-brand-primary/10 items-center justify-center mb-1.5">
              <Icon size={20} color="#ec6e37" strokeWidth={1.5} />
            </View>
            <Text className="font-semibold text-xs text-brand-text text-center" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-[10px] text-brand-neutral text-center" numberOfLines={1}>
              {desc}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
