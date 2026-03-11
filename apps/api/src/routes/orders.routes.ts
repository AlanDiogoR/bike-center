import { Router, type IRouter } from "express";
import { listOrders, getOrderById, updateOrder } from "../controllers/orders.controller.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import { orderQuerySchema, orderUpdateSchema } from "../schemas/order.schema.js";

export const ordersRouter: IRouter = Router();

ordersRouter.get("/", authenticateToken, validateRequest(orderQuerySchema, "query"), asyncHandler(listOrders));
ordersRouter.get("/:id", authenticateToken, asyncHandler(getOrderById));
ordersRouter.put("/:id", authenticateToken, requireAdmin, validateRequest(orderUpdateSchema), asyncHandler(updateOrder));
