export function getCorsOrigin() {
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
    : [process.env.CORS_ORIGIN ?? "http://localhost:3000"];
  return corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins;
}
