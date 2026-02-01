import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = await kv.get(`paste:${params.id}`) as any;

  if (!paste) notFound();

  return (
    <main style={{ padding: "2rem", whiteSpace: "pre-wrap" }}>
      {paste.content}
    </main>
  );
}
