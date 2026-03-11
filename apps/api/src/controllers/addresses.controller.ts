import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function listAddresses(req: Request, res: Response): Promise<void> {
  const userId = req.params.userId;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  res.json({ data: addresses });
}

export async function createAddress(req: Request, res: Response): Promise<void> {
  const userId = req.params.userId;
  const {
    label,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipCode,
    country,
    isDefault,
  } = req.body;

  const address = await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return tx.address.create({
      data: {
        userId,
        label,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
        country: country ?? "Brasil",
        isDefault: isDefault ?? false,
      },
    });
  });

  res.status(201).json({ data: address });
}

export async function updateAddress(req: Request, res: Response): Promise<void> {
  try {
    const { id, userId } = req.params;
    const {
      label,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      country,
      isDefault,
    } = req.body;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Endereço não encontrado" } });
      return;
    }

    const address = await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }
      const updateData: Record<string, unknown> = {};
      if (label !== undefined) updateData.label = label;
      if (street !== undefined) updateData.street = street;
      if (number !== undefined) updateData.number = number;
      if (complement !== undefined) updateData.complement = complement;
      if (neighborhood !== undefined) updateData.neighborhood = neighborhood;
      if (city !== undefined) updateData.city = city;
      if (state !== undefined) updateData.state = state;
      if (zipCode !== undefined) updateData.zipCode = zipCode;
      if (country !== undefined) updateData.country = country;
      if (isDefault !== undefined) updateData.isDefault = isDefault;
      return tx.address.update({
        where: { id },
        data: updateData,
      });
    });

    res.json({ data: address });
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Endereço não encontrado" } });
      return;
    }
    throw err;
  }
}

export async function deleteAddress(req: Request, res: Response): Promise<void> {
  try {
    const { id, userId } = req.params;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Endereço não encontrado" } });
      return;
    }

    await prisma.address.delete({ where: { id } });

    res.status(204).send();
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      res.status(404).json({ error: { code: "NOT_FOUND", message: "Endereço não encontrado" } });
      return;
    }
    throw err;
  }
}
