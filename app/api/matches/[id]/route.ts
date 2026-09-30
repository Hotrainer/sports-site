import { footballProvider } from "@/lib/provider";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id))
    return Response.json({ error: "Invalid match" }, { status: 400 });
  try {
    const data = await footballProvider.getGoals(Number(id));
    return Response.json(data, {
      status: data.status === "not-found" ? 404 : 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    return Response.json({ status: "unavailable", goals: [] }, { status: 503 });
  }
}
