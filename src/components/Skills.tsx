import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { headings, projects, stackLayers, timeline, type Tool } from "../content";
import Section from "./Section";

type Evidence = { kind: string; title: string; snippet: string };

// Everything a tool can be "found in": project write-ups and experience bullets.
const sources = [
  ...projects.map((p) => ({
    kind: p.status.split(" | ")[0],
    title: p.title,
    sentences: [p.description, p.study.problem, p.study.solution, p.study.result, ...p.flow],
    extra: p.tags.join(" "),
  })),
  ...timeline.map((t) => ({
    kind: "Experience",
    title: `${t.title}, ${t.org.split(",")[0]}`,
    sentences: t.bullets,
    extra: "",
  })),
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

function evidenceFor(tool: Tool): Evidence[] {
  const terms = [tool.name, ...(tool.match ?? [])];
  const re = new RegExp(`(?<![A-Za-z0-9])(${terms.map(escape).join("|")})(?![A-Za-z0-9])`, "i");
  const out: Evidence[] = [];
  for (const src of sources) {
    const hit = src.sentences.find((s) => re.test(s));
    if (hit) out.push({ kind: src.kind, title: src.title, snippet: hit });
    else if (re.test(src.extra)) out.push({ kind: src.kind, title: src.title, snippet: src.sentences[0] });
  }
  return out;
}

function Panel({ tool, layer, evidence }: { tool: Tool; layer: string; evidence: Evidence[] }) {
  return (
    <div className="rounded-2xl border border-accent/50 bg-card p-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-ink/50">{layer}</p>
      <h3 className="mt-1 font-serif text-2xl font-bold text-accent">{tool.name}</h3>
      {evidence.length ? (
        <>
          <p className="mt-1 text-xs text-ink/60">
            Used in {evidence.length} {evidence.length === 1 ? "place" : "places"}
          </p>
          <ul className="mt-4 space-y-4">
            {evidence.map((e) => (
              <li key={e.title} className="border-l-2 border-accent/60 pl-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50">{e.kind}</p>
                <p className="text-sm font-semibold">{e.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/70">{e.snippet}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-3 text-sm text-ink/60">Part of my toolkit, not tied to a listed project yet.</p>
      )}
    </div>
  );
}

export default function Skills() {
  const [sel, setSel] = useState({ layer: 1, tool: 0 });

  const counts = useMemo(
    () => stackLayers.map((l) => l.tools.map((t) => evidenceFor(t))),
    []
  );

  const layer = stackLayers[sel.layer];
  const tool = layer.tools[sel.tool];
  const panel = <Panel tool={tool} layer={layer.name} evidence={counts[sel.layer][sel.tool]} />;

  return (
    <Section id="stack" heading={headings.stack}>
      <p className="-mt-6 mb-10 max-w-2xl text-ink/70">
        Not a list of logos. This is how the systems I build are layered. Pick any tool to see
        where I have actually used it.
      </p>

      <div className="grid gap-8 md:grid-cols-[1fr_20rem]">
        <ol className="relative space-y-3">
          <span aria-hidden className="absolute bottom-6 left-[1.1rem] top-6 w-px bg-accent/25" />
          {stackLayers.map((l, li) => {
            const active = sel.layer === li;
            return (
              <motion.li
                key={l.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: li * 0.05 }}
                className="relative flex gap-4"
              >
                <span
                  className={`relative z-10 mt-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors ${
                    active ? "border-accent bg-accent text-paper" : "border-accent/50 bg-paper text-accent"
                  }`}
                >
                  {String(li + 1).padStart(2, "0")}
                </span>
                <div
                  className={`flex-1 rounded-2xl border p-4 transition-colors ${
                    active ? "border-accent/60 bg-card" : "border-ink/15 bg-card/60"
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="font-serif text-lg font-bold">{l.name}</h3>
                    <p className="text-xs text-ink/55">{l.role}</p>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {l.tools.map((t, ti) => {
                      const on = active && sel.tool === ti;
                      const n = counts[li][ti].length;
                      return (
                        <li key={t.name}>
                          <button
                            type="button"
                            aria-pressed={on}
                            onClick={() => setSel({ layer: li, tool: ti })}
                            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                              on
                                ? "border-accent bg-accent text-paper"
                                : "border-ink/25 hover:border-accent hover:text-accent"
                            }`}
                          >
                            {t.name}
                            {n > 0 && (
                              <span className={`font-mono text-[10px] ${on ? "text-paper/70" : "text-accent"}`}>
                                {n}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {active && <div className="mt-4 md:hidden">{panel}</div>}
                </div>
              </motion.li>
            );
          })}
        </ol>

        <aside className="hidden md:block">
          <div className="sticky top-24">{panel}</div>
        </aside>
      </div>
    </Section>
  );
}
