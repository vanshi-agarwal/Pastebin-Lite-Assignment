import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const id = nanoid(8);

    const now = Date.now();
    const expiresAt = ttl_seconds ? now + ttl_seconds * 1000 : null;

    const pasteData = {
      content,
      remaining_views: max_views ?? null,
      expires_at: expiresAt,
    };

    await kv.set(`paste:${id}`, pasteData);

    if (ttl_seconds) {
      await kv.expire(`paste:${id}`, ttl_seconds);
    }

    return NextResponse.json(
      {
        id,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
