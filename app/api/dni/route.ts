import { NextRequest, NextResponse } from "next/server";

interface DniApiResult {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre_completo: string;
  codigo_verificacion: string;
}

interface DniApiResponse {
  estado: boolean;
  mensaje: string;
  resultado?: DniApiResult;
}

const RATE_LIMIT = {
  limit: 5,
  windowMs: 60_000,
};

const rateLimitStore = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

const getClientIp = (request: NextRequest): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return true;
  }

  if (entry.count >= RATE_LIMIT.limit) {
    return false;
  }

  entry.count += 1;
  rateLimitStore.set(ip, entry);
  return true;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const document = searchParams.get("document")?.trim() ?? "";

  if (!document || !/^\d{8}$/.test(document)) {
    return NextResponse.json(
      { success: false, message: "DNI inválido" },
      { status: 400 },
    );
  }

  const clientIp = getClientIp(request);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { success: false, message: "Demasiadas solicitudes. Intenta más tarde." },
      { status: 429 },
    );
  }

  const apiKey = process.env.PERUDEVS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: "API key no configurada" },
      { status: 500 },
    );
  }

  const endpoint = new URL("https://api.perudevs.com/api/v1/dni/simple");
  endpoint.searchParams.set("document", document);
  endpoint.searchParams.set("key", apiKey);

  try {
    const response = await fetch(endpoint.toString(), { cache: "no-store" });
    const data = (await response.json()) as DniApiResponse;

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.mensaje ?? "Error en consulta" },
        { status: response.status },
      );
    }

    if (!data.estado || !data.resultado) {
      return NextResponse.json(
        { success: false, message: data.mensaje || "No encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: data.resultado });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "No se pudo consultar el DNI" },
      { status: 500 },
    );
  }
}
