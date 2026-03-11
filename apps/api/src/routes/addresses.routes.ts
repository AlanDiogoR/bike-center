import { Router, type IRouter } from "express";
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addresses.controller.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { addressCreateSchema, addressUpdateSchema } from "../schemas/address.schema.js";

export const addressesRouter: IRouter = Router({ mergeParams: true });

addressesRouter.get("/", asyncHandler(listAddresses));
addressesRouter.post("/", validateRequest(addressCreateSchema), asyncHandler(createAddress));
addressesRouter.put("/:id", validateRequest(addressUpdateSchema), asyncHandler(updateAddress));
addressesRouter.delete("/:id", asyncHandler(deleteAddress));
