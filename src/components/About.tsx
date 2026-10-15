import { useState } from "react";
import { motion } from "framer-motion";
import { headings, profile } from "../content";
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
      <div className="flex flex-col items-center gap-6">
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
          className="perspective relative h-[460px] w-[300px] rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:h-[480px] sm:w-[320px]"
        >
          <motion.div
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="preserve-3d pointer-events-none absolute inset-0"
          >
            {/* Front */}
            <div className="backface-hidden absolute inset-0 flex flex-col rounded-2xl border border-ink bg-card p-5 shadow-sm">
              <div className="mx-auto mb-4 h-2 w-16 rounded-full bg-accent" />
              <img
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                className="h-64 w-full rounded-lg border border-ink/20 bg-paper object-cover object-top"
              />
              <p className="mt-5 font-serif text-2xl font-extrabold">{profile.name}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-ink/60">
                {profile.headline}
              </p>
              <p className="mt-auto text-xs text-ink/50">Hover or tap to flip</p>
            </div>

            {/* Back */}
            <div
              className="backface-hidden absolute inset-0 flex flex-col rounded-2xl border border-ink bg-accent p-6 text-paper"
              style={{ transform: "rotateY(180deg)" }}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">
                Profile
              </p>
              <p className="mt-3 font-serif text-2xl font-extrabold">{profile.name}</p>
              <p className="mt-1 text-xs opacity-80">{profile.idTitle}</p>
              <p className="mt-1 text-xs opacity-80">{profile.location}</p>
              <p className="mt-4 text-[13px] leading-relaxed opacity-90">{profile.bio}</p>
              <ul className="mt-auto flex flex-wrap gap-2">
                {profile.badgeTech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-paper/50 px-3 py-1 text-[11px]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </button>
        <ul className="mt-6 grid w-full gap-4 md:grid-cols-3">
          {profile.pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <li className="h-full rounded-2xl border border-ink/20 bg-card p-6">
                <p className="font-mono text-xs text-accent">0{i + 1}</p>
                <h3 className="mt-3 font-serif text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{p.text}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
