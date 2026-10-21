import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
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

// A screenshot of the live showcase when there is one; otherwise the system's flow, drawn as steps.
function Preview({ p }: { p: Project }) {
  if (p.image)
    return (
      <a href={p.live} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden className="block overflow-hidden border-b border-ink/10 bg-white">
        <img src={p.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-out hover:scale-[1.02]" />
      </a>
    );
  return (
    <ol className="flex aspect-[16/10] flex-col justify-center gap-1.5 border-b border-ink/10 bg-paper/60 px-5 py-4" aria-label="System flow">
      {p.flow.map((f, k) => (
        <li key={f} className="flex items-center gap-2.5 text-xs text-ink/75">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${k === p.flow.length - 1 ? "bg-ink" : "bg-ink/35"}`} />
          <span className="truncate">{f}</span>
        </li>
      ))}
    </ol>
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

// Soft tints of the dark card color, one per project, so the deck reads as separate sheets.
const TINTS = ["#16203a", "#1f1a2f", "#162a26", "#2a2219", "#182433", "#27192a", "#1d2618"];

// One card of the deck: it slides in from the right over the cards before it, which then
// step back (slightly smaller and dimmer), as the page scrolls.
function DeckCard({ p, i, n, progress, onOpen }: { p: Project; i: number; n: number; progress: MotionValue<number>; onOpen: () => void }) {
  const slot = 1 / n;
  const x = useTransform(progress, [Math.max(0, (i - 1) * slot + slot * 0.4), i * slot + slot * 0.4], i === 0 ? ["0%", "0%"] : ["115%", "0%"]);
  const scale = useTransform(progress, [i * slot + slot * 0.4, (i + 1) * slot + slot * 0.4], [1, i === n - 1 ? 1 : 0.94]);
  const dim = useTransform(progress, [i * slot + slot * 0.4, (i + 1) * slot + slot * 0.4], [1, i === n - 1 ? 1 : 0.45]);
  return (
    <motion.article
      style={{ x, scale, opacity: dim, top: i * 10, left: i * 14, background: TINTS[i % TINTS.length], zIndex: i }}
      className="absolute grid h-[min(64vh,560px)] w-[min(980px,calc(100%-6rem))] origin-left grid-cols-[1fr_1.1fr] gap-8 overflow-hidden rounded-[28px] border border-ink/10 p-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
    >
      <div className="flex min-w-0 flex-col">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">{String(i + 1).padStart(2, "0")} · {p.status}</span>
        <h3 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em]">{p.title}</h3>
        <p className="mt-4 text-ink/70">{p.description}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
          {p.tags.map((t) => <li key={t} className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[11px] text-ink/70">{t}</li>)}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-5 pt-6 text-sm font-medium">
          <button type="button" aria-haspopup="dialog" onClick={onOpen}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-semibold text-paper transition duration-100 hover:bg-white active:scale-[0.97]">
            Case study <span aria-hidden>→</span>
          </button>
          <Links p={p} />
        </div>
      </div>
      <div className="min-w-0 self-center overflow-hidden rounded-2xl ring-1 ring-ink/10">
        <Preview p={p} />
      </div>
    </motion.article>
  );
}

function Deck({ onOpen }: { onOpen: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    // Tall wrapper: scrolling through it drives the deck while the cards stay pinned on screen.
    <div ref={ref} style={{ height: `${projects.length * 55 + 45}vh` }}>
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center">
        <div className="relative h-[min(64vh,560px)] w-full">
          {projects.map((p, i) => (
            <DeckCard key={p.title} p={p} i={i} n={projects.length} progress={scrollYProgress} onOpen={() => onOpen(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function useWide() {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
}

export default function Projects() {
  const [open, setOpen] = useState<number | null>(null);
  const wide = useWide();
  const reduce = useReducedMotion();

  if (wide && !reduce)
    return (
      <Section id="projects" heading={headings.projects}>
        <Deck onOpen={setOpen} />
        <CaseStudy p={open === null ? null : projects[open]} onClose={() => setOpen(null)} />
      </Section>
    );

  return (
    <Section id="projects" heading={headings.projects}>
      {/* On wider screens each card spans six shared rows (status, preview, title, description, tags, links)
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
            className={`flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-card transition-colors hover:border-ink/25 ${span} md:row-span-6 md:grid md:grid-rows-subgrid md:gap-y-0`}
          >
            <div className="flex items-center border-b border-ink/10 px-5 py-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">{p.status}</span>
            </div>
            <Preview p={p} />
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
