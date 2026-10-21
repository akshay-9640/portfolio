import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import { intro } from "../content";

// First-visit intro: the avatar drops in, turns toward the cursor, and on "Play intro" speaks
// the script with the browser's voice while its mouth moves and the words light up as
// subtitles. Browsers only allow sound after a click, hence the button. Shown once per
// visitor; the footer's "Replay intro" (an `intro:open` event) or `?intro` brings it back.

const SEEN = "intro-seen";
// Male English voices, best first: macOS/iOS (Rishi, Aman: Indian English), Chrome, Windows, then others.
const MALE = ["Rishi", "Aman", "Google UK English Male", "Microsoft Ravi", "Daniel", "Microsoft Guy", "Microsoft David", "Microsoft Ryan", "Aaron", "Alex", "Fred"];
// Never fall back to these: the browsers' default female voices.
const FEMALE = /samantha|victoria|karen|moira|tessa|fiona|veena|tara|kathy|zira|aria|jenny|susan|hazel|heera|female|google us english/i;

/** The voice list arrives a moment after load in Chrome: wait for it (up to 1.5 s) before choosing. */
async function pickVoice() {
  let all = speechSynthesis.getVoices();
  if (!all.length)
    all = await new Promise<SpeechSynthesisVoice[]>((done) => {
      const t = setTimeout(() => done(speechSynthesis.getVoices()), 1500);
      speechSynthesis.addEventListener("voiceschanged", () => { clearTimeout(t); done(speechSynthesis.getVoices()); }, { once: true });
    });
  return MALE.map((n) => all.find((v) => v.name.startsWith(n) && v.lang.startsWith("en"))).find(Boolean)
    ?? all.find((v) => v.lang.startsWith("en") && !FEMALE.test(v.name));
}

type Phase = "hello" | "talking" | "done";

