import { Router, type IRouter } from "express";
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import { addressesRouter } from "./addresses.routes.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.middleware.js";
import { requireOwnResourceOrAdmin } from "../middlewares/requireOwnResource.js";
import { userQuerySchema, userCreateSchema, userUpdateSchema } from "../schemas/user.schema.js";

export const usersRouter: IRouter = Router();

usersRouter.use("/:userId/addresses", authenticateToken, requireOwnResourceOrAdmin, addressesRouter);

usersRouter.get("/", authenticateToken, requireAdmin, validateRequest(userQuerySchema, "query"), asyncHandler(listUsers));
usersRouter.get("/:id", authenticateToken, asyncHandler(getUserById));
usersRouter.post("/", authenticateToken, requireAdmin, validateRequest(userCreateSchema), asyncHandler(createUser));
usersRouter.put("/:id", authenticateToken, validateRequest(userUpdateSchema), asyncHandler(updateUser));
usersRouter.delete("/:id", authenticateToken, requireAdmin, asyncHandler(deleteUser));
