import { View } from "react-native";
import { Tabs } from "expo-router";
import { ShoppingCart, Home, Grid3X3 } from "lucide-react-native";
import { AnnouncementBar } from "../../components/AnnouncementBar";
import { Header } from "../../components/Header";
import { useCartStore } from "../../store/cart.store";

export default function TabLayout() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <View className="flex-1 bg-white">
      <AnnouncementBar />
      <Header />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ec6e37",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: { backgroundColor: "#ffffff" },
          tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: "Catálogo",
          tabBarIcon: ({ color, size }) => <Grid3X3 color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrinho",
          tabBarIcon: ({ color, size }) => <ShoppingCart color={color} size={size} />,
          tabBarBadge: totalItems() > 0 ? totalItems() : undefined,
        }}
      />
      </Tabs>
    </View>
  );
}
