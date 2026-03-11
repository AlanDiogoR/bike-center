import rateLimit from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  message: { error: { code: "RATE_LIMIT", message: "Muitas requisições. Tente novamente em 1 minuto." } },
});

export const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  message: { error: { code: "RATE_LIMIT", message: "Muitas tentativas. Tente novamente em 1 minuto." } },
});
