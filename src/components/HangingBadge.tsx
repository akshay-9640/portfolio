import { useEffect, useRef, type ReactNode } from "react";

// An ID badge hanging from a lanyard, as a damped pendulum. It drops in from above when it
// comes into view, swings and settles; fast scrolling sways it; it can be grabbed and flung
// (drag tracks 1:1 and the release keeps its velocity). Clicks pass through to the card unless
// the pointer moved, so a flip-on-click card inside keeps working.
// Reduced motion: it simply hangs still.

const PULL = 26;        // gravity over length (1/s^2): about a 1.2 s swing
const DAMP = 1.7;       // settles in about 2 s
const SCROLL_DRIVE = 0.00012;
const MAX_PUSH = 3;      // cap on the scroll push (rad/s^2): a hard wheel flick must not throw it sideways
const LIMIT = 0.55;      // past about 30 degrees the lanyard pulls back hard

type Props = { children: ReactNode; strap?: number; className?: string };

export default function HangingBadge({ children, strap = 96, className = "" }: Props) {
  const rig = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);

  useEffect(() => {
    const el = rig.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let theta = 0, omega = 0, drop = 0, dropV = 0;
    let raf = 0, prev = 0, visible = false, entered = false;
    let lastScroll = window.scrollY, scrollV = 0;
    let grab: { x: number; y: number; theta: number; t: number; vx: number } | null = null;

    const frame = (now: number) => {
      raf = visible || Math.abs(omega) + Math.abs(theta) + Math.abs(drop) > 0.001 ? requestAnimationFrame(frame) : 0;
      const dt = Math.min((now - (prev || now)) / 1000, 1 / 30);
      prev = now;
      // Scroll acceleration pushes the badge the other way, like a card on a lanyard in a moving bus.
      const v = (window.scrollY - lastScroll) / Math.max(dt, 1 / 120);
      lastScroll = window.scrollY;
      const accel = (v - scrollV) / Math.max(dt, 1 / 120);
      scrollV = v;
      if (!grab) {
        const push = Math.max(-MAX_PUSH, Math.min(MAX_PUSH, accel * SCROLL_DRIVE));
        const over = Math.max(0, Math.abs(theta) - LIMIT) * Math.sign(theta);
        omega += (-PULL * Math.sin(theta) - 140 * over - DAMP * omega - push) * dt;
        theta += omega * dt;
      }
      // The drop: a slightly underdamped spring, so it lands with a small bounce.
      dropV += (-170 * drop - 18 * dropV) * dt;
      drop += dropV * dt;
      el.style.transform = `translateY(${drop}px) rotate(${theta}rad)`;
    };
    const start = () => { if (!raf) { prev = 0; raf = requestAnimationFrame(frame); } };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !entered) {   // first time in view: fall in from above, already swinging
        entered = true;
        drop = -Math.min(window.innerHeight * 0.6, 520);
        theta = 0.38;
      }
      if (visible) start();
    }, { threshold: 0.25 });
    io.observe(el);

    const down = (e: PointerEvent) => {
      dragged.current = false;
      grab = { x: e.clientX, y: e.clientY, theta, t: performance.now(), vx: 0 };
      el.setPointerCapture(e.pointerId);
      start();
    };
    const move = (e: PointerEvent) => {
      if (!grab) return;
      const dx = e.clientX - grab.x;
      if (Math.abs(dx) > 5) dragged.current = true;
      const len = el.offsetHeight * 0.75;
      const next = Math.max(-0.9, Math.min(0.9, grab.theta + Math.atan2(dx, len)));
      const now = performance.now();
      omega = (next - theta) / Math.max((now - grab.t) / 1000, 1 / 120);   // release velocity
      theta = next;
      grab.t = now;
    };
    const up = () => { grab = null; };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className={`relative ${className}`} style={{ paddingTop: strap }}>
      <div
        ref={rig}
        // A drag must not also click (flip) the card inside.
        onClickCapture={(e) => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false; } }}
        className="absolute inset-x-0 top-0 flex touch-pan-y select-none flex-col items-center will-change-transform"
        style={{ transformOrigin: "50% 0" }}
      >
        <div aria-hidden className="h-[var(--strap)] w-[3px] rounded-full bg-gradient-to-b from-ink/5 to-ink/35" style={{ ["--strap" as string]: `${strap}px` }} />
        <div aria-hidden className="-mt-1 h-3 w-6 rounded-[4px] border-2 border-ink/35" />
        <div className="-mt-0.5 cursor-grab active:cursor-grabbing">{children}</div>
      </div>
      {/* Keeps the layout height of the hanging card (the rig itself is absolutely placed). */}
      <div aria-hidden className="invisible">{children}</div>
    </div>
  );
}
