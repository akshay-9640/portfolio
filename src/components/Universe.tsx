import { useEffect, useRef } from "react";
import { certifications, education, profile, projects, stackLayers, timeline } from "../content";

// One 3D map of the whole portfolio, fixed behind the page: the photo at the center, a hub per
// part of the site, a node per real item, and lines from projects to the stack layers they use.
// The camera glides to the hub of whichever section is in the middle of the screen. In the hero
// it sits where the photo card is, and dragging there rotates it (1:1, then inertia).
// three.js loads as its own chunk; without WebGL the plain photo card stays.

const INK = [0xe6 / 255, 0xed / 255, 0xf3 / 255];
const BG = [0x0b / 255, 0x0f / 255, 0x17 / 255];
const mix = (t: number) => INK.map((c, i) => BG[i] + (c - BG[i]) * t) as [number, number, number];

const short = (s: string) => s.replace(/ \(.*?\)/, "").split(",")[0].split(":")[0];
const HUBS = [
  { id: "projects", label: "Projects", pos: [3.8, 1.0, 0.8], items: projects.map((p) => p.title) },
  { id: "stack", label: "Stack", pos: [0.6, 3.4, -1.8], items: stackLayers.map((l) => l.name) },
  { id: "experience", label: "Experience", pos: [-3.6, 1.4, -0.6], items: timeline.map((t) => short(t.org)) },
  { id: "education", label: "Education", pos: [-2.6, -2.4, 1.0], items: education.map((e) => short(e.school)) },
  { id: "certifications", label: "Certifications", pos: [1.4, -3.2, -0.8], items: certifications.map((c) => short(c.name)) },
] as const;
// Which hubs each page section brings into focus. Sections not listed show the whole map.
const FOCUS: Record<string, string[]> = {
  projects: ["projects"], stack: ["stack"], certifications: ["certifications"], experience: ["experience", "education"],
};

type Node = { id: string; label: string; hub: string | null; pos: [number, number, number] };

function buildGraph() {
  const nodes: Node[] = [];
  const edges: [string, string][] = [];
  for (const h of HUBS) {
    nodes.push({ id: h.id, label: h.label, hub: h.id, pos: [...h.pos] });
    edges.push(["root", h.id]);
    const out = Math.hypot(...h.pos);
    h.items.forEach((label, i) => {
      // Spread a hub's items on a small sphere around it (golden angle), pushed slightly outward.
      const y = 1 - ((i + 0.5) / h.items.length) * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996;
      const pos = h.pos.map((c, k) => c + [Math.cos(a) * r, y, Math.sin(a) * r][k] * 1.35 + (c / out) * 0.45) as [number, number, number];
      const id = `${h.id}:${i}`;
      nodes.push({ id, label, hub: h.id, pos });
      edges.push([h.id, id]);
    });
  }
  // Real relationships: a project links to every stack layer whose tools its write-up mentions.
  projects.forEach((p, i) => {
    const text = `${p.description} ${p.tags.join(" ")} ${p.study.solution}`.toLowerCase();
    stackLayers.forEach((l, j) => {
      if (l.tools.some((t) => [t.name, ...(t.match ?? [])].some((m) => text.includes(m.toLowerCase())))) edges.push([`projects:${i}`, `stack:${j}`]);
    });
  });
  return { nodes, edges };
}

