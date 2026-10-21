import { useState } from "react";
import { certifications, education, gallery, headings, timeline } from "../content";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="experience" heading={headings.experience}>
      <ol className="border-t border-ink/20">
        {timeline.map((t, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={t.title} delay={i * 0.1}>
              <li className="border-b border-ink/20 py-6">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="grid w-full gap-1 text-left md:grid-cols-[1fr_11rem_2rem] md:items-start md:gap-8"
                >
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-[-0.01em] sm:text-2xl">{t.title}</h3>
                    <p className="mt-1 text-ink/70">{t.org}</p>
                  </div>
                  <span className="font-mono text-xs text-ink/50 md:pt-2 md:text-right">
                    {t.when}
                  </span>
                  <span
                    aria-hidden
                    className={`hidden text-2xl text-ink/50 transition-transform md:block ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <ul className="mt-5 space-y-3 text-sm text-ink/75 md:max-w-3xl">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink/40" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </Reveal>
          );
        })}
      </ol>

      <div className="mt-20 grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink/50">Education</p>
          <ul className="mt-6 space-y-6">
            {education.map((e) => (
              <li key={e.degree}>
                <h3 className="font-display text-xl font-bold tracking-[-0.01em]">{e.degree}</h3>
                <p className="mt-1 text-sm text-ink/70">{e.school}</p>
                <p className="mt-1 font-mono text-xs text-ink/50">{e.when}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-xs font-medium uppercase tracking-[0.12em] text-ink/50">Certifications</p>
          <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span>{c.name}</span>
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-ink/50">{c.issuer}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((g, i) => (
              <img
                key={g.src}
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className={`aspect-[3/4] w-full rounded-2xl object-cover ring-1 ring-ink/10 ${i === 1 ? "mt-6" : ""}`}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-ink/50">
            FIU Commencement, M.S. 2024
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