export default function Intro() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    if (new URLSearchParams(location.search).has("intro")) return true;
    try { return !localStorage.getItem(SEEN); } catch { return true; }
  });
  const [phase, setPhase] = useState<Phase>("hello");
  const [frame, setFrame] = useState<"idle" | "talk" | "blink">("idle");
  const [spoken, setSpoken] = useState(0);   // characters of the script already spoken
  const reduce = useReducedMotion();
  const tiltX = useSpring(0, { stiffness: 120, damping: 20 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 20 });
  const primary = useRef<HTMLButtonElement>(null);
  const talking = useRef(false);

  useEffect(() => {
    const reopen = () => { setPhase("hello"); setSpoken(0); setOpen(true); };
    window.addEventListener("intro:open", reopen);
    return () => window.removeEventListener("intro:open", reopen);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    primary.current?.focus({ preventScroll: true });
    // Head and shoulders turn toward the cursor, a few degrees, on a spring.
    const look = (e: PointerEvent) => {
      if (reduce) return;
      tiltY.set((e.clientX / innerWidth - 0.5) * 22);
      tiltX.set(-(e.clientY / innerHeight - 0.5) * 12);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("pointermove", look);
    window.addEventListener("keydown", key);
    // Blink every few seconds, never while a word is mid-mouth.
    let blinkTimer = 0;
    const blink = () => {
      blinkTimer = window.setTimeout(() => {
        if (!talking.current) { setFrame("blink"); setTimeout(() => setFrame((f) => (f === "blink" ? "idle" : f)), 140); }
        blink();
      }, 2400 + Math.random() * 2600);
    };
    blink();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("pointermove", look);
      window.removeEventListener("keydown", key);
      clearTimeout(blinkTimer);
    };
  }, [open, reduce]);

  const close = () => {
    try { speechSynthesis.cancel(); } catch { /* no speech support */ }
    try { localStorage.setItem(SEEN, "1"); } catch { /* private mode */ }
    talking.current = false;
    setOpen(false);
  };

  const play = async () => {
    setSpoken(0);
    setPhase("talking");
    if (!("speechSynthesis" in window)) {   // no voice: the subtitles still play through
      let i = 0;
      const t = setInterval(() => { i += 6; setSpoken(i); if (i >= intro.script.length) { clearInterval(t); setPhase("done"); } }, 90);
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(intro.script);
    u.voice = (await pickVoice()) ?? null;
    u.lang = u.voice?.lang ?? "en-US";
    u.rate = 1;
    // Mouth: open on each word, closed in between; a steady flap covers voices with no word events.
    let lastWord = 0;
    const flap = setInterval(() => {
      if (talking.current && performance.now() - lastWord > 350) setFrame((f) => (f === "talk" ? "idle" : "talk"));
    }, 150);
    u.onstart = () => { talking.current = true; };
    u.onboundary = (e) => {
      if (e.name && e.name !== "word") return;
      lastWord = performance.now();
      setSpoken(e.charIndex + (e.charLength || 1));
      setFrame("talk");
      setTimeout(() => setFrame("idle"), 120);
    };
    u.onend = u.onerror = () => {
      talking.current = false;
      clearInterval(flap);
      setFrame("idle");
      setSpoken(intro.script.length);
      setPhase("done");
    };
    speechSynthesis.speak(u);
  };

  const btn = "rounded-full px-6 py-3 text-sm font-semibold transition duration-100 active:scale-[0.97]";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Introduction"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 overflow-hidden bg-paper px-5 md:flex-row md:gap-16"
          exit={{ opacity: 0, y: reduce ? 0 : -40 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* A soft floor of light under the avatar; neutral, not a glow color. */}
          <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-[40vh] w-[80vw] -translate-x-1/2 rounded-[50%] bg-ink/[0.05] blur-3xl md:left-[38%]" />

          <motion.div
            initial={reduce ? { opacity: 0 } : { y: "-110vh" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            transition={reduce ? { duration: 0.4 } : { type: "spring", bounce: 0.3, duration: 1.1 }}
            className="relative h-[46vh] shrink-0 md:h-[80vh]"
            style={{ perspective: 900 }}
          >
            <motion.div style={{ rotateX: tiltX, rotateY: tiltY }} className="relative h-full [mask-image:linear-gradient(to_bottom,black_82%,transparent)]">
              {(["idle", "talk", "blink"] as const).map((f) => (
                <img
                  key={f}
                  src={intro.frames[f]}
                  alt={f === "idle" ? "Animated portrait of Akshay" : ""}
                  aria-hidden={f !== "idle"}
                  draggable={false}
                  className={`h-full w-auto select-none ${f === "idle" ? "relative" : "absolute inset-0"} ${f === "idle" || frame === f ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0.2 : 0.9, duration: 0.5 }}
            className="relative z-10 w-full max-w-md rounded-[24px] border border-ink/10 bg-card/90 p-6 backdrop-blur-xl"
          >
            <p className="font-serif text-4xl italic leading-tight">{intro.greeting}</p>
            <p className="mt-4 min-h-[7.5rem] text-[15px] leading-relaxed" aria-live="polite">
              {phase === "hello" ? (
                <span className="text-ink/60">A 20-second introduction, then my portfolio. Sound on for the voice.</span>
              ) : (
                <>
                  <span className="text-ink">{intro.script.slice(0, spoken)}</span>
                  <span className="text-ink/30">{intro.script.slice(spoken)}</span>
                </>
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {phase === "done" ? (
                <>
                  <button ref={primary} type="button" onClick={close} className={`${btn} bg-ink text-paper hover:bg-white`}>Enter portfolio</button>
                  <button type="button" onClick={play} className={`${btn} border border-ink/25 font-medium hover:border-ink/60`}>Replay</button>
                </>
              ) : (
                <>
                  <button ref={primary} type="button" onClick={play} disabled={phase === "talking"} className={`${btn} bg-ink text-paper hover:bg-white disabled:opacity-60`}>
                    {phase === "talking" ? "Speaking..." : "Play intro"}
                  </button>
                  <button type="button" onClick={close} className={`${btn} border border-ink/25 font-medium hover:border-ink/60`}>Skip to portfolio</button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
