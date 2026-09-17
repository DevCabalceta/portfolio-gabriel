const HACIENDA_RATE_URL = "https://api.hacienda.go.cr/indicadores/tc/dolar";

type HaciendaRate = {
  venta?: {
    fecha?: unknown;
    valor?: unknown;
  };
};

export async function GET() {
  try {
    const response = await fetch(HACIENDA_RATE_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error(`Hacienda returned ${response.status}`);

    const data = await response.json() as HaciendaRate;
    const rate = data.venta?.valor;
    const date = data.venta?.fecha;
    if (typeof rate !== "number" || !Number.isFinite(rate) || rate <= 0 ||
      typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new Error("Invalid Hacienda exchange rate");
    }

    return Response.json({ rate, date });
  } catch {
    return Response.json({ error: "Exchange rate unavailable" }, { status: 503 });
  }
}
