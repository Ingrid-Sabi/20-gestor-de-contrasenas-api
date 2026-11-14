import { z } from "zod";

export const registroSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "El refreshToken es requerido"),
});

export const respaldoSchema = z.object({
  blob_cifrado: z.string().min(1, "El blob cifrado es requerido"),
  version: z.number().int().min(1, "La versión debe ser un entero positivo"),
  actualizado_en: z
    .string()
    .datetime({ message: "actualizado_en debe ser fecha ISO 8601 UTC" }),
});

export const prefijoSha1Schema = z
  .string()
  .regex(
    /^[0-9A-Fa-f]{5}$/,
    "El prefijo SHA-1 debe tener exactamente 5 dígitos hexadecimales"
  );
