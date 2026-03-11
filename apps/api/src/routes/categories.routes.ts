import { Router, type IRouter } from "express";
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import {
  categoryQuerySchema,
  categoryCreateSchema,
  categoryUpdateSchema,
} from "../schemas/category.schema.js";

export const categoriesRouter: IRouter = Router();

categoriesRouter.get("/", validateRequest(categoryQuerySchema, "query"), asyncHandler(listCategories));
categoriesRouter.get("/:id", asyncHandler(getCategoryById));
categoriesRouter.post("/", authenticateToken, requireAdmin, validateRequest(categoryCreateSchema), asyncHandler(createCategory));
categoriesRouter.put("/:id", authenticateToken, requireAdmin, validateRequest(categoryUpdateSchema), asyncHandler(updateCategory));
categoriesRouter.delete("/:id", authenticateToken, requireAdmin, asyncHandler(deleteCategory));
