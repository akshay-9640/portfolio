import { headings, workflow } from "../content";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Process() {
  return (
    <Section id="process" heading={headings.process}>
      <ol className="grid gap-4 md:grid-cols-5">
        {workflow.map((w, i) => (
          <Reveal key={w.step} delay={i * 0.08}>
            <li className="relative h-full rounded-2xl border border-ink/10 bg-card p-5">
              <span className="font-mono text-xs text-ink/40">0{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-bold tracking-[-0.01em]">{w.step}</h3>
              <p className="font-serif text-lg italic leading-tight text-ink/60">{w.accent}</p>
              <p className="mt-2 text-sm text-ink/70">{w.text}</p>
              {i < workflow.length - 1 && (
                <span aria-hidden className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-ink/30 md:block">
                  →
                </span>
              )}
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
