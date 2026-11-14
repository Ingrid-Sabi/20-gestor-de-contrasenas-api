import { getAdminAuth } from "@/lib/firebase";

export interface AuthUsuario {
  id: string;
  email: string;
  rol?: string;
}

export interface FirebaseAuthResult {
  token: string;
  refreshToken: string;
  expiraEnSeg: number;
  usuario: AuthUsuario;
}

function getWebApiKey(): string {
  const key = process.env.FIREBASE_WEB_API_KEY;
  if (!key) {
    throw new Error("Falta FIREBASE_WEB_API_KEY");
  }
  return key;
}

export async function verifyBearerToken(
  request: Request
): Promise<AuthUsuario | null> {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }
  const token = header.slice(7).trim();
  if (!token) {
    return null;
  }
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    const rol = typeof decoded.rol === "string" ? decoded.rol : undefined;
    return {
      id: decoded.uid,
      email: decoded.email ?? "",
      ...(rol ? { rol } : {}),
    };
  } catch {
    return null;
  }
}

export class FirebaseRestError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

function mapFirebaseError(code: string): FirebaseRestError {
  if (code === "EMAIL_EXISTS") {
    return new FirebaseRestError(409, "El correo ya está registrado");
  }
  if (code === "TOO_MANY_ATTEMPTS_TRY_LATER") {
    return new FirebaseRestError(429, "Demasiados intentos, intenta más tarde");
  }
  if (code === "WEAK_PASSWORD") {
    return new FirebaseRestError(400, "La contraseña es muy débil");
  }
  return new FirebaseRestError(401, "Credenciales inválidas");
}

async function postIdentityToolkit(
  endpoint: string,
  payload: Record<string, unknown>
): Promise<FirebaseAuthResult> {
  const apiKey = getWebApiKey();
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, returnSecureToken: true }),
  });

  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const errObj = data.error as { message?: string } | undefined;
    throw mapFirebaseError(errObj?.message ?? "");
  }

  return {
    token: String(data.idToken ?? ""),
    refreshToken: String(data.refreshToken ?? ""),
    expiraEnSeg: Number(data.expiresIn ?? 3600),
    usuario: {
      id: String(data.localId ?? ""),
      email: String(data.email ?? ""),
    },
  };
}

export function signUpWithEmail(
  email: string,
  password: string
): Promise<FirebaseAuthResult> {
  return postIdentityToolkit("signUp", { email, password });
}

export function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseAuthResult> {
  return postIdentityToolkit("signInWithPassword", { email, password });
}

export async function refreshIdToken(refreshToken: string): Promise<{
  token: string;
  refreshToken: string;
  expiraEnSeg: number;
}> {
  const apiKey = getWebApiKey();
  const url = `https://securetoken.googleapis.com/v1/token?key=${apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    throw new FirebaseRestError(401, "Refresh token inválido");
  }

  return {
    token: String(data.id_token ?? ""),
    refreshToken: String(data.refresh_token ?? ""),
    expiraEnSeg: Number(data.expires_in ?? 3600),
  };
}
