import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nowMs } from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const key = `paste:${id}`;
  const paste = await kv.get(key) as any;

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = nowMs(req);

  if (paste.expires_at && now >= paste.expires_at) {
    await kv.del(key);
    return NextResponse.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await kv.del(key);
      return NextResponse.json({ error: "View limit exceeded" }, { status: 404 });
    }

    paste.remaining_views -= 1;
    await kv.set(key, paste);
  }

  return NextResponse.json(
    {
      content: paste.content,
      remaining_views: paste.remaining_views,
      expires_at: paste.expires_at
        ? new Date(paste.expires_at).toISOString()
        : null,
    },
    { status: 200 }
  );
}
