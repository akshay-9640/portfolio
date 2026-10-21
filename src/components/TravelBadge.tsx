import { useEffect, useRef, useState } from "react";
import { contact, profile } from "../content";

// The site's one signature: an ID badge on a lanyard hanging from the top of the screen that
// travels with the reader. Sections reserve its spot with <BadgeSpot name="..."/>; the badge
// glides to whichever spot is nearest the middle of the screen, tilting as it moves (a damped
// pendulum driven by its own acceleration), and leaves upward where no spot is in view.
// Front: ID. Back: contact. The Contact spot shows the back; a tap flips it anywhere.
// Grab and fling it: the drag tracks 1:1 and the release keeps its velocity.

export const CARD_W = 264;
export const CARD_H = 380;
const FACE: Record<string, "front" | "back"> = { hero: "front", about: "front", contact: "back" };

/** A reserved place in a section's layout where the badge comes to hang. */
export function BadgeSpot({ name, className = "" }: { name: keyof typeof FACE; className?: string }) {
  return <div data-badge={name} aria-hidden className={`shrink-0 ${className}`} style={{ width: CARD_W, height: CARD_H }} />;
}

export default function TravelBadge() {
  const rig = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [face, setFace] = useState<"front" | "back">("front");
  const [shown, setShown] = useState(false);
  const flipped = useRef<{ spot: string | null; face: "front" | "back" } | null>(null);   // a tap's choice, until the spot changes
  const dragged = useRef(false);
  const spotNow = useRef<string | null>(null);

  useEffect(() => {
    const el = rig.current, cardEl = card.current;
    if (!el || !cardEl) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = innerWidth * 0.7, y = -CARD_H - 120, vx = 0, vy = 0;
    let theta = 0, omega = 0, lastSpot: string | null = null, raf = 0, prev = 0;
    let lastScroll = scrollY, scrollV = 0;
    let grab: { x: number; theta: number; t: number } | null = null;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - (prev || now)) / 1000, 1 / 30);
      prev = now;

      // The spot nearest the middle of the screen, if any is on screen.
      let best: HTMLElement | null = null, bestD = Infinity;
      for (const s of document.querySelectorAll<HTMLElement>("[data-badge]")) {
        const r = s.getBoundingClientRect();
        if (r.bottom < innerHeight * 0.1 || r.top > innerHeight * 0.85 || r.width === 0) continue;
        const d = Math.abs(r.top + r.height / 2 - innerHeight / 2);
        if (d < bestD) { best = s; bestD = d; }
      }
      const spot = best?.dataset.badge ?? null;
      const r = best?.getBoundingClientRect();
      const tx = r ? r.left : x, ty = r ? r.top : -CARD_H - 160;

      if (spot !== lastSpot) {
        if (flipped.current && flipped.current.spot !== spot) flipped.current = null;   // a tap's choice lasts for its spot
        if (spot) setFace(flipped.current?.face ?? FACE[spot]);
        spotNow.current = spot;
        if (spot && !lastSpot && !reduce) theta = 0.35 * Math.sign(tx - x || 1);   // dropping in: arrive swinging
        lastSpot = spot;
        setShown(!!spot);
      }

      // Position: a spring that trails the spot a little, so the badge feels carried, not glued.
      const ax = reduce ? 0 : 120 * (tx - x) - 19 * vx;
      if (reduce) { x = tx; y = ty; } else {
        vx += ax * dt; vy += (120 * (ty - y) - 19 * vy) * dt;
        x += vx * dt; y += vy * dt;
      }
      // Tilt: the badge lags its own sideways acceleration and the page's scroll, then settles.
      const v = (scrollY - lastScroll) / Math.max(dt, 1 / 120);
      lastScroll = scrollY;
      const push = Math.max(-3, Math.min(3, ((v - scrollV) / Math.max(dt, 1 / 120)) * 0.00008 + ax * 0.0009));
      scrollV = v;
      if (!grab && !reduce) {
        const over = Math.max(0, Math.abs(theta) - 0.45) * Math.sign(theta);
        omega += (-14 * Math.sin(theta) - 140 * over - 1.6 * omega - push) * dt;
        theta += omega * dt;
      }
      // Wide screens: the lanyard runs from the top of the screen to the card. Phones: a short
      // lanyard, since the badge sits under the text there and a long one would cross it.
      const strap = innerWidth >= 768 ? Math.max(0, y) : Math.min(Math.max(0, y), 72);
      el.style.height = `${strap + CARD_H}px`;
      el.style.transform = `translate3d(${x}px, ${y - strap}px, 0) rotate(${theta}rad)`;
    };
    raf = requestAnimationFrame(frame);

    const down = (e: PointerEvent) => {
      dragged.current = false;
      grab = { x: e.clientX, theta, t: performance.now() };
      cardEl.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!grab) return;
      const dx = e.clientX - grab.x;
      if (Math.abs(dx) > 5) dragged.current = true;
      const next = Math.max(-0.8, Math.min(0.8, grab.theta + Math.atan2(dx, el.offsetHeight)));
      const now = performance.now();
      omega = (next - theta) / Math.max((now - grab.t) / 1000, 1 / 120);
      theta = next;
      grab.t = now;
    };
    const up = () => { grab = null; };
    cardEl.addEventListener("pointerdown", down);
    cardEl.addEventListener("pointermove", move);
    cardEl.addEventListener("pointerup", up);
    cardEl.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      cardEl.removeEventListener("pointerdown", down);
      cardEl.removeEventListener("pointermove", move);
      cardEl.removeEventListener("pointerup", up);
      cardEl.removeEventListener("pointercancel", up);
    };
  }, []);

  const flip = () => {
    if (dragged.current) { dragged.current = false; return; }   // a fling is not a tap
    const next = face === "front" ? "back" : "front";
    flipped.current = { spot: spotNow.current, face: next };
    setFace(next);
  };

  return (
    <div aria-hidden={!shown} className={`pointer-events-none fixed left-0 top-0 z-40 ${shown ? "" : "invisible"}`}>
      <div ref={rig} className="flex flex-col items-center will-change-transform" style={{ width: CARD_W, transformOrigin: "50% 0" }}>
        <div aria-hidden className="w-[3px] flex-1 bg-gradient-to-b from-ink/0 via-ink/20 to-ink/40" />
        <div aria-hidden className="-mt-0.5 h-3.5 w-7 rounded-[5px] border-2 border-ink/40" />
        <div ref={card} className="pointer-events-auto -mt-1 cursor-grab touch-pan-y select-none active:cursor-grabbing" style={{ perspective: 1000 }}>
          <button
            type="button"
            onClick={flip}
            tabIndex={shown ? 0 : -1}
            aria-label={face === "front" ? "ID badge. Flip for contact details" : "Contact card. Flip back to the ID side"}
            className="relative block rounded-[24px] text-left transition-transform duration-500 [transform-style:preserve-3d]"
            style={{ width: CARD_W, height: CARD_H - 32, transform: `rotateY(${face === "back" ? 180 : 0}deg)` }}
          >
            <div className="absolute inset-0 flex flex-col rounded-[24px] border border-ink/15 bg-card p-4 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] [backface-visibility:hidden]">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/20" />
              <img src={profile.photo} alt="" draggable={false} className="h-48 w-full rounded-xl object-cover object-top" />
              <p className="mt-4 font-display text-xl font-bold leading-tight">{profile.name}</p>
              <p className="font-serif text-lg italic text-ink/65">{profile.headline}</p>
              <p className="mt-auto text-[11px] text-ink/45">{profile.location} · tap to flip, drag to swing</p>
            </div>
            <div className="absolute inset-0 flex flex-col rounded-[24px] border border-ink/15 bg-card p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink/45">Contact</p>
              <p className="mt-2 font-display text-xl font-bold leading-tight">{profile.name}</p>
              <ul className="mt-5 space-y-3 text-sm">
                <li><a tabIndex={shown && face === "back" ? 0 : -1} onClick={(e) => e.stopPropagation()} href={`mailto:${contact.email}`} className="text-[13px] text-ink/85 underline-offset-4 hover:text-ink hover:underline">{contact.email}</a></li>
                <li><a tabIndex={shown && face === "back" ? 0 : -1} onClick={(e) => e.stopPropagation()} href={contact.github} target="_blank" rel="noreferrer" className="text-ink/85 underline-offset-4 hover:text-ink hover:underline">GitHub ↗</a></li>
                <li><a tabIndex={shown && face === "back" ? 0 : -1} onClick={(e) => e.stopPropagation()} href={contact.linkedin} target="_blank" rel="noreferrer" className="text-ink/85 underline-offset-4 hover:text-ink hover:underline">LinkedIn ↗</a></li>
              </ul>
              <p className="mt-auto text-[11px] text-ink/45">{contact.location} · tap to flip back</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

