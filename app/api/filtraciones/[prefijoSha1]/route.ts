import { NextResponse } from "next/server";
import { verifyBearerToken } from "@/lib/auth";
import { jsonError } from "@/lib/errors";
import { prefijoSha1Schema } from "@/lib/schemas";

export async function GET(
  request: Request,
  context: { params: Promise<{ prefijoSha1: string }> }
): Promise<NextResponse> {
  const usuario = await verifyBearerToken(request);
  if (!usuario) {
    return jsonError(401, "No autorizado");
  }

  const { prefijoSha1 } = await context.params;
  const parsed = prefijoSha1Schema.safeParse(prefijoSha1);
  if (!parsed.success) {
    return jsonError(400, "Prefijo SHA-1 inválido", [
      {
        campo: "prefijoSha1",
        mensaje: "Debe tener exactamente 5 dígitos hexadecimales",
      },
    ]);
  }

  try {
    const prefijo = parsed.data.toUpperCase();
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefijo}`, {
      headers: { "Add-Padding": "true" },
    });
    if (!res.ok) {
      return jsonError(502, "Error al consultar servicio de filtraciones");
    }
    const texto = await res.text();
    const sufijos = texto
      .split(/\r?\n/)
      .filter((line) => line.includes(":"))
      .map((line) => {
        const [sufijo, conteo] = line.split(":");
        return { sufijo: sufijo ?? "", conteo: Number(conteo ?? 0) };
      });

    return NextResponse.json({ prefijo, sufijos }, { status: 200 });
  } catch {
    return jsonError(500, "Error interno");
  }
}
