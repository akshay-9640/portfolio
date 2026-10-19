import { useEffect, useRef, useState } from "react";
import { profile } from "../content";
import { edges, hubOf, isHub, links, nodes } from "../map";

// The clickable 3D map in the hero. Every node and label selects that item; the camera glides to
// the selected part (critically damped, about 0.4 s). Drag rotates 1:1 and keeps the release
// velocity, decaying at 0.998 per ms. three.js loads as its own chunk; without WebGL the plain
// photo card shows instead and the hub buttons beside it still work.

const INK = [0xe6 / 255, 0xed / 255, 0xf3 / 255];
const BG = [0x0b / 255, 0x0f / 255, 0x17 / 255];
const mix = (t: number) => INK.map((c, i) => BG[i] + (c - BG[i]) * t) as [number, number, number];

type Props = { selected: string | null; onSelect: (id: string | null) => void };

/** Which labels are shown for a selection: hubs and the photo always, plus the active cluster and its links. */
function visibleLabels(selected: string | null) {
  const hub = hubOf(selected);
  const linked = selected && !isHub(selected) && selected !== "root" ? links(selected) : [];
  return new Set(nodes.filter((n) => n.id === "root" || isHub(n.id) || (hub && n.hub === hub) || linked.includes(n.id)).map((n) => n.id));
}

