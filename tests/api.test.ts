import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET as getHealth } from "@/app/api/health/route";
import { GET as getYo } from "@/app/api/auth/yo/route";
import { POST as postRegistro } from "@/app/api/auth/registro/route";
import {
  GET as getRespaldo,
  PUT as putRespaldo,
} from "@/app/api/respaldo/route";
import { GET as getFiltraciones } from "@/app/api/filtraciones/[prefijoSha1]/route";

const mockVerifyIdToken = vi.fn();
const mockGet = vi.fn();
const mockSet = vi.fn();
const mockDoc = vi.fn(() => ({
  collection: () => ({
    doc: () => ({
      get: mockGet,
      set: mockSet,
    }),
  }),
}));

vi.mock("@/lib/firebase", () => ({
  getAdminAuth: () => ({
    verifyIdToken: mockVerifyIdToken,
  }),
  getAdminDb: () => ({
    collection: () => ({
      doc: mockDoc,
    }),
  }),
}));

describe("API 20-gestor-de-contrasenas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/health responde 200 con ok: true", async () => {
    const res = await getHealth();
    expect(res.status).toBe(200);
    const data = (await res.json()) as { ok: boolean };
    expect(data.ok).toBe(true);
  });

  it("GET /api/auth/yo responde 401 sin token", async () => {
    const req = new Request("http://localhost/api/auth/yo");
    const res = await getYo(req);
    expect(res.status).toBe(401);
  });

  it("POST /api/auth/registro responde 400 con contraseña corta", async () => {
    const req = new Request("http://localhost/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "user@test.com", password: "123" }),
    });
    const res = await postRegistro(req);
    expect(res.status).toBe(400);
  });
});

describe("API 20-gestor-de-contrasenas - respaldo y filtraciones", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("PUT /api/respaldo aísla por uid del token verificado y guarda el blob", async () => {
    mockVerifyIdToken.mockResolvedValue({
      uid: "user-123",
      email: "user@test.com",
    });
    mockSet.mockResolvedValue(undefined);

    const req = new Request("http://localhost/api/respaldo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer valid-token",
      },
      body: JSON.stringify({
        blob_cifrado: "abc123cifrado",
        version: 1,
        actualizado_en: "2026-11-14T10:00:00.000Z",
      }),
    });

    const res = await putRespaldo(req);
    expect(res.status).toBe(200);
    expect(mockDoc).toHaveBeenCalledWith("user-123");
  });

  it("GET /api/respaldo responde 404 si no existe respaldo", async () => {
    mockVerifyIdToken.mockResolvedValue({
      uid: "user-123",
      email: "user@test.com",
    });
    mockGet.mockResolvedValue({ exists: false });

    const req = new Request("http://localhost/api/respaldo", {
      headers: { Authorization: "Bearer valid-token" },
    });
    const res = await getRespaldo(req);
    expect(res.status).toBe(404);
  });
});

describe("API 20-gestor-de-contrasenas - filtraciones", () => {
  it("GET /api/filtraciones/:prefijoSha1 responde 400 si el prefijo es inválido", async () => {
    mockVerifyIdToken.mockResolvedValue({
      uid: "user-123",
      email: "user@test.com",
    });
    const req = new Request("http://localhost/api/filtraciones/zzzzz", {
      headers: { Authorization: "Bearer valid-token" },
    });
    const res = await getFiltraciones(req, {
      params: Promise.resolve({ prefijoSha1: "zzzzz" }),
    });
    expect(res.status).toBe(400);
  });
});
