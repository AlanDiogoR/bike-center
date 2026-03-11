import { View, Image, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = 200;

const BANNERS: { uri: string; params: Record<string, string> }[] = [
  {
    uri: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&q=80",
    params: { category: "bicicletas" },
  },
  {
    uri: "https://api.motulexpert.com.br/uploads/destaque/motul111829ngen-5-10w-40-4t-1lnew-1-efc91.png",
    params: { search: "motul" },
  },
  {
    uri: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
    params: { search: "pneu" },
  },
];

export function BannerCarousel() {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {BANNERS.map((banner, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => {
            const params = new URLSearchParams(banner.params);
            const qs = params.toString();
            router.push(`/(tabs)/catalog${qs ? `?${qs}` : ""}` as any);
          }}
          activeOpacity={1}
          style={{ width: width - 32, marginRight: i < BANNERS.length - 1 ? 16 : 0 }}
          className="rounded-xl overflow-hidden bg-gray-900"
        >
          <Image
            source={{ uri: banner.uri }}
            style={{ width: width - 32, height: BANNER_HEIGHT }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
