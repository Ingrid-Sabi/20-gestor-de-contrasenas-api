import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    servicio: "20-gestor-de-contrasenas-api",
    servidor_ahora: new Date().toISOString(),
  });
}
