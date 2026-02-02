import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // Add await here
  const key = `paste:${id}`;
  const paste = await kv.get(key) as any;

  if (!paste) {
    return NextResponse.json({ error: "Paste not found" }, { status: 404 });
  }

  if (paste.remaining_views !== null) {
    if (paste.remaining_views <= 0) {
      await kv.del(key);
      return NextResponse.json({ error: "Paste expired" }, { status: 404 });
    }

    paste.remaining_views -= 1;
    await kv.set(key, paste);
  }

  return NextResponse.json({
    content: paste.content,
    remaining_views: paste.remaining_views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}
