import { certifications, headings } from "../content";
import Reveal from "./Reveal";

export default function Certifications() {
  const h = headings.certifications;
  return (
    <section id="certifications" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-accent">
            Certifications
          </p>
          <h2 className="font-serif text-4xl font-extrabold sm:text-5xl md:text-6xl">
            {h.before} <em className="font-extrabold text-accent">{h.accent}</em>
          </h2>
        </Reveal>

        <ul>
          {certifications.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08}>
              <li className="flex items-center gap-4 border-b border-ink/20 py-5 text-lg">
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <span className="flex-1">{c.name}</span>
                <span className="rounded-full border border-accent/50 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider text-accent">
                  {c.issuer}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
