import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../content";
import { HUBS, hubOf, isHub } from "../map";
import MapDetail from "./MapDetail";
import MapExplorer from "./MapExplorer";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay },
});

export default function Hero() {
  // The map and the pane beside it share one selection: null is the intro, otherwise a map node id.
  const [selected, setSelected] = useState<string | null>(null);
  const pane = useRef<HTMLDivElement>(null);
  const select = (id: string | null) => {
    setSelected(id);
    pane.current?.scrollTo({ top: 0 });
    // On small screens the pane sits above the map: bring it into view.
    if (id && window.innerWidth < 768) pane.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useEffect(() => {
    // Esc steps back: item to its hub, hub to the intro.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !selected || document.querySelector("dialog[open]")) return;
      setSelected(selected === "root" || isHub(selected) ? null : hubOf(selected));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-28 sm:px-8"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1fr_1.25fr]">
        <div ref={pane} className="scroll-mt-24 md:max-h-[640px] md:overflow-y-auto md:pr-2" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
        {selected ? (
          <motion.div key={selected} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <MapDetail id={selected} onSelect={select} />
          </motion.div>
        ) : (
        <motion.div key="intro" className="flex flex-col gap-7" exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          <motion.p
            {...fade(0.1)}
            className="font-mono text-xs uppercase tracking-[0.12em] text-ink/60"
          >
            {profile.roles.join(" · ")}
          </motion.p>

          <motion.h1
            {...fade(0.2)}
            className="max-w-[10ch] font-display text-5xl font-bold leading-[0.95] tracking-[-0.035em] sm:text-7xl md:text-8xl"
          >
            {profile.headline}
          </motion.h1>

          <motion.p {...fade(0.35)} className="max-w-md text-base text-ink/70 sm:text-lg">
            {profile.tagline}
          </motion.p>

          <motion.div {...fade(0.5)} className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition duration-100 hover:bg-white active:scale-[0.97]"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-ink/25 px-6 py-3 text-sm font-medium transition duration-100 hover:border-ink/60 active:scale-[0.97]"
            >
              Let's talk
            </a>
          </motion.div>

          <motion.dl
            {...fade(0.7)}
            className="mt-2 grid max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-6"
          >
            {profile.heroStats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-ink/55">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>

          <motion.div {...fade(0.85)}>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-ink/50">Explore the map</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {HUBS.map((h) => (
                <button key={h.id} type="button" onClick={() => select(h.id)} className="rounded-full border border-ink/20 px-3 py-1 text-xs text-ink/80 transition duration-100 hover:border-ink/50 hover:text-ink active:scale-[0.97]">
                  {h.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
        )}
        </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <MapExplorer selected={selected} onSelect={select} />
          <p className="mt-2 text-center text-xs text-ink/45">Click my photo or any node to explore. Drag to rotate.</p>
        </motion.div>
      </div>
    </section>
  );
}