export default function Universe() {
  const host = useRef<HTMLDivElement>(null);
  const labelBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current, labelEl = labelBox.current;
    if (!el || !labelEl) return;
    let stop = () => {};
    let cancelled = false;

    import("three").then(async (THREE) => {
      if (cancelled) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return;   // no WebGL: the photo card simply stays
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
      const group = new THREE.Group();
      scene.add(group);
      const { nodes, edges } = buildGraph();
      const at = Object.fromEntries(nodes.map((n) => [n.id, new THREE.Vector3(...n.pos)]));
      at.root = new THREE.Vector3();

      // The photo, cropped to a circle with a thin ring, always facing the camera.
      const img = new Image();
      img.src = profile.photo;
      await img.decode().catch(() => {});
      const c = document.createElement("canvas");
      c.width = c.height = 512;
      const g = c.getContext("2d")!;
      g.beginPath();
      g.arc(256, 256, 244, 0, Math.PI * 2);
      g.save();
      g.clip();
      const side = Math.min(img.naturalWidth, img.naturalHeight) || 1;
      if (img.naturalWidth) g.drawImage(img, (img.naturalWidth - side) / 2, 0, side, side, 12, 12, 488, 488);
      g.restore();
      g.lineWidth = 6;
      g.strokeStyle = "rgba(230,237,243,0.55)";
      g.stroke();
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      const photo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      photo.scale.setScalar(2.8);
      group.add(photo);

      const hubGeo = new THREE.SphereGeometry(0.12, 20, 14);
      const leafGeo = new THREE.SphereGeometry(0.065, 14, 10);
      const meshes = nodes.map((n) => {
        const m = new THREE.Mesh(n.id === n.hub ? hubGeo : leafGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(...mix(0.9)) }));
        m.position.copy(at[n.id]);
        group.add(m);
        return m;
      });

      const lineGeo = new THREE.BufferGeometry();
      // Lines from the photo start at its rim, not its center.
      const ends = edges.map(([a, b]) => [a === "root" ? at[b].clone().setLength(1.45) : at[a], at[b]]);
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(ends.flatMap(([a, b]) => [...a.toArray(), ...b.toArray()]), 3));
      const colors = new THREE.Float32BufferAttribute(new Float32Array(edges.length * 6), 3);
      lineGeo.setAttribute("color", colors);
      const lineMat = new THREE.LineBasicMaterial({ vertexColors: true });
      group.add(new THREE.LineSegments(lineGeo, lineMat));
      const edgeLevel = edges.map(() => 0.3), nodeLevel = nodes.map(() => 0.9);

      // Labels are HTML, positioned each frame from the 3D points.
      const spans = nodes.map((n) => {
        const s = document.createElement("span");
        s.textContent = n.label;
        s.className = n.id === n.hub
          ? "absolute left-0 top-0 whitespace-nowrap font-display text-sm font-bold text-ink"
          : "absolute left-0 top-0 whitespace-nowrap rounded-full bg-paper/70 px-2 py-0.5 text-[11px] font-medium text-ink sm:text-xs";
        labelEl.append(s);
        return s;
      });
      const rootLabel = document.createElement("span");
      rootLabel.textContent = profile.location;
      rootLabel.className = "absolute left-0 top-0 whitespace-nowrap rounded-full bg-paper/70 px-3 py-1 text-xs font-medium text-ink backdrop-blur";
      labelEl.append(rootLabel);

      // Which section is in the middle of the screen decides the focus.
      let section = "top";
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) section = e.target.id;
      }, { rootMargin: "-48% 0px -48% 0px" });
      document.querySelectorAll("section[id]").forEach((s) => io.observe(s));

      // Drag to rotate, on the hero's photo spot.
      const anchor = document.querySelector<HTMLElement>("[data-universe-anchor]");
      let yaw = 0, pitch = 0, vYaw = 0, vPitch = 0, dragging = false, touched = false;
      let last = { x: 0, y: 0, t: 0 }, first = last;
      const down = (e: PointerEvent) => {
        dragging = touched = true;
        anchor!.setPointerCapture(e.pointerId);
        last = first = { x: e.clientX, y: e.clientY, t: performance.now() };
        vYaw = vPitch = 0;
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const now = { x: e.clientX, y: e.clientY, t: performance.now() };
        yaw += (now.x - last.x) * 0.005;
        pitch = Math.max(-0.6, Math.min(0.6, pitch + (now.y - last.y) * 0.005));
        if (now.t - first.t > 80) first = last;   // keep a short window for the release velocity
        last = now;
      };
      const up = () => {
        if (!dragging) return;
        dragging = false;
        const dt = last.t - first.t;
        if (dt > 0 && performance.now() - last.t < 80) {
          vYaw = ((last.x - first.x) * 0.005) / dt;
          vPitch = ((last.y - first.y) * 0.005) / dt;
        }
      };
      anchor?.addEventListener("pointerdown", down);
      anchor?.addEventListener("pointermove", move);
      anchor?.addEventListener("pointerup", up);
      anchor?.addEventListener("pointercancel", up);

      let w = 1, h = 1;
      const resize = () => {
        w = window.innerWidth;
        h = window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);
      resize();

      const camTarget = new THREE.Vector3(), look = new THREE.Vector3(), lookTarget = new THREE.Vector3(), v = new THREE.Vector3();
      const screen = { x: w * 0.7, y: h * 0.5 };
      let first_frame = true, raf = 0, prev = performance.now(), opacity = 1;

      function frame(now: number) {
        raf = requestAnimationFrame(frame);
        if (document.hidden) return;
        const dt = Math.min(now - prev, 50);
        prev = now;
        const k = reduce || first_frame ? 1 : 1 - Math.exp(-dt / 420);   // critically damped glide, about 0.4 s
        const focus = FOCUS[section] ?? [];
        const wide = w >= 768;

        if (!dragging) {
          yaw += vYaw * dt;
          pitch = Math.max(-0.6, Math.min(0.6, pitch + vPitch * dt));
          const decay = Math.pow(0.998, dt);
          vYaw *= decay;
          vPitch *= decay;
          if (!touched && !reduce && !focus.length) yaw += 0.00005 * dt;   // a slow drift until someone drags
        }
        group.rotation.set(0.12 + pitch, yaw, 0);
        group.updateMatrixWorld();

        // Camera: the whole map, or close to the focused hubs, seen from outside them.
        if (focus.length) {
          lookTarget.set(0, 0, 0);
          focus.forEach((id) => lookTarget.add(v.copy(at[id]).applyMatrix4(group.matrixWorld)));
          lookTarget.divideScalar(focus.length);
          const dir = v.copy(lookTarget).normalize().add(new THREE.Vector3(0, 0, 1.4)).normalize();
          camTarget.copy(lookTarget).addScaledVector(dir, (focus.length > 1 ? 12 : 9) * (wide ? 1 : 1.6));
        } else {
          lookTarget.set(0, 0, 0);
          camTarget.set(0, 0.3, wide ? 23 : 34);
        }
        camera.position.lerp(camTarget, k);
        look.lerp(lookTarget, k);
        camera.lookAt(look);

        // Where on screen the map is centered: on the photo spot in the hero, else to the right.
        const r = section === "top" && anchor ? anchor.getBoundingClientRect() : null;
        const sx = r ? r.left + r.width / 2 : wide ? w * 0.68 : w / 2, sy = r ? r.top + r.height / 2 : h * (wide ? 0.5 : 0.4);
        screen.x += (sx - screen.x) * k;
        screen.y += (sy - screen.y) * k;
        camera.setViewOffset(w, h, -(screen.x - w / 2), -(screen.y - h / 2), w, h);
        first_frame = false;

        // Brightness: the focused part lit, everything else quiet; the photo steps back while a section is focused.
        photo.material.opacity += ((section === "top" ? 1 : 0) - photo.material.opacity) * k;
        const lit = (id: string) => !focus.length || focus.some((f) => id === f || id.startsWith(`${f}:`));
        nodes.forEach((n, i) => {
          nodeLevel[i] += ((lit(n.id) ? 0.95 : 0.3) - nodeLevel[i]) * k;
          (meshes[i].material as InstanceType<typeof THREE.MeshBasicMaterial>).color.setRGB(...mix(nodeLevel[i]));
        });
        edges.forEach(([a, b], i) => {
          const target = !focus.length ? (a === "root" || b.includes(":") && !a.includes(":") ? 0.38 : 0.16) : lit(a) && lit(b) ? 0.8 : lit(a) || lit(b) ? 0.45 : 0.08;
          edgeLevel[i] += (target - edgeLevel[i]) * k;
          const col = mix(edgeLevel[i]);
          colors.setXYZ(i * 2, ...col);
          colors.setXYZ(i * 2 + 1, ...col);
        });
        colors.needsUpdate = true;

        // The map is full strength in the hero and steps back behind the other sections' content.
        opacity += ((section === "top" ? 1 : wide ? 0.45 : 0.3) - opacity) * k;
        el!.style.opacity = String(opacity);

        renderer.render(scene, camera);
        const place = (s: HTMLElement, p: InstanceType<typeof THREE.Vector3>, dy: number, alpha: number) => {
          v.copy(p).applyMatrix4(group.matrixWorld).project(camera);
          s.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, ${dy}px)`;
          s.style.opacity = v.z < 1 ? String(alpha) : "0";
        };
        // Labels only in the hero; behind other sections they would sit under body text.
        const show = section === "top" ? 1 : 0;
        nodes.forEach((n, i) => place(spans[i], at[n.id], n.id === n.hub ? -30 : 10, n.id === n.hub ? show : 0));
        place(rootLabel, v.set(0, -1.5, 0), 6, show);
      }
      raf = requestAnimationFrame(frame);
      document.documentElement.dataset.universe = "on";

      stop = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", resize);
        anchor?.removeEventListener("pointerdown", down);
        anchor?.removeEventListener("pointermove", move);
        anchor?.removeEventListener("pointerup", up);
        anchor?.removeEventListener("pointercancel", up);
        delete document.documentElement.dataset.universe;
        [hubGeo, leafGeo, lineGeo].forEach((x) => x.dispose());
        meshes.forEach((m) => (m.material as InstanceType<typeof THREE.MeshBasicMaterial>).dispose());
        lineMat.dispose();
        tex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        labelEl.replaceChildren();
      };
    }).catch(() => {});

    return () => { cancelled = true; stop(); };
  }, []);

  return (
    <div ref={host} aria-hidden className="pointer-events-none fixed inset-0 z-0 [&>canvas]:h-full [&>canvas]:w-full">
      <div ref={labelBox} className="absolute inset-0 overflow-hidden" />
    </div>
  );
}
