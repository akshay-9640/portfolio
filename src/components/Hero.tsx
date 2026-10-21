import { motion } from "framer-motion";
import { profile } from "../content";
import { BadgeSpot } from "./TravelBadge";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay },
});

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center px-5 pb-16 pt-28 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-7">
          <motion.p {...fade(0.1)} className="font-mono text-xs uppercase tracking-[0.12em] text-ink/60">
            {profile.roles.join(" · ")}
          </motion.p>
          <motion.h1
            {...fade(0.2)}
            className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.035em] sm:text-7xl md:text-8xl"
          >
            {profile.headline}
          </motion.h1>
          <motion.p {...fade(0.35)} className="max-w-md text-base text-ink/70 sm:text-lg">
            {profile.tagline}
          </motion.p>
          <motion.div {...fade(0.5)} className="flex flex-wrap gap-3">
            <a href="#projects" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition duration-100 hover:bg-white active:scale-[0.97]">
              View my work
            </a>
            <a href="#contact" className="rounded-full border border-ink/25 px-6 py-3 text-sm font-medium transition duration-100 hover:border-ink/60 active:scale-[0.97]">
              Let's talk
            </a>
          </motion.div>
          <motion.dl {...fade(0.7)} className="mt-2 grid max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-6">
            {profile.heroStats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl">{s.value}</dt>
                <dd className="mt-1 text-xs text-ink/55">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
        {/* The traveling badge hangs here first. */}
        <BadgeSpot name="hero" className="mx-auto md:mt-10" />
      </div>
    </section>
  );
}
