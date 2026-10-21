import { useState } from "react";
import { motion } from "framer-motion";
import { headings, profile } from "../content";
import HangingBadge from "./HangingBadge";
import Reveal from "./Reveal";
import Section from "./Section";

export default function About() {
  // Hover (mouse only) shows the back while the pointer is over the card. A click or
  // tap flips to the other side and keeps it there. Hover is detected on the static
  // button, never on the rotating face, so the card can't flicker mid-turn.
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const flipped = hovered || pinned;

  return (
    <Section id="about" heading={headings.about}>
      <div className="grid items-start gap-10 md:grid-cols-[auto_1fr] md:gap-24">
        <HangingBadge className="mx-auto">
        <button
          type="button"
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
          onClick={() => {
            setPinned(!flipped);
            setHovered(false);
          }}
          aria-pressed={flipped}
          aria-label={flipped ? "Show front of ID card" : "Show back of ID card"}
          className="perspective relative h-[460px] w-[300px] rounded-[28px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink sm:h-[480px] sm:w-[320px]"
        >
          <motion.div
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
            className="preserve-3d pointer-events-none absolute inset-0"
          >
            {/* Front */}
            <div className="backface-hidden absolute inset-0 flex flex-col rounded-[28px] border border-ink/15 bg-card p-4">
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-ink/20" />
              <img
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                className="h-64 w-full rounded-xl bg-paper object-cover object-top"
              />
              <p className="mt-5 px-1 font-display text-2xl font-bold tracking-[-0.01em]">{profile.name}</p>
              <p className="mt-1 px-1 text-xs uppercase tracking-[0.08em] text-ink/60">
                {profile.headline}
              </p>
              <p className="mt-auto px-1 text-xs text-ink/50">Hover or tap to flip</p>
            </div>

            {/* Back */}
            <div
              className="backface-hidden absolute inset-0 flex flex-col rounded-[28px] bg-ink p-6 text-paper"
              style={{ transform: "rotateY(180deg)" }}
            >
              <p className="text-[11px] uppercase tracking-[0.12em] opacity-60">
                Profile
              </p>
              <p className="mt-3 font-display text-2xl font-bold tracking-[-0.01em]">{profile.name}</p>
              <p className="mt-1 text-xs opacity-80">{profile.idTitle}</p>
              <p className="mt-1 text-xs opacity-80">{profile.location}</p>
              <p className="mt-4 text-[13px] leading-relaxed opacity-90">{profile.bio}</p>
              <ul className="mt-auto flex flex-wrap gap-2">
                {profile.badgeTech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-paper/25 px-3 py-1 text-[11px]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </button>
        </HangingBadge>

        <div className="self-center md:pt-24">
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {profile.facts.map((f) => (
            <Reveal key={f.label}>
              <dt className="text-xs font-medium uppercase tracking-[0.1em] text-ink/45">{f.label}</dt>
              <dd className="mt-1.5 font-display text-xl font-bold tracking-[-0.01em]">{f.value}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal>
          <p className="mt-8 max-w-xl text-ink/70">{profile.bio}</p>
        </Reveal>
        </div>
        <ul className="grid w-full gap-4 md:col-span-2 md:grid-cols-3">
          {profile.pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <li className="h-full rounded-2xl border border-ink/10 bg-card p-6">
                <p className="font-mono text-xs text-ink/40">0{i + 1}</p>
                <h3 className="mt-3 font-display text-xl font-bold tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{p.text}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
