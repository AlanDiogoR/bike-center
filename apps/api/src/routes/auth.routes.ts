import { Router, type IRouter } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { userCreateSchema, authLoginSchema } from "../schemas/user.schema.js";

export const authRouter: IRouter = Router();

authRouter.post("/register", validateRequest(userCreateSchema), asyncHandler(register));
authRouter.post("/login", validateRequest(authLoginSchema), asyncHandler(login));
