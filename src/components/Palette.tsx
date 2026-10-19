import { useEffect, useRef, useState } from "react";
import { nav } from "../content";

const actions = [
  ...nav.map((n) => ({ label: `Go to ${n.label}`, run: () => (location.hash = n.href) })),
];

// Cmd/Ctrl+K quick-jump menu.
export default function Palette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQ("");
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  if (!open) return null;
  const list = actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 pt-[20vh]" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-label="Quick jump"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-ink/15 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={input}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && list[0]) {
              list[0].run();
              setOpen(false);
            }
          }}
          placeholder="Jump to..."
          className="w-full border-b border-ink/15 bg-transparent px-4 py-3 text-sm outline-none"
        />
        <ul className="max-h-72 overflow-y-auto py-1">
          {list.map((a) => (
            <li key={a.label}>
              <button
                className="w-full px-4 py-2 text-left text-sm text-ink/80 hover:bg-ink/5 hover:text-ink"
                onClick={() => {
                  a.run();
                  setOpen(false);
                }}
              >
                {a.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
