import { useRef, useState } from "react";
import { retrieve } from "../knowledge";

type Msg = { role: "user" | "bot"; text: string; sources?: string[]; mode?: "ai" | "search" };

const suggestions = [
  "What has he built with LangGraph?",
  "How did he reach 95-98% accuracy?",
  "What certifications does he have?",
];

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi, I'm Akshay's resume assistant. Ask me about his projects, experience or stack." },
  ]);
  const input = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);

  const ask = async (q: string) => {
    if (!q.trim() || busy) return;
    const context = retrieve(q);
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    let reply: Msg;
    try {
      // The LLM endpoint is optional (needs ANTHROPIC_API_KEY on the server).
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context }),
      });
      if (!r.ok) throw new Error(String(r.status));
      const data = (await r.json()) as { answer: string };
      reply = { role: "bot", text: data.answer, sources: context.map((c) => c.title), mode: "ai" };
    } catch {
      reply = context.length
        ? {
            role: "bot",
            text: context.map((c) => c.text).join("\n\n"),
            sources: context.map((c) => c.title),
            mode: "search",
          }
        : {
            role: "bot",
            text: "I don't have that in Akshay's resume. Try asking about his projects, Deloitte work, skills or certifications, or email him directly.",
            mode: "search",
          };
    }
    setMsgs((m) => [...m, reply]);
    setBusy(false);
    setTimeout(() => end.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            setTimeout(() => input.current?.focus(), 50);
          }}
          className="fixed bottom-5 right-5 z-50 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper shadow-lg shadow-black/40 transition duration-100 hover:bg-white active:scale-[0.97]"
        >
          Ask Akshay
        </button>
      )}
      {open && (
        <div
          role="dialog"
          aria-label="Ask Akshay"
          className="fixed bottom-5 right-5 z-50 flex h-[28rem] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink/15 bg-card shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
            <span className="text-sm font-semibold">Ask Akshay</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-ink/60 hover:text-ink">
              ✕
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <p
                  className={`inline-block max-w-[90%] whitespace-pre-line rounded-xl px-3 py-2 text-left ${
                    m.role === "user" ? "bg-ink text-paper" : "border border-ink/10 bg-paper text-ink/85"
                  }`}
                >
                  {m.text}
                </p>
                {m.sources && m.sources.length > 0 && (
                  <p className="mt-1 font-mono text-[11px] text-ink/45">
                    {m.mode === "ai" ? "AI answer" : "Matched from resume"}: {m.sources.slice(0, 2).join(", ")}
                  </p>
                )}
              </div>
            ))}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-ink/20 px-3 py-1 text-xs text-ink/80 transition duration-100 hover:border-ink/50 hover:text-ink active:scale-[0.97]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {busy && <p className="text-xs text-ink/50">Thinking...</p>}
            <div ref={end} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = input.current!.value;
              input.current!.value = "";
              ask(v);
            }}
            className="flex gap-2 border-t border-ink/10 p-3"
          >
            <input
              ref={input}
              placeholder="Ask about my work..."
              aria-label="Your question"
              className="flex-1 rounded-xl border border-ink/15 bg-paper px-3 py-2 text-sm outline-none transition-colors focus:border-ink/50"
            />
            <button className="rounded-xl bg-ink px-4 text-sm font-semibold text-paper transition duration-100 hover:bg-white active:scale-[0.97]">Send</button>
          </form>
        </div>
      )}
    </>
  );
}
