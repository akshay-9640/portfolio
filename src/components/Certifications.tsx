import { certifications, headings } from "../content";
import Reveal from "./Reveal";

export default function Certifications() {
  const h = headings.certifications;
  return (
    <section id="certifications" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-ink/50">
            Certifications
          </p>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-5xl md:text-6xl">
            <span className="text-ink/45">{h.before}</span> {h.accent}
          </h2>
        </Reveal>

        <ul>
          {certifications.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08}>
              <li className="flex items-center gap-4 border-b border-ink/20 py-5 text-lg">
                <span className="font-mono text-sm text-ink/40">0{i + 1}</span>
                <span className="flex-1">{c.name}</span>
                <span className="rounded-full border border-ink/20 px-3 py-0.5 font-mono text-[11px] uppercase tracking-wider text-ink/60">
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
