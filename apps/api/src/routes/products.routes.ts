import { Router, type IRouter } from "express";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { validateProductForm } from "../middlewares/validateProductForm.js";
import { uploadProductImages } from "../middlewares/upload.middleware.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import {
  productQuerySchema,
  productUpdateSchema,
} from "../schemas/product.schema.js";

export const productsRouter: IRouter = Router();

productsRouter.get("/", validateRequest(productQuerySchema, "query"), asyncHandler(listProducts));
productsRouter.get("/:id", asyncHandler(getProductById));
productsRouter.post(
  "/",
  authenticateToken,
  requireAdmin,
  (req, res, next) => {
    uploadProductImages(req, res, (err) => {
      if (err) next(err);
      else next();
    });
  },
  validateProductForm,
  asyncHandler(createProduct)
);
productsRouter.put("/:id", authenticateToken, requireAdmin, validateRequest(productUpdateSchema), asyncHandler(updateProduct));
productsRouter.delete("/:id", authenticateToken, requireAdmin, asyncHandler(deleteProduct));
