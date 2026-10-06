import { motion } from "framer-motion";
import { categories, headings, skills } from "../content";
import Section from "./Section";

export default function Skills() {
  return (
    <Section id="stack" heading={headings.stack}>
      <div className="grid gap-y-10">
        {categories.map((cat, ci) => {
          const items = skills.filter((s) => s.cat === cat);
          return (
            <div key={cat}>
              <h3 className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                <span>{String(ci + 1).padStart(2, "0")}</span>
                <span>{cat}</span>
                <span className="h-px flex-1 bg-ink/15" />
              </h3>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,5.5rem))] gap-2">
                {items.map((s, i) => (
                  <motion.li
                    key={s.name}
                    title={`${s.name} — ${s.cat}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.35, delay: i * 0.03 }}
                    whileHover={{ y: -3 }}
                    className="flex aspect-square flex-col items-center justify-center rounded-lg border border-ink/20 bg-card p-1.5 text-center transition-colors hover:border-accent"
                  >
                    <span className="font-serif text-2xl font-bold leading-none text-accent">
                      {s.sym}
                    </span>
                    <span className="mt-2 text-[10px] leading-tight text-ink/80">{s.name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
