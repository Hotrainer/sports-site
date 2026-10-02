import { footballProvider } from "@/lib/provider";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id))
    return Response.json({ error: "Invalid match" }, { status: 400 });
  const league = new URL(request.url).searchParams.get("league") ?? "1";
  if (league !== "1" && league !== "2a" && league !== "2b")
    return Response.json({ error: "Invalid league" }, { status: 400 });
  try {
    const data = await footballProvider.getGoals(Number(id), league);
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
