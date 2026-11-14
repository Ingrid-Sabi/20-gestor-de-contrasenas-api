import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ErrorDetalle {
  campo: string;
  mensaje: string;
}

export function jsonError(
  status: number,
  error: string,
  detalles?: ErrorDetalle[]
): NextResponse {
  const body = detalles ? { error, detalles } : { error };
  return NextResponse.json(body, { status });
}

export function jsonZodError(err: ZodError): NextResponse {
  const detalles: ErrorDetalle[] = err.issues.map((issue) => ({
    campo: issue.path.join(".") || "body",
    mensaje: issue.message,
  }));
  return jsonError(400, "Datos inválidos", detalles);
}
