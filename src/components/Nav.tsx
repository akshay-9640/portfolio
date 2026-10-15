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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8"
      >
        <a href="#top" className="font-serif text-lg font-extrabold">
          {profile.name}
        </a>

        <ul className="hidden gap-6 text-sm lg:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="transition hover:text-accent">
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="rounded-full border border-ink px-4 py-1.5 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
        style={{ transform: `scaleX(${progress})` }}
      />

      {open && (
        <ul
          id="mobile-menu"
          className="border-t border-ink/10 bg-paper px-5 py-4 lg:hidden"
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
