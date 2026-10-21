import type { ReactNode } from "react";
import type { Heading } from "../content";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

// Words fade in one after another from a soft blur (reduced motion: a plain fade).
function Words({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}{i < text.split(" ").length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}

type Props = {
  id: string;
  heading: Heading;
  label?: string;
  children: ReactNode;
  center?: boolean;
};

export default function Section({ id, heading, label, children, center }: Props) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
      <Reveal className={center ? "text-center" : ""}>
        {label && (
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-ink/50">
            {label}
          </p>
        )}
        <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] sm:text-5xl md:text-6xl">
          <Words text={heading.before} className="text-ink/45" />{" "}
          <Words text={heading.accent} delay={heading.before.split(" ").length * 0.07} className="font-serif text-[1.12em] font-normal italic tracking-[-0.01em]" />
        </h2>
      </Reveal>
      <div className="mt-12 md:mt-16">{children}</div>
    </section>
  );
}
