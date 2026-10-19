import type { ReactNode } from "react";
import { certifications, contact, education, profile, projects, stackLayers, timeline } from "../content";
import { HUBS, hubOf, index, isHub, links, node } from "../map";

type Select = (id: string | null) => void;

function Chip({ id, onSelect }: { id: string; onSelect: Select }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="rounded-full border border-ink/20 px-3 py-1 text-xs text-ink/80 transition duration-100 hover:border-ink/50 hover:text-ink active:scale-[0.97]"
    >
      {node(id).label}
    </button>
  );
}

function Related({ title, ids, onSelect }: { title: string; ids: string[]; onSelect: Select }) {
  if (!ids.length) return null;
  return (
    <div className="mt-6">
      <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-ink/50">{title}</h3>
      <div className="mt-2 flex flex-wrap gap-2">{ids.map((id) => <Chip key={id} id={id} onSelect={onSelect} />)}</div>
    </div>
  );
}

const ext = "text-ink/80 underline underline-offset-4 hover:text-ink";

// A hub lists its items as rows; each row opens that item.
function ItemList({ hub, onSelect, render }: { hub: string; onSelect: Select; render: (i: number) => ReactNode }) {
  const items = HUBS.find((h) => h.id === hub)!.items;
  return (
    <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
      {items.map((_, i) => (
        <li key={i}>
          <button type="button" onClick={() => onSelect(`${hub}:${i}`)} className="flex w-full items-start justify-between gap-4 py-3 text-left transition-colors hover:text-ink active:opacity-70">
            <span>{render(i)}</span>
            <span aria-hidden className="mt-0.5 text-ink/40">→</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Body({ id, onSelect }: { id: string; onSelect: Select }) {
  if (id === "root")
    return (
      <>
        <h2 className="font-display text-3xl font-bold tracking-[-0.02em]">{profile.name}</h2>
        <p className="mt-1 text-sm text-ink/60">{profile.headline} · {profile.location}</p>
        <p className="mt-4 text-ink/75">{profile.bio}</p>
        <div className="mt-5 flex flex-wrap gap-5 text-sm font-medium">
          <a href={`mailto:${contact.email}`} className={ext}>Email</a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" className={ext}>LinkedIn ↗</a>
          <a href={contact.github} target="_blank" rel="noreferrer" className={ext}>GitHub ↗</a>
        </div>
        <Related title="Explore" ids={HUBS.map((h) => h.id)} onSelect={onSelect} />
      </>
    );

  if (isHub(id)) {
    const title = <h2 className="font-display text-3xl font-bold tracking-[-0.02em]">{node(id).label}</h2>;
    const sub = (a: string, b: string) => (<><span className="block font-medium text-ink">{a}</span><span className="block text-sm text-ink/60">{b}</span></>);
    const rows: Record<string, (i: number) => ReactNode> = {
      projects: (i) => sub(projects[i].title, projects[i].description),
      stack: (i) => sub(stackLayers[i].name, stackLayers[i].role),
      experience: (i) => sub(timeline[i].title, `${timeline[i].org} · ${timeline[i].when}`),
      education: (i) => sub(education[i].degree, `${education[i].school} · ${education[i].when}`),
      certifications: (i) => sub(certifications[i].name, certifications[i].issuer),
    };
    return <>{title}<ItemList hub={id} onSelect={onSelect} render={rows[id]} /></>;
  }

  const i = index(id), linked = links(id);
  switch (hubOf(id)) {
    case "projects": {
      const p = projects[i];
      return (
        <>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">{p.status}</p>
          <h2 className="mt-1 font-display text-3xl font-bold tracking-[-0.02em]">{p.title}</h2>
          <p className="mt-3 text-ink/75">{p.description}</p>
          <div className="mt-4 flex flex-wrap gap-5 text-sm font-medium">
            {p.live && <a href={p.live} target="_blank" rel="noreferrer" className={ext}>Live demo ↗</a>}
            {p.github && <a href={p.github} target="_blank" rel="noreferrer" className={ext}>GitHub ↗</a>}
          </div>
          {p.image && (
            <a href={p.live} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden className="mt-5 block overflow-hidden rounded-xl ring-1 ring-ink/10">
              <img src={p.image} alt="" className="aspect-[16/9] w-full object-cover object-top" />
            </a>
          )}
          <dl className="mt-5 space-y-3 text-sm">
            {(["problem", "solution", "result"] as const).map((k) => (
              <div key={k}>
                <dt className="text-xs font-medium uppercase tracking-[0.1em] text-ink/50">{k}</dt>
                <dd className="mt-1 text-ink/75">{p.study[k]}</dd>
              </div>
            ))}
          </dl>
          <Related title="Built with" ids={linked} onSelect={onSelect} />
        </>
      );
    }
    case "stack": {
      const l = stackLayers[i];
      return (
        <>
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em]">{l.name}</h2>
          <p className="mt-2 text-ink/75">{l.role}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tools">
            {l.tools.map((t) => <li key={t.name} className="rounded-full bg-ink/[0.06] px-3 py-1 text-xs text-ink/80">{t.name}</li>)}
          </ul>
          <Related title="Used in" ids={linked} onSelect={onSelect} />
        </>
      );
    }
    case "experience": {
      const t = timeline[i];
      return (
        <>
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em]">{t.title}</h2>
          <p className="mt-1 text-sm text-ink/60">{t.org} · {t.when}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink/75">{t.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          <Related title="Stack used" ids={linked} onSelect={onSelect} />
        </>
      );
    }
    case "education": {
      const e = education[i];
      return (
        <>
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em]">{e.degree}</h2>
          <p className="mt-2 text-ink/75">{e.school}</p>
          <p className="mt-1 text-sm text-ink/55">{e.when}</p>
        </>
      );
    }
    default: {
      const c = certifications[i];
      return (
        <>
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em]">{c.name}</h2>
          <p className="mt-2 text-ink/75">Issued by {c.issuer}</p>
        </>
      );
    }
  }
}

export default function MapDetail({ id, onSelect }: { id: string; onSelect: Select }) {
  const hub = hubOf(id);
  const crumbs = [{ id: null, label: "Intro" }, ...(id === "root" ? [] : [{ id: hub, label: node(hub!).label }]), ...(id !== hub ? [{ id, label: node(id).label }] : [])];
  return (
    <div>
      <nav aria-label="Map location" className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-ink/55">
        {crumbs.map((c, k) => (
          <span key={k} className="flex items-center gap-1.5">
            {k > 0 && <span aria-hidden>/</span>}
            {k < crumbs.length - 1 ? (
              <button type="button" onClick={() => onSelect(c.id)} className="underline-offset-4 hover:text-ink hover:underline">{c.label}</button>
            ) : (
              <span className="text-ink" aria-current="location">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      <Body id={id} onSelect={onSelect} />
    </div>
  );
}
