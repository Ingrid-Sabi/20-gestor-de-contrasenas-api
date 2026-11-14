import { NextResponse } from "next/server";
import { FirebaseRestError, signUpWithEmail } from "@/lib/auth";
import { jsonError, jsonZodError } from "@/lib/errors";
import { registroSchema } from "@/lib/schemas";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const parsed = registroSchema.safeParse(body);
    if (!parsed.success) {
      return jsonZodError(parsed.error);
    }

    const result = await signUpWithEmail(
      parsed.data.email,
      parsed.data.password
    );
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof FirebaseRestError) {
      return jsonError(err.status, err.message);
    }
    return jsonError(500, "Error interno");
  }
}