export default function MapExplorer({ selected, onSelect }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const state = useRef({ selected, hover: null as string | null, onSelect });
  state.current.selected = selected;
  state.current.onSelect = onSelect;
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const shown = visibleLabels(selected);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let stop = () => {};
    let cancelled = false;

    import("three").then(async (THREE) => {
      if (cancelled) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setFailed(true);
        return;
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.setAttribute("aria-hidden", "true");
      el.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
      const group = new THREE.Group();
      scene.add(group);
      const at = Object.fromEntries(nodes.map((n) => [n.id, new THREE.Vector3(...n.pos)]));

      // The photo, cropped to a circle with a thin ring, always facing the camera.
      const img = new Image();
      img.src = profile.photo;
      await img.decode().catch(() => {});
      if (cancelled) return;
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
      const PHOTO = 2.8;
      const photo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
      photo.scale.setScalar(PHOTO);
      group.add(photo);

      const hubGeo = new THREE.SphereGeometry(0.13, 20, 14);
      const leafGeo = new THREE.SphereGeometry(0.075, 14, 10);
      const dots = nodes.filter((n) => n.id !== "root");
      const meshes = dots.map((n) => {
        const m = new THREE.Mesh(isHub(n.id) ? hubGeo : leafGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(...mix(0.9)) }));
        m.position.copy(at[n.id]);
        group.add(m);
        return m;
      });

      const lineGeo = new THREE.BufferGeometry();
      // Lines from the photo start at its rim, not its center.
      const ends = edges.map(([a, b]) => [a === "root" ? at[b].clone().setLength(PHOTO / 2) : at[a], at[b]]);
      lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(ends.flatMap(([a, b]) => [...a.toArray(), ...b.toArray()]), 3));
      const colors = new THREE.Float32BufferAttribute(new Float32Array(edges.length * 6), 3);
      lineGeo.setAttribute("color", colors);
      const lineMat = new THREE.LineBasicMaterial({ vertexColors: true });
      group.add(new THREE.LineSegments(lineGeo, lineMat));
      const edgeLevel = edges.map(() => 0.3), dotLevel = dots.map(() => 0.9);

      // Screen positions of every node, refreshed each frame, for labels and for clicks on dots.
      const screen = nodes.map(() => ({ x: 0, y: 0, z: 0 }));
      let w = 1, h = 1, photoPx = 0;

      let yaw = 0, pitch = 0, vYaw = 0, vPitch = 0, dragging = false, touched = false, moved = 0;
      let last = { x: 0, y: 0, t: 0 }, first = last;
      const down = (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;   // labels handle their own clicks
        dragging = true;
        moved = 0;
        el.setPointerCapture(e.pointerId);
        last = first = { x: e.clientX, y: e.clientY, t: performance.now() };
        vYaw = vPitch = 0;
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const now = { x: e.clientX, y: e.clientY, t: performance.now() };
        moved += Math.abs(now.x - last.x) + Math.abs(now.y - last.y);
        if (moved > 6) touched = true;
        yaw += (now.x - last.x) * 0.005;
        pitch = Math.max(-0.6, Math.min(0.6, pitch + (now.y - last.y) * 0.005));
        if (now.t - first.t > 80) first = last;   // a short window for the release velocity
        last = now;
      };
      const up = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        if (moved <= 6) {   // a click, not a drag: pick the nearest dot, or the photo
          const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
          let best: string | null = null, bestD = 22;
          nodes.forEach((n, i) => {
            const d = Math.hypot(screen[i].x - x, screen[i].y - y);
            const reach = n.id === "root" ? photoPx : bestD;
            if (screen[i].z < 1 && d < reach) { best = n.id; bestD = n.id === "root" ? bestD : d; }
          });
          if (best) state.current.onSelect(best);
          return;
        }
        const dt = last.t - first.t;
        if (dt > 0 && performance.now() - last.t < 80) {
          vYaw = ((last.x - first.x) * 0.005) / dt;
          vPitch = ((last.y - first.y) * 0.005) / dt;
        }
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", () => (dragging = false));

      const resize = () => {
        w = el.clientWidth;
        h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(el);

      const camTarget = new THREE.Vector3(), look = new THREE.Vector3(), lookTarget = new THREE.Vector3(), v = new THREE.Vector3();
      const tan = Math.tan((camera.fov * Math.PI) / 360);
      let raf = 0, prev = performance.now(), firstFrame = true;

      function frame(now: number) {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) { prev = now; return; }
        const dt = Math.min(now - prev, 50);
        prev = now;
        const k = reduce || firstFrame ? 1 : 1 - Math.exp(-dt / 420);
        const { selected: sel, hover } = state.current;
        const hub = hubOf(sel), leaf = sel && sel !== "root" && !isHub(sel) ? sel : null;
        const linked = leaf ? links(leaf) : [];

        if (!dragging) {
          yaw += vYaw * dt;
          pitch = Math.max(-0.6, Math.min(0.6, pitch + vPitch * dt));
          const decay = Math.pow(0.998, dt);
          vYaw *= decay;
          vPitch *= decay;
          if (!touched && !sel && !reduce) yaw += 0.00005 * dt;   // a slow drift until someone interacts
        }
        group.rotation.set(0.12 + pitch, yaw, 0);
        group.updateMatrixWorld();

        // Camera: the whole map, or close to the selected cluster, seen from outside it.
        const fit = Math.min(1, camera.aspect);
        if (hub) {
          lookTarget.copy(at[hub]).applyMatrix4(group.matrixWorld);
          if (leaf) lookTarget.lerp(v.copy(at[leaf]).applyMatrix4(group.matrixWorld), 0.5);
          const dir = v.copy(lookTarget).normalize().add(new THREE.Vector3(0, 0, 1.4)).normalize();
          camTarget.copy(lookTarget).addScaledVector(dir, 12 / Math.pow(fit, 0.8));
        } else {
          lookTarget.set(0, 0, 0);
          camTarget.set(0, 0.2, 6.4 / tan / fit);
        }
        photo.material.opacity += ((hub ? 0.3 : 1) - photo.material.opacity) * k;   // the photo steps back while a cluster is open
        camera.position.lerp(camTarget, k);
        look.lerp(lookTarget, k);
        camera.lookAt(look);
        firstFrame = false;

        // Brightness follows the selection; hovering a label traces its lines.
        const node = (id: string) => id.split(":")[0];   // the hub an id belongs to
        const level = (id: string) => {
          if (!sel || sel === "root") return 0.9;
          if (leaf) return id === leaf || linked.includes(id) ? 1 : id === hub || node(id) === hub ? 0.6 : 0.22;
          return id === hub || id.startsWith(`${hub}:`) ? 0.95 : 0.25;
        };
        dots.forEach((n, i) => {
          dotLevel[i] += (level(n.id) - dotLevel[i]) * k;
          (meshes[i].material as InstanceType<typeof THREE.MeshBasicMaterial>).color.setRGB(...mix(dotLevel[i]));
        });
        edges.forEach(([a, b], i) => {
          const cross = a.includes(":") && b.includes(":");
          let target = cross ? 0.14 : 0.36;
          if (leaf) target = a === leaf || b === leaf ? 0.9 : node(a) === hub && node(b) === hub && !cross ? 0.4 : 0.08;
          else if (hub) target = node(a) === hub || node(b) === hub ? (cross ? 0.35 : 0.85) : 0.08;
          if (hover && (a === hover || b === hover)) target = 1;
          edgeLevel[i] += (target - edgeLevel[i]) * k;
          const col = mix(edgeLevel[i]);
          colors.setXYZ(i * 2, ...col);
          colors.setXYZ(i * 2 + 1, ...col);
        });
        colors.needsUpdate = true;
        renderer.render(scene, camera);

        const dist = camera.position.distanceTo(v.set(0, 0, 0).applyMatrix4(group.matrixWorld));
        photoPx = ((PHOTO / 2) * h) / (2 * dist * tan);
        nodes.forEach((n, i) => {
          v.copy(at[n.id]).applyMatrix4(group.matrixWorld).project(camera);
          const s = screen[i];
          s.x = ((v.x + 1) / 2) * w;
          s.y = ((1 - v.y) / 2) * h;
          s.z = v.z;
          const label = labelRefs.current[i];
          if (!label) return;
          const dy = n.id === "root" ? photoPx + 8 : isHub(n.id) ? -34 : 10;
          label.style.transform = `translate(${s.x}px, ${s.y + dy}px) translate(-50%, 0)`;
          label.style.opacity = v.z < 1 ? String(n.id === "root" || isHub(n.id) || level(n.id) > 0.5 ? 1 : 0.6) : "0";
        });
      }
      raf = requestAnimationFrame(frame);
      setReady(true);

      stop = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        [hubGeo, leafGeo, lineGeo].forEach((x) => x.dispose());
        meshes.forEach((m) => (m.material as InstanceType<typeof THREE.MeshBasicMaterial>).dispose());
        lineMat.dispose();
        tex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => setFailed(true));

    return () => { cancelled = true; stop(); };
  }, []);

  if (failed)
    return (
      <div className="relative mx-auto w-full max-w-xs md:max-w-sm">
        <img src={profile.photo} alt={`Portrait of ${profile.name}`} className="aspect-[3/4] w-full rounded-[28px] object-cover object-top ring-1 ring-ink/10" />
      </div>
    );

  return (
    <div
      ref={box}
      className={`relative h-[460px] cursor-grab touch-pan-y select-none overflow-hidden transition-opacity duration-700 active:cursor-grabbing sm:h-[560px] md:h-[640px] [&>canvas]:h-full [&>canvas]:w-full ${ready ? "opacity-100" : "opacity-0"}`}
    >
      {nodes.map((n, i) => {
        const on = shown.has(n.id);
        const hub = isHub(n.id);
        return (
          <button
            key={n.id}
            ref={(b) => { labelRefs.current[i] = b; }}
            type="button"
            tabIndex={on ? 0 : -1}
            aria-hidden={!on}
            aria-pressed={selected === n.id}
            onClick={() => onSelect(n.id)}
            onPointerEnter={() => (state.current.hover = n.id)}
            onPointerLeave={() => (state.current.hover = null)}
            onFocus={() => (state.current.hover = n.id)}
            onBlur={() => (state.current.hover = null)}
            className={`absolute left-0 top-0 whitespace-nowrap rounded-full transition-[background-color,color] duration-100 active:scale-[0.97] ${on ? "" : "pointer-events-none invisible"} ${
              hub
                ? `px-2.5 py-1 font-display text-sm font-bold ${selected === n.id ? "bg-ink text-paper" : "text-ink hover:bg-ink/10"}`
                : `px-2.5 py-0.5 text-xs font-medium ${selected === n.id ? "bg-ink text-paper" : "bg-paper/75 text-ink backdrop-blur-sm hover:bg-card"}`
            }`}
          >
            {n.id === "root" ? profile.location : n.label}
          </button>
        );
      })}
    </div>
  );
}
