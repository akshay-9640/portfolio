import { answer } from "../server/chatHandler";

// Vercel serverless function: POST /api/chat
export default async function handler(
  req: { method?: string; body?: any; headers: Record<string, string | string[] | undefined> },
  res: { status: (n: number) => { json: (b: unknown) => void } }
) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const ip = String(req.headers["x-forwarded-for"] ?? "unknown").split(",")[0];
  const out = await answer(req.body ?? {}, ip, process.env.ANTHROPIC_API_KEY);
  res.status(out.status).json(out.json);
}
