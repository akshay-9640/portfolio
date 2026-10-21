import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { headings, workflow } from "../content";
import Section from "./Section";
import TravelPath from "./TravelPath";

// How I work as a path: the steps alternate left and right along a dashed line that draws
// itself as the reader scrolls. Nothing is pinned; the page scrolls normally.
export default function Process() {
  const box = useRef<HTMLOListElement>(null);
  const steps = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();

  return (
    <Section id="process" heading={headings.process}>
      <ol ref={box} className="relative flex flex-col gap-6 md:gap-16">
        <TravelPath box={box} cards={steps} />
        {workflow.map((w, i) => {
          const left = i % 2 === 0;
          return (
            <motion.li
              key={w.step}
              ref={(el) => { steps.current[i] = el; }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotate: left ? -4 : 4 }}
              whileInView={{ opacity: 1, y: 0, rotate: reduce ? 0 : left ? -1 : 1 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
              className={`relative z-10 w-full rounded-2xl border border-ink/10 bg-card p-6 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.85)] md:w-[46%] ${left ? "md:mr-auto" : "md:ml-auto"}`}
            >
              <span className="font-mono text-xs text-ink/40">0{i + 1}</span>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.01em]">{w.step}</h3>
              <p className="font-serif text-xl italic leading-tight text-ink/60">{w.accent}</p>
              <p className="mt-3 text-sm text-ink/70">{w.text}</p>
            </motion.li>
          );
        })}
      </ol>
    </Section>
  );
}
