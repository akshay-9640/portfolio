import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";

// The dashed path that winds from card to card. It is drawn up to where the reader has
// scrolled (a mask whose length follows the scroll), with a small dot at its tip. The page
// itself scrolls normally: nothing is pinned and nothing moves sideways against the scroll.
export default function TravelPath({ box, cards }: { box: React.RefObject<HTMLElement>; cards: React.MutableRefObject<(HTMLElement | null)[]> }) {
  const [d, setD] = useState("");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const line = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const { scrollYProgress } = useScroll({ target: box, offset: ["start 70%", "end 70%"] });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const build = () => {
      const b = el.getBoundingClientRect();
      // Each stop is the card's inner edge (the side facing the middle), vertically centered.
      const pts = cards.current.filter(Boolean).map((c, i) => {
        const r = c!.getBoundingClientRect();
        return { x: (i % 2 === 0 ? r.right - 40 : r.left + 40) - b.left, y: r.top + r.height / 2 - b.top };
      });
      if (pts.length < 2) return;
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], c = pts[i], my = (a.y + c.y) / 2;
        path += ` C ${a.x} ${my}, ${c.x} ${my}, ${c.x} ${c.y}`;   // an S-curve between stops
      }
      setD(path);
      setSize({ w: b.width, h: b.height });
    };
    const ro = new ResizeObserver(build);
    ro.observe(el);
    build();
    return () => ro.disconnect();
  }, [box, cards]);

  useEffect(() => scrollYProgress.on("change", (v) => {
    const l = line.current, c = dot.current;
    if (!l || !c) return;
    const pt = l.getPointAtLength(l.getTotalLength() * Math.min(1, Math.max(0, v)));
    c.setAttribute("cx", String(pt.x));
    c.setAttribute("cy", String(pt.y));
  }), [scrollYProgress, d]);

  if (!d) return null;
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 hidden md:block" width={size.w} height={size.h}>
      <defs>
        <mask id="path-reveal" maskUnits="userSpaceOnUse">
          <motion.path d={d} fill="none" stroke="white" strokeWidth={6} style={{ pathLength: scrollYProgress }} />
        </mask>
      </defs>
      <path d={d} fill="none" className="stroke-ink/[0.07]" strokeWidth={2} strokeDasharray="6 10" />
      <path ref={line} d={d} fill="none" className="stroke-ink/45" strokeWidth={2} strokeDasharray="6 10" mask="url(#path-reveal)" />
      <circle ref={dot} r={6} className="fill-ink" />
    </svg>
  );
}
