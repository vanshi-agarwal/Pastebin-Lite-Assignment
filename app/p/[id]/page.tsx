import { notFound } from "next/navigation";

async function getPaste(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = await getPaste(params.id);

  if (!paste) {
    notFound();
  }

  return (
    <main style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>Paste</h2>

      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f4f4f4",
          padding: "12px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}
