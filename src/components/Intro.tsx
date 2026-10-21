import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { intro } from "../content";

// A three-second hello on a visitor's first visit: the avatar drops in, "says" the greeting
// (the mouth moves as the words appear), blinks, and the portfolio slides in. Any click, key,
// scroll or touch skips it. Shown once per visitor; `?intro` shows it again (for testing).

const SEEN = "intro-seen";
const TALK_AT = [1250, 1500, 1750, 2000];   // ms: mouth open for the greeting's words
const BLINK_AT = 2500;
const DONE_AT = 3500;

export default function Intro() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    if (new URLSearchParams(location.search).has("intro")) return true;
    try { return !localStorage.getItem(SEEN); } catch { return true; }
  });
  const [frame, setFrame] = useState<"idle" | "talk" | "blink">("idle");
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const close = () => {
      try { localStorage.setItem(SEEN, "1"); } catch { /* private mode: it shows again next time */ }
      setOpen(false);
    };
    const timers = [
      ...TALK_AT.flatMap((t) => [setTimeout(() => setFrame("talk"), t), setTimeout(() => setFrame("idle"), t + 140)]),
      setTimeout(() => setFrame("blink"), BLINK_AT),
      setTimeout(() => setFrame("idle"), BLINK_AT + 150),
      setTimeout(close, reduce ? 2200 : DONE_AT),
    ];
    const skip = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    skip.forEach((ev) => window.addEventListener(ev, close, { passive: true }));
    document.body.style.overflow = "hidden";
    return () => {
      timers.forEach(clearTimeout);
      skip.forEach((ev) => window.removeEventListener(ev, close));
      document.body.style.overflow = "";
    };
  }, [open, reduce]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label={`${intro.greeting} ${intro.line}`}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-end overflow-hidden bg-paper"
          exit={{ y: reduce ? 0 : "-100%", opacity: reduce ? 0 : 1 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="absolute inset-x-0 top-[14vh] z-10 text-center">
            <p className="font-serif text-5xl italic sm:text-6xl">
              {intro.greeting.split(" ").map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block whitespace-pre"
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 1.2 + i * 0.25, duration: 0.5 }}
                >
                  {w}{" "}
                </motion.span>
              ))}
            </p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.5 }} className="mt-3 text-ink/60">
              {intro.line}
            </motion.p>
          </div>

          <motion.div
            initial={reduce ? { opacity: 0 } : { y: "-100vh" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            transition={reduce ? { duration: 0.4 } : { type: "spring", bounce: 0.25, duration: 1.1 }}
            className="relative h-[62vh] [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
          >
            {(["idle", "talk", "blink"] as const).map((f) => (
              <img
                key={f}
                src={intro.frames[f]}
                alt=""
                draggable={false}
                className={`h-full w-auto select-none ${f === "idle" ? "relative" : `absolute inset-0 ${frame === f ? "opacity-100" : "opacity-0"}`}`}
              />
            ))}
          </motion.div>

          <p className="absolute bottom-5 right-6 text-xs text-ink/40">Click anywhere to skip</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
