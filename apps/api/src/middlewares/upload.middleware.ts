import type { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";

/** Garante que a pasta de uploads existe */
const uploadsDir = path.join(process.cwd(), "uploads", "products");
fs.mkdirSync(uploadsDir, { recursive: true });

/** Tipos de imagem aceitos (validados por magic bytes) */
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const name = path.basename(file.originalname, ext).replace(/\s+/g, "-");
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    cb(null, `${name}-${unique}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo não permitido. Use: ${ALLOWED_MIMES.join(", ")}`));
  }
};

/** Aceita arquivos de imagem em qualquer campo (images, imagens, foto, etc.) */
const uploadProductImagesMulter: RequestHandler = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10,
  },
}).any();

/** Valida magic bytes reais dos arquivos após upload (file.mimetype pode ser falsificado) */
export const validateFileMagicBytes: RequestHandler = async (req, res, next) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) return next();

  const invalidFiles: string[] = [];
  for (const file of files) {
    try {
      const buffer = fs.readFileSync(file.path);
      const type = await fileTypeFromBuffer(buffer);
      if (!type || !ALLOWED_MIMES.includes(type.mime)) {
        invalidFiles.push(file.originalname);
        fs.unlinkSync(file.path);
      }
    } catch {
      invalidFiles.push(file.originalname);
      try {
        fs.unlinkSync(file.path);
      } catch {}
    }
  }

  if (invalidFiles.length > 0) {
    return res.status(400).json({
      error: {
        code: "INVALID_FILE",
        message: `Arquivos não são imagens válidas (validado por magic bytes): ${invalidFiles.join(", ")}`,
      },
    });
  }
  next();
};

/** Middleware composto: upload + validação de magic bytes */
export const uploadProductImages: RequestHandler = (req, res, next) => {
  uploadProductImagesMulter(req, res, (err) => {
    if (err) return next(err);
    validateFileMagicBytes(req, res, next);
  });
};
