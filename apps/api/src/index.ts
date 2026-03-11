import express from "express";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import { prisma } from "./lib/prisma.js";
import { logger } from "./lib/logger.js";
import { getCorsOrigin, generalLimiter, authLimiter } from "./config/index.js";
import { authRouter } from "./routes/auth.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { categoriesRouter } from "./routes/categories.routes.js";
import { ordersRouter } from "./routes/orders.routes.js";
import { checkoutRouter, cartRouter } from "./routes/checkout.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT ?? 3333;

app.use((pinoHttp as (opts: object) => express.RequestHandler)({ logger }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: getCorsOrigin() }));
app.use(compression());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/v1/health", async (_req, res) => {
  try {
    await prisma.$runCommandRaw({ ping: 1 });
    res.json({
      data: {
        status: "ok",
        db: "connected",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      },
    });
  } catch {
    res.status(503).json({
      data: { status: "degraded", db: "disconnected" },
    });
  }
});

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/users", generalLimiter, usersRouter);
app.use("/api/v1/products", generalLimiter, productsRouter);
app.use("/api/v1/categories", generalLimiter, categoriesRouter);
app.use("/api/v1/orders", generalLimiter, ordersRouter);
app.use("/api/v1/cart", generalLimiter, cartRouter);
app.use("/api/v1/checkout", generalLimiter, checkoutRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Bike Center API rodando em http://localhost:${PORT}`);
});
