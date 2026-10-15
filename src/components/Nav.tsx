import { useEffect, useState } from "react";
import { nav, profile } from "../content";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-paper/70 backdrop-blur-xl backdrop-saturate-150">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"
      >
        <a href="#top" className="font-display text-lg font-bold tracking-[-0.01em]">
          {profile.name}
        </a>

        <ul className="hidden gap-6 text-sm text-ink/70 lg:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="transition-colors hover:text-ink">
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="rounded-full border border-ink/30 px-4 py-1.5 text-sm transition-transform duration-100 active:scale-[0.97] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink/40"
        style={{ transform: `scaleX(${progress})` }}
      />

      {open && (
        <ul
          id="mobile-menu"
          className="bg-paper/95 px-5 py-4 lg:hidden"
        >
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-base"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
