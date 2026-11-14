import { NextResponse } from "next/server";
import { verifyBearerToken } from "@/lib/auth";
import { jsonError } from "@/lib/errors";

export async function GET(request: Request): Promise<NextResponse> {
  const usuario = await verifyBearerToken(request);
  if (!usuario) {
    return jsonError(401, "No autorizado");
  }
  return NextResponse.json({ usuario }, { status: 200 });
}
