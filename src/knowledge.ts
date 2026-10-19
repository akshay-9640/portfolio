// Grounding for the "Ask Akshay" chat. Built only from content.ts so the answers
// can never drift from what the site says.
import { achievements, certifications, contact, education, profile, projects, stackLayers, timeline } from "./content";

export type Chunk = { id: string; title: string; text: string };

export const chunks: Chunk[] = [
  { id: "about", title: "About Akshay", text: `${profile.name}, ${profile.headline}, based in ${profile.location}. ${profile.bio}` },
  ...timeline.flatMap((t) =>
    t.bullets.map((b, i) => ({ id: `${t.org}-${i}`, title: `${t.title}, ${t.org} (${t.when})`, text: b }))
  ),
  ...projects.map((p) => ({
    id: p.title,
    title: `Project: ${p.title}`,
    text: `${p.description} Tech: ${p.tags.join(", ")}. Problem: ${p.study.problem} Solution: ${p.study.solution} Result: ${p.study.result}${p.github ? ` Code: ${p.github}` : ""}`,
  })),
  ...stackLayers.map((l) => ({ id: `stack-${l.name}`, title: `Skills: ${l.name}`, text: `${l.role} ${l.tools.map((t) => t.name).join(", ")}.` })),
  { id: "certs", title: "Certifications", text: certifications.map((c) => `${c.issuer} ${c.name}`).join("; ") },
  { id: "edu", title: "Education", text: education.map((e) => `${e.degree}, ${e.school}, ${e.when}`).join("; ") },
  { id: "highlights", title: "Highlights", text: achievements.map((a) => `${a.value} ${a.label}`).join("; ") },
  { id: "contact", title: "Contact", text: `Email ${contact.email}. LinkedIn ${contact.linkedin}. GitHub ${contact.github}. Location ${contact.location}.` },
];

const tokenize = (s: string) => s.toLowerCase().match(/[a-z0-9+.#]{2,}/g) ?? [];
const STOP = new Set(["the", "and", "what", "does", "has", "have", "his", "him", "how", "who", "with", "for", "are", "about", "did", "can", "you", "akshay", "tell", "me"]);

export function retrieve(question: string, k = 3): Chunk[] {
  const q = tokenize(question).filter((t) => !STOP.has(t));
  if (!q.length) return [];
  return chunks
    .map((c) => {
      const words = new Set(tokenize(`${c.title} ${c.text}`));
      const hits = q.filter((t) => words.has(t)).length;
      return { c, score: hits + (c.title.toLowerCase().includes(q[0]) ? 0.5 : 0) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((r) => r.c);
}
