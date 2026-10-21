import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
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

// Soft tints of the dark card color, one per project, so the cards read as separate sheets.
const TINTS = ["#16203a", "#1f1a2f", "#162a26", "#2a2219", "#182433", "#27192a", "#1d2618"];

// One stop on the path: the card swings gently into place when it reaches the screen.
function PathCard({ p, i, onOpen, cardRef }: { p: Project; i: number; onOpen: () => void; cardRef: (el: HTMLElement | null) => void }) {
  const reduce = useReducedMotion();
  const left = i % 2 === 0;
  return (
    <motion.article
      ref={cardRef}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, rotate: left ? -5 : 5 }}
      whileInView={{ opacity: 1, y: 0, rotate: reduce ? 0 : left ? -1 : 1 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.9 }}
      style={{ background: TINTS[i % TINTS.length] }}
      className={`relative z-10 w-full overflow-hidden rounded-[24px] border border-ink/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.85)] md:grid md:w-[72%] md:grid-cols-[1fr_1.05fr] ${left ? "md:mr-auto" : "md:ml-auto"}`}
    >
      <div className="self-stretch overflow-hidden md:[&>*]:h-full md:[&>*]:border-b-0 md:[&_img]:h-full md:[&_img]:aspect-auto">
        <Preview p={p} />
      </div>
      <div className="flex flex-col p-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">{String(i + 1).padStart(2, "0")} · {p.status}</span>
        <h3 className="mt-2 font-display text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-3xl">{p.title}</h3>
        <p className="mt-3 text-sm text-ink/70">{p.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
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
    </motion.article>
  );
}

// The dashed path that winds from card to card. It is drawn up to where the reader has
// scrolled (a mask whose length follows the scroll), with a small dot at its tip. The page
// itself scrolls normally: nothing is pinned and nothing moves sideways against the scroll.
function TravelPath({ box, cards }: { box: React.RefObject<HTMLDivElement>; cards: React.MutableRefObject<(HTMLElement | null)[]> }) {
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const line = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start 70%", "end 70%"] });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const build = () => {
      const b = el.getBoundingClientRect();
      // Each stop is the card's inner edge (the side facing the middle), vertically centered.
      const pts = cards.current.filter(Boolean).map((c, i) => {
        const r = c!.getBoundingClientRect();
        return { x: (i % 2 === 0 ? r.right - 40 : r.left + 40) - b.left, y: r.top + r.height / 2 - b.top };
      });
      if (pts.length < 2) return;
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], c = pts[i], my = (a.y + c.y) / 2;
        path += ` C ${a.x} ${my}, ${c.x} ${my}, ${c.x} ${c.y}`;   // an S-curve between stops
      }
      setD(path);
      setSize({ w: b.width, h: b.height });
    };
    const ro = new ResizeObserver(build);
    ro.observe(el);
    build();
    return () => ro.disconnect();
  }, [box, cards]);

  useEffect(() => scrollYProgress.on("change", (v) => {
    const l = line.current, c = dot.current;
    if (!l || !c) return;
    const pt = l.getPointAtLength(l.getTotalLength() * Math.min(1, Math.max(0, v)));
    c.setAttribute("cx", String(pt.x));
    c.setAttribute("cy", String(pt.y));
  }), [scrollYProgress, d]);

  if (!d) return null;
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 hidden md:block" width={size.w} height={size.h}>
      <defs>
        <mask id="path-reveal" maskUnits="userSpaceOnUse">
          <motion.path d={d} fill="none" stroke="white" strokeWidth={6} style={{ pathLength: scrollYProgress }} />
        </mask>
      </defs>
      <path d={d} fill="none" className="stroke-ink/[0.07]" strokeWidth={2} strokeDasharray="6 10" />
      <path ref={line} d={d} fill="none" className="stroke-ink/45" strokeWidth={2} strokeDasharray="6 10" mask="url(#path-reveal)" />
      <circle ref={dot} r={6} className="fill-ink" />
    </svg>
  );
}

export default function Projects() {
  const [open, setOpen] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);

  return (
    <Section id="projects" heading={headings.projects}>
      <div ref={box} className="relative flex flex-col gap-10 md:gap-40">
        <TravelPath box={box} cards={cards} />
        {projects.map((p, i) => (
          <PathCard key={p.title} p={p} i={i} onOpen={() => setOpen(i)} cardRef={(el) => { cards.current[i] = el; }} />
        ))}
      </div>
      <CaseStudy p={open === null ? null : projects[open]} onClose={() => setOpen(null)} />
    </Section>
  );
}
