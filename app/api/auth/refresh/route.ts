import { NextResponse } from "next/server";
import { FirebaseRestError, refreshIdToken } from "@/lib/auth";
import { jsonError, jsonZodError } from "@/lib/errors";
import { refreshSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = refreshSchema.safeParse(body);
    if (!parsed.success) {
      return jsonZodError(parsed.error);
    }

    const result = await refreshIdToken(parsed.data.refreshToken);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof FirebaseRestError) {
      return jsonError(err.status, err.message);
    }
    return jsonError(500, "Error interno");
  }
}
