import { NextResponse } from "next/server";
import { verifyBearerToken } from "@/lib/auth";
import { jsonError, jsonZodError } from "@/lib/errors";
import { getAdminDb } from "@/lib/firebase";
import { respaldoSchema } from "@/lib/schemas";

function respaldoDocRef(uid: string) {
  return getAdminDb()
    .collection("usuarios")
    .doc(uid)
    .collection("respaldo")
    .doc("boveda");
}

export async function GET(request: Request): Promise<NextResponse> {
  const usuario = await verifyBearerToken(request);
  if (!usuario) {
    return jsonError(401, "No autorizado");
  }

  try {
    const snap = await respaldoDocRef(usuario.id).get();
    if (!snap.exists) {
      return jsonError(404, "Respaldo no encontrado");
    }
    return NextResponse.json({ respaldo: snap.data() }, { status: 200 });
  } catch {
    return jsonError(500, "Error interno");
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  const usuario = await verifyBearerToken(request);
  if (!usuario) {
    return jsonError(401, "No autorizado");
  }

  try {
    const body: unknown = await request.json();
    const parsed = respaldoSchema.safeParse(body);
    if (!parsed.success) {
      return jsonZodError(parsed.error);
    }

    const ahora = new Date().toISOString();
    const docData = {
      blob_cifrado: parsed.data.blob_cifrado,
      version: parsed.data.version,
      actualizado_en: parsed.data.actualizado_en,
      updated_at: ahora,
    };

    await respaldoDocRef(usuario.id).set(docData, { merge: true });
    return NextResponse.json({ respaldo: docData }, { status: 200 });
  } catch {
    return jsonError(500, "Error interno");
  }
}
