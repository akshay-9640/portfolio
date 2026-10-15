import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { headings, projects } from "../content";
import Section from "./Section";

type Project = (typeof projects)[number];

function Links({ p }: { p: Project }) {
  return (
    <>
      {p.live && (
        <a href={p.live} target="_blank" rel="noreferrer" className="text-ink/70 underline underline-offset-4 hover:text-ink">
          Live demo ↗
        </a>
      )}
      {p.github && (
        <a href={p.github} target="_blank" rel="noreferrer" className="text-ink/70 underline underline-offset-4 hover:text-ink">
          GitHub ↗
        </a>
      )}
    </>
  );
}

// The case study opens in a dialog so the grid keeps every card the same size.
function CaseStudy({ p, onClose }: { p: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (p && !d.open) d.showModal();
    if (!p && d.open) d.close();
  }, [p]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="case-study-title"
      className="m-auto max-h-[85vh] w-[min(42rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-ink/15 bg-card p-0 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      {p && (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">{p.status}</span>
              <h3 id="case-study-title" className="mt-1 font-display text-2xl font-bold tracking-[-0.02em]">{p.title}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/70 transition-transform hover:text-ink active:scale-95"
            >
              ✕
            </button>
          </div>
          <p className="mt-3 text-sm text-ink/70">{p.description}</p>

          <ol className="mt-6 space-y-1.5" aria-label="Architecture flow">
            {p.flow.map((f, k) => (
              <li key={f} className="flex items-center gap-3 text-xs">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink/25 font-mono text-[11px] text-ink/60">
                  {k + 1}
                </span>
                <span className="flex-1 rounded-lg border border-ink/10 bg-paper px-3 py-1.5">{f}</span>
              </li>
            ))}
          </ol>

          <dl className="mt-6 space-y-4 border-t border-ink/10 pt-5 text-sm">
            {(["problem", "solution", "result"] as const).map((k) => (
              <div key={k}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">{k}</dt>
                <dd className="mt-1 text-ink/75">{p.study[k]}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex gap-5 border-t border-ink/10 pt-5 text-sm font-medium">
            <Links p={p} />
          </div>
        </div>
      )}
    </dialog>
  );
}

export default function Projects() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="projects" heading={headings.projects}>
      {/* On wider screens each card spans five shared rows (status, title, description, tags, links)
          through subgrid, so those parts line up across a row whatever their length. */}
      <div className="grid gap-6 md:grid-cols-6">
        {projects.map((p, i) => {
          // Fill the last row: two leftover cards split it, a single one sits in the middle.
          const left = projects.length % 3, inLastRow = i >= projects.length - left;
          const span = inLastRow && left === 2 ? "md:col-span-3" : inLastRow && left === 1 ? "md:col-span-2 md:col-start-3" : "md:col-span-2";
          return (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className={`flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-card transition-colors hover:border-ink/25 ${span} md:row-span-5 md:grid md:grid-rows-subgrid md:gap-y-0`}
          >
            <div className="flex items-center border-b border-ink/10 px-5 py-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">{p.status}</span>
            </div>
            <h3 className="px-5 pt-5 font-display text-xl font-bold leading-snug tracking-[-0.01em]">{p.title}</h3>
            <p className="px-5 pt-2 text-sm text-ink/70">{p.description}</p>
            <ul className="flex flex-wrap content-start gap-2 px-5 pt-4" aria-label="Technologies">
              {p.tags.map((t) => (
                <li key={t} className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[11px] text-ink/70">
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex items-end gap-5 px-5 pb-5 pt-6 text-sm font-medium">
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={() => setOpen(i)}
                className="text-ink underline-offset-4 hover:underline"
              >
                Case study →
              </button>
              <Links p={p} />
            </div>
          </motion.article>
          );
        })}
      </div>
      <CaseStudy p={open === null ? null : projects[open]} onClose={() => setOpen(null)} />
    </Section>
  );
}
