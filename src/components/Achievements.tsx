import { achievements, headings, impact } from "../content";
import Section from "./Section";

export default function Achievements() {
  return (
    <Section id="achievements" heading={headings.achievements}>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {achievements.map((a) => (
          <li
            key={a.label}
            className="flex h-44 flex-col justify-between rounded-2xl border border-ink/10 bg-card p-6"
          >
            <span className="font-display text-4xl font-bold tracking-[-0.03em]">{a.value}</span>
            <span className="text-sm text-ink/70">{a.label}</span>
          </li>
        ))}
      </ul>
      <h3 className="mb-4 mt-14 text-xs font-medium uppercase tracking-[0.12em] text-ink/50">
        Before → after
      </h3>
      <ul className="grid gap-4 sm:grid-cols-2">
        {impact.map((m) => (
          <li key={m.label} className="rounded-2xl border border-ink/10 bg-card p-5">
            <p className="text-sm text-ink/70">{m.label}</p>
            <p className="mt-3 flex flex-wrap items-baseline gap-3 font-display tracking-[-0.02em]">
              <span className="text-2xl text-ink/35 line-through decoration-ink/25">{m.before}</span>
              <span aria-hidden className="text-ink/30">→</span>
              <span className="text-3xl font-bold">{m.after}</span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
