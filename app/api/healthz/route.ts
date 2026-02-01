import { kv } from "@/lib/kv";

export async function GET() {
  await kv.set("health", "ok");
  return Response.json({ ok: true });
}