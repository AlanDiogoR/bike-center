import { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Link } from "expo-router";

const ANNOUNCEMENTS: { text: string; href: string }[] = [
  { text: "🚴 Promoção: Frete grátis em compras acima de R$ 199 - Aproveite!", href: "/(tabs)/catalog" },
  { text: "⚙️ Mais de 30 anos no mercado - Qualidade e confiança Bike Center", href: "/(tabs)" },
  { text: "🔧 Óleos Motul, pneus CEAT e peças - Tudo para seu equipamento", href: "/(tabs)/catalog" },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const { text, href } = ANNOUNCEMENTS[index];

  return (
    <View className="bg-brand-primary py-2 px-4" accessibilityRole="banner">
      <Link href={href as any} asChild>
        <Pressable className="active:opacity-90">
          <Text className="text-white text-center text-xs" numberOfLines={1}>
            {text}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
