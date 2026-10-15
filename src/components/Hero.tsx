import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "../content";

// Types out each role, pauses, deletes, moves to the next.
function useTyped(words: string[]) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[i];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let delay = deleting ? 35 : 70;
    if (!deleting && n === word.length) delay = 1400;
    const t = setTimeout(() => {
      if (!deleting && n === word.length) setDeleting(true);
      else if (deleting && n === 0) {
        setDeleting(false);
        setI((i + 1) % words.length);
      } else setN(n + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(t);
  }, [n, deleting, i, words]);

  const reduce =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reduce ? words[0] : words[i].slice(0, n);
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay },
});

export default function Hero() {
  const typed = useTyped(profile.roles);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-28 sm:px-8"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-7">
          <motion.p
            {...fade(0.1)}
            className="font-mono text-xs uppercase tracking-[0.12em] text-ink/60"
          >
            {typed}
            <span aria-hidden className="ml-0.5 text-ink/40">|</span>
          </motion.p>

          <motion.h1
            {...fade(0.2)}
            className="max-w-[10ch] font-display text-5xl font-bold leading-[0.95] tracking-[-0.035em] sm:text-7xl md:text-8xl"
          >
            {profile.headline}
          </motion.h1>

          <motion.p {...fade(0.35)} className="max-w-md text-base text-ink/70 sm:text-lg">
            {profile.tagline}
          </motion.p>

          <motion.div {...fade(0.5)} className="flex flex-wrap gap-3">
            <a
              href="#projects"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition duration-100 hover:bg-white active:scale-[0.97]"
            >
              View my work
            </a>
            <a
              href={profile.resume}
              download
              className="rounded-full border border-ink/25 px-6 py-3 text-sm font-medium transition duration-100 hover:border-ink/60 active:scale-[0.97]"
            >
              Download Resume
            </a>
            <a
              href="#contact"
              className="rounded-full border border-ink/25 px-6 py-3 text-sm font-medium transition duration-100 hover:border-ink/60 active:scale-[0.97]"
            >
              Let's talk
            </a>
          </motion.div>

          <motion.dl
            {...fade(0.7)}
            className="mt-2 grid max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-6"
          >
            {profile.heroStats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-ink/55">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-xs md:max-w-sm"
        >
          <img
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            className="relative aspect-[3/4] w-full rounded-[28px] object-cover object-top ring-1 ring-ink/10"
          />
          <div className="absolute bottom-4 left-4 rounded-full bg-paper/60 px-3.5 py-1.5 text-xs font-medium text-ink backdrop-blur-xl backdrop-saturate-150">
            {profile.location}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
