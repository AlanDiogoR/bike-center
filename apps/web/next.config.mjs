/** @type {import('next').NextConfig} */
const apiHostname = process.env.NEXT_PUBLIC_API_HOSTNAME ?? "localhost";
const nextConfig = {
  transpilePackages: ["@bikecenter/cart-store", "@bikecenter/shared"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: apiHostname, pathname: "/uploads/**" },
      { protocol: "http", hostname: "localhost", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/uploads/**" },
    ],
  },
};

export default nextConfig;
