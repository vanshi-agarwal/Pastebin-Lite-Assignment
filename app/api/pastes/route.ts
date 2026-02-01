import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import crypto from "crypto";
import { nowMs } from "@/lib/time";

type Paste = {
  content: string;
  remaining_views: number | null;
  expires_at: number | null;
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.content !== "string" || body.content.trim() === "") {
    return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  }

  const ttl =
    body.ttl_seconds !== undefined
      ? Number(body.ttl_seconds)
      : null;

  const maxViews =
    body.max_views !== undefined
      ? Number(body.max_views)
      : null;

  if (ttl !== null && (!Number.isInteger(ttl) || ttl < 1)) {
    return NextResponse.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (maxViews !== null && (!Number.isInteger(maxViews) || maxViews < 1)) {
    return NextResponse.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const now = nowMs(req);

  const paste: Paste = {
    content: body.content,
    remaining_views: maxViews,
    expires_at: ttl ? now + ttl * 1000 : null,
  };

  await kv.set(`paste:${id}`, paste);

  return NextResponse.json(
    {
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    },
    { status: 201 }
  );
}
