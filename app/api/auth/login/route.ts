import { NextResponse } from "next/server";
import { FirebaseRestError, signInWithEmail } from "@/lib/auth";
import { jsonError, jsonZodError } from "@/lib/errors";
import { loginSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return jsonZodError(parsed.error);
    }

    const result = await signInWithEmail(
      parsed.data.email,
      parsed.data.password
    );
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof FirebaseRestError) {
      return jsonError(err.status, err.message);
    }
    return jsonError(500, "Error interno");
  }
}
