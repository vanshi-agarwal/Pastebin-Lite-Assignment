import { kv } from "@/lib/kv";
import { now } from "@/lib/time";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string") {
    return new Response("Invalid content", { status: 400 });
  }

  const id = crypto.randomUUID().slice(0, 8);

  const expiresAt = ttl_seconds
    ? now(req) + ttl_seconds * 1000
    : null;

  const data = {
    content,
    expires_at: expiresAt,
    remaining_views: max_views ?? null,
  };

  await kv.set(`paste:${id}`, data);

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}