import { useState } from "react";
import { motion } from "framer-motion";
import { headings, projects } from "../content";
import Section from "./Section";

export default function Projects() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="projects" heading={headings.projects}>
      <div className="grid items-start gap-6 md:grid-cols-6">
        {projects.map((p, i) => {
          const isOpen = open === i;
          return (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-colors ${
                isOpen ? "border-accent" : "border-ink/20 hover:border-accent/60"
              } md:col-span-2`}
            >
              <div className="flex items-center border-b border-ink/10 bg-paper px-5 py-3">
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink/50">
                  {p.status}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{p.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-full border border-ink/30 px-2.5 py-0.5 text-[11px]">
                      {t}
                    </li>
                  ))}
                </ul>

                {isOpen && (
                  <ol className="mt-5 space-y-1 border-t border-ink/10 pt-4" aria-label="Architecture flow">
                    {p.flow.map((f, k) => (
                      <li key={f} className="flex items-center gap-3 text-xs">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-accent font-mono text-[10px] text-accent">
                          {k + 1}
                        </span>
                        <span className="flex-1 rounded-md border border-ink/20 bg-paper px-3 py-1.5">{f}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {isOpen && (
                  <dl className="mt-5 space-y-3 border-t border-ink/10 pt-4 text-sm">
                    {(["problem", "solution", "result"] as const).map((k) => (
                      <div key={k}>
                        <dt className="font-mono text-[11px] uppercase tracking-widest text-accent">
                          {k}
                        </dt>
                        <dd className="mt-1 text-ink/75">{p.study[k]}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-auto flex gap-5 pt-6 text-sm font-medium">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="text-accent underline-offset-4 hover:underline"
                  >
                    {isOpen ? "Hide case study" : "Case study →"}
                  </button>
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4 hover:text-accent"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
