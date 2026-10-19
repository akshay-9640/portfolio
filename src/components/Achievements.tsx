import { achievements, headings } from "../content";
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
    </Section>
  );
}
