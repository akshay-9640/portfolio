// Shared by the Vercel function (api/chat.ts) and the Vite dev server.
// Needs ANTHROPIC_API_KEY; without it the endpoint returns 503 and the site
// falls back to résumé search.
type Chunk = { title: string; text: string };

const hits = new Map<string, { n: number; t: number }>();
const LIMIT = 15; // questions per IP per hour

function allowed(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 3_600_000) {
    hits.set(ip, { n: 1, t: now });
    return true;
  }
  return ++h.n <= LIMIT;
}

export async function answer(
  body: { question?: string; context?: Chunk[] },
  ip: string,
  apiKey: string | undefined
): Promise<{ status: number; json: unknown }> {
  if (!apiKey) return { status: 503, json: { error: "no key" } };
  const q = (body.question ?? "").slice(0, 500);
  const context = (body.context ?? []).slice(0, 4);
  if (!q) return { status: 400, json: { error: "empty" } };
  if (!allowed(ip)) return { status: 429, json: { error: "rate limited" } };

  const sources = context.map((c) => `## ${String(c.title).slice(0, 200)}\n${String(c.text).slice(0, 1500)}`).join("\n\n");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system:
        "You answer recruiter questions about Akshay Kumar Boddu, a Generative AI engineer. Speak about him in the third person. Use ONLY the sources provided. If they don't contain the answer, say you don't have that and suggest emailing him. Be concise (under 120 words) and never invent numbers.",
      messages: [{ role: "user", content: `Sources:\n${sources || "(none)"}\n\nQuestion: ${q}` }],
    }),
  });
  if (!r.ok) return { status: 502, json: { error: "upstream" } };
  const data = (await r.json()) as { content?: { text?: string }[] };
  return { status: 200, json: { answer: data.content?.[0]?.text ?? "" } };
}
