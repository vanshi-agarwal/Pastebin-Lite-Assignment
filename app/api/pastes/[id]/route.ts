import { kv } from "@/lib/kv";
import { now } from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) {
    return new Response("Not found", { status: 404 });
  }

  if (paste.expires_at && now(req) > paste.expires_at) {
    await kv.del(key);
    return new Response("Expired", { status: 404 });
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await kv.del(key);
      return new Response("Views exceeded", { status: 404 });
    }
    paste.remaining_views -= 1;
    await kv.set(key, paste);
  }

  return Response.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}