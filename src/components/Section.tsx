import type { ReactNode } from "react";
import type { Heading } from "../content";
import Reveal from "./Reveal";

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
          <span className="text-ink/45">{heading.before}</span> {heading.accent}
        </h2>
      </Reveal>
      <div className="mt-12 md:mt-16">{children}</div>
    </section>
  );
}
