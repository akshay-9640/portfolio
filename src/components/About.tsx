import { headings, profile } from "../content";
import Reveal from "./Reveal";
import Section from "./Section";
import { BadgeSpot } from "./TravelBadge";

export default function About() {
  return (
    <Section id="about" heading={headings.about}>
      <div className="grid items-center gap-12 md:grid-cols-[auto_1fr] md:gap-20">
        {/* The badge swings over from the hero to hang here. */}
        <BadgeSpot name="about" className="mx-auto" />
        <div>
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
      </div>
    </Section>
  );
}
