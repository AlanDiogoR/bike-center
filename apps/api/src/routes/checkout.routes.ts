import { Router, type IRouter } from "express";
import { validateCart, createCheckout } from "../controllers/checkout.controller.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { optionalAuth } from "../middlewares/auth.middleware.js";
import { cartValidateSchema, checkoutSchema } from "../schemas/product.schema.js";

export const checkoutRouter: IRouter = Router();
checkoutRouter.post("/", optionalAuth, validateRequest(checkoutSchema), asyncHandler(createCheckout));

export const cartRouter: IRouter = Router();
cartRouter.post("/validate", validateRequest(cartValidateSchema), asyncHandler(validateCart));
