// The portfolio as a graph: the photo at the center, a hub per part of the site and a node per
// real item, all derived from content.ts. Used by the 3D map and by the detail pane beside it.
import { certifications, education, projects, stackLayers, timeline, type Tool } from "./content";

export type Vec = [number, number, number];
export type HubId = "projects" | "stack" | "experience" | "education" | "certifications";
export type MapNode = { id: string; label: string; hub: HubId | null; pos: Vec };

const short = (s: string) => s.replace(/ \(.*?\)/, "").split(",")[0].split(":")[0];

export const HUBS: { id: HubId; label: string; pos: Vec; items: string[] }[] = [
  { id: "projects", label: "Projects", pos: [3.8, 1.0, 0.8], items: projects.map((p) => p.title) },
  { id: "stack", label: "Stack", pos: [0.6, 3.4, -1.8], items: stackLayers.map((l) => l.name) },
  { id: "experience", label: "Experience", pos: [-3.6, 1.4, -0.6], items: timeline.map((t) => short(t.org)) },
  { id: "education", label: "Education", pos: [-2.6, -2.4, 1.0], items: education.map((e) => short(e.school)) },
  { id: "certifications", label: "Certifications", pos: [1.4, -3.2, -0.8], items: certifications.map((c) => short(c.name)) },
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const mentions = (text: string, tools: Tool[]) =>
  tools.some((t) => new RegExp(`(?<![A-Za-z0-9])(${[t.name, ...(t.match ?? [])].map(escape).join("|")})(?![A-Za-z0-9])`, "i").test(text));

export const nodes: MapNode[] = [{ id: "root", label: "About me", hub: null, pos: [0, 0, 0] }];
export const edges: [string, string][] = [];

for (const h of HUBS) {
  nodes.push({ id: h.id, label: h.label, hub: h.id, pos: h.pos });
  edges.push(["root", h.id]);
  const out = Math.hypot(...h.pos);
  h.items.forEach((label, i) => {
    // Spread a hub's items on a small sphere around it (golden angle), pushed slightly outward.
    const y = 1 - ((i + 0.5) / h.items.length) * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996;
    const pos = h.pos.map((c, k) => c + [Math.cos(a) * r, y, Math.sin(a) * r][k] * 1.45 + (c / out) * 0.5) as Vec;
    nodes.push({ id: `${h.id}:${i}`, label, hub: h.id, pos });
    edges.push([h.id, `${h.id}:${i}`]);
  });
}

// Real relationships: projects and jobs link to every stack layer whose tools they mention.
projects.forEach((p, i) => {
  const text = [p.description, p.tags.join(" "), p.study.solution, ...p.flow].join(" ");
  stackLayers.forEach((l, j) => mentions(text, l.tools) && edges.push([`projects:${i}`, `stack:${j}`]));
});
timeline.forEach((t, i) => {
  stackLayers.forEach((l, j) => mentions(t.bullets.join(" "), l.tools) && edges.push([`experience:${i}`, `stack:${j}`]));
});

export const node = (id: string) => nodes.find((n) => n.id === id)!;
export const index = (id: string) => Number(id.split(":")[1]);
export const hubOf = (id: string | null): HubId | null => (id ? node(id).hub : null);
export const isHub = (id: string) => HUBS.some((h) => h.id === id);
/** Items linked across hubs (a project's stack layers, a layer's projects and jobs). */
export const links = (id: string) =>
  edges.flatMap(([a, b]) => (a === id && b.includes(":") && a.includes(":") ? [b] : b === id && a.includes(":") && b.includes(":") ? [a] : []));
