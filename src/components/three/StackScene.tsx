"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export type StackSceneLayer = {
  title: string;
  repos: string;
  accent: string;
};

type Tokens = {
  bg: string;
  surface: string;
  surface2: string;
  text: string;
  border: string;
  accents: string[];
};

function readTokens(): Tokens {
  const style = getComputedStyle(document.documentElement);
  const value = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
  return {
    bg: value("--bg", "#050505"),
    surface: value("--surface", "#0b0b0e"),
    surface2: value("--surface-2", "#141418"),
    text: value("--text", "#f4f2f8"),
    border: value("--border", "#1f1f25"),
    accents: [1, 2, 3, 4, 5, 6].map((index) => value(`--c${index}`, "#eab308")),
  };
}

export function StackScene({
  layers,
  label,
  hint,
}: {
  layers: StackSceneLayer[];
  label: string;
  hint: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setFailed(true);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 100);
    camera.position.set(8.2, 7.4, 9.6);
    camera.lookAt(0, 0, 0);

    const world = new THREE.Group();
    scene.add(world);

    let tokens = readTokens();
    const accentAt = (index: number) =>
      tokens.accents[index % tokens.accents.length] ?? tokens.accents[0] ?? "#eab308";

    const ambient = new THREE.AmbientLight(0xffffff, 0.62);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 1.55);
    key.position.set(6, 10, 7);
    scene.add(key);

    const rim = new THREE.DirectionalLight(new THREE.Color(accentAt(5)), 0.45);
    rim.position.set(-7, 4, -6);
    scene.add(rim);

    const fill = new THREE.PointLight(new THREE.Color(accentAt(0)), 14, 26, 2);
    fill.position.set(-3, 1, 4);
    scene.add(fill);

    const slabGeometry = new RoundedBoxGeometry(4.9, 0.44, 3.3, 4, 0.12);
    const tagGeometry = new THREE.BoxGeometry(0.42, 0.12, 0.42);
    const slabs: THREE.Mesh[] = [];
    const edges: THREE.LineSegments[] = [];
    const materials: THREE.MeshStandardMaterial[] = [];
    const edgeMaterials: THREE.LineBasicMaterial[] = [];
    const tagMaterials: THREE.MeshStandardMaterial[] = [];
    const layerMeshes: THREE.Object3D[] = [];
    const gaps = [2.35, 1.18, 0.01, -1.16, -2.33];

    layers.forEach((_layer, index) => {
      const accent = new THREE.Color(accentAt(index));
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(tokens.surface2),
        metalness: 0.18,
        roughness: 0.52,
        transparent: true,
        opacity: 0.94,
        emissive: accent.clone(),
        emissiveIntensity: 0.04,
      });
      const mesh = new THREE.Mesh(slabGeometry, material);
      mesh.position.set(index % 2 === 0 ? -0.12 : 0.12, gaps[index] ?? 0, index % 2 === 0 ? 0.1 : -0.1);
      mesh.userData.index = index;
      mesh.userData.baseY = mesh.position.y;
      world.add(mesh);
      slabs.push(mesh);
      materials.push(material);
      layerMeshes.push(mesh);

      const edgeGeometry = new THREE.EdgesGeometry(slabGeometry, 30);
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.6,
      });
      const line = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      line.position.copy(mesh.position);
      line.userData.index = index;
      line.userData.baseY = line.position.y;
      world.add(line);
      edges.push(line);
      edgeMaterials.push(edgeMaterial);

      const tagMaterial = new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 0.55,
        metalness: 0.2,
        roughness: 0.4,
      });
      tagMaterials.push(tagMaterial);
      const tag = new THREE.Mesh(tagGeometry, tagMaterial);
      tag.position.set(2.05, mesh.position.y + 0.32, 1.06);
      world.add(tag);
    });

    const coreMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(tokens.text),
      transparent: true,
      opacity: 0.16,
    });
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 6.4, 8), coreMaterial);
    core.position.y = 0;
    world.add(core);

    const grid = new THREE.GridHelper(18, 18, new THREE.Color(tokens.border), new THREE.Color(tokens.border));
    const gridMaterial = grid.material as THREE.LineBasicMaterial;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.32;
    grid.position.y = -3.1;
    scene.add(grid);

    const orbit = new THREE.Group();
    world.add(orbit);
    const satelliteGeometry = new THREE.IcosahedronGeometry(0.17, 0);
    const satelliteMaterials: THREE.MeshStandardMaterial[] = [];
    const satellites: THREE.Mesh[] = [];
    for (let index = 0; index < 9; index += 1) {
      const accent = new THREE.Color(accentAt(index));
      const material = new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 0.7,
        metalness: 0.35,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(satelliteGeometry, material);
      const angle = (index / 9) * Math.PI * 2;
      const radius = 3.05 + (index % 3) * 0.14;
      mesh.position.set(Math.cos(angle) * radius, 1.4 + Math.sin(index * 1.7) * 0.24, Math.sin(angle) * radius);
      orbit.add(mesh);
      satellites.push(mesh);
      satelliteMaterials.push(material);
    }

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.25, 0.012, 8, 120),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(accentAt(5)),
        transparent: true,
        opacity: 0.38,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.4;
    orbit.add(ring);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      const aspect = width / height;
      const frustum = 6.6;
      camera.left = -frustum * aspect;
      camera.right = frustum * aspect;
      camera.top = frustum;
      camera.bottom = -frustum;
      camera.updateProjectionMatrix();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    const pointer = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    let hovered: number | null = null;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const pick = () => {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(layerMeshes, false);
      const next = hits.length > 0 ? (hits[0]!.object.userData.index as number) : null;
      if (next !== hovered) {
        hovered = next;
        setActive(next);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      pointer.set(x, y);
      targetTiltY = x * 0.16;
      targetTiltX = -y * 0.1;
      pick();
      if (reduceMotion) renderer.render(scene, camera);
    };

    const onPointerLeave = () => {
      pointer.set(0, 0);
      targetTiltX = 0;
      targetTiltY = 0;
      if (hovered !== null) {
        hovered = null;
        setActive(null);
      }
      if (reduceMotion) renderer.render(scene, camera);
    };

    if (!reduceMotion) {
      host.addEventListener("pointermove", onPointerMove);
      host.addEventListener("pointerleave", onPointerLeave);
    }

    const timer = new THREE.Timer();
    const clock = new THREE.Clock();
    let running = true;
    let visible = true;

    const prefersReduced = reduceMotion;

    const animate = (time: number) => {
      if (!running) return;
      timer.update(time);
      const delta = Math.min(timer.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      tiltX += (targetTiltX - tiltX) * Math.min(1, delta * 6);
      tiltY += (targetTiltY - tiltY) * Math.min(1, delta * 6);
      world.rotation.x = tiltX;
      world.rotation.y = -0.42 + tiltY;
      orbit.rotation.y = elapsed * 0.22;
      ring.rotation.z = elapsed * 0.1;

      slabs.forEach((mesh, index) => {
        const isHovered = hovered === index;
        const baseY = mesh.userData.baseY as number;
        mesh.position.y = baseY + (isHovered ? 0.18 : 0) + Math.sin(elapsed * 0.9 + index) * 0.035;
        const targetScale = isHovered ? 1.045 : 1;
        mesh.scale.x += (targetScale - mesh.scale.x) * Math.min(1, delta * 8);
        mesh.scale.z += (targetScale - mesh.scale.z) * Math.min(1, delta * 8);
        const material = mesh.material as THREE.MeshStandardMaterial;
        const emissiveTarget = isHovered ? 0.22 : 0.04;
        material.emissiveIntensity += (emissiveTarget - material.emissiveIntensity) * Math.min(1, delta * 8);
        const line = edges[index];
        if (!line) return;
        line.position.y = mesh.position.y;
        line.scale.x = mesh.scale.x;
        line.scale.z = mesh.scale.z;
        (line.material as THREE.LineBasicMaterial).opacity = isHovered ? 0.95 : 0.6;
      });

      satellites.forEach((mesh, index) => {
        mesh.rotation.x = elapsed * (0.5 + index * 0.03);
        mesh.rotation.y = elapsed * (0.4 + index * 0.02);
      });

      renderer.render(scene, camera);
    };

    if (!reduceMotion) {
      renderer.setAnimationLoop(animate);
    } else {
      world.rotation.x = 0.04;
      world.rotation.y = -0.42;
      renderer.render(scene, camera);
    }

    const applyTheme = () => {
      const next = readTokens();
      if (
        next.bg === tokens.bg &&
        next.surface === tokens.surface &&
        next.surface2 === tokens.surface2 &&
        next.text === tokens.text &&
        next.border === tokens.border &&
        next.accents.join() === tokens.accents.join()
      ) {
        return;
      }
      tokens = next;
      materials.forEach((material, index) => {
        material.color.set(tokens.surface2);
        material.emissive.set(accentAt(index));
      });
      edgeMaterials.forEach((material, index) => {
        material.color.set(accentAt(index));
      });
      satelliteMaterials.forEach((material, index) => {
        material.color.set(accentAt(index));
        material.emissive.set(accentAt(index));
      });
      coreMaterial.color.set(tokens.text);
      (grid.material as THREE.LineBasicMaterial).color.set(tokens.border);
      ring.material.color.set(accentAt(5));
      rim.color.set(accentAt(5));
      fill.color.set(accentAt(0));
      if (reduceMotion) renderer.render(scene, camera);
    };

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const visibility = () => {
      if (document.hidden) {
        running = false;
        renderer.setAnimationLoop(null);
      } else if (visible && !prefersReduced) {
        running = true;
        clock.start();
        renderer.setAnimationLoop(animate);
      }
    };
    document.addEventListener("visibilitychange", visibility);

    const intersection = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (!prefersReduced) {
          if (visible && !document.hidden) {
            running = true;
            renderer.setAnimationLoop(animate);
          } else {
            running = false;
            renderer.setAnimationLoop(null);
          }
        }
      },
      { threshold: 0.05 },
    );
    intersection.observe(host);

    return () => {
      running = false;
      renderer.setAnimationLoop(null);
      document.removeEventListener("visibilitychange", visibility);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      intersection.disconnect();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      clock.stop();
      slabGeometry.dispose();
      tagGeometry.dispose();
      satelliteGeometry.dispose();
      core.geometry.dispose();
      coreMaterial.dispose();
      grid.geometry.dispose();
      gridMaterial.dispose();
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
      materials.forEach((material) => material.dispose());
      edgeMaterials.forEach((material) => material.dispose());
      tagMaterials.forEach((material) => material.dispose());
      satelliteMaterials.forEach((material) => material.dispose());
      edges.forEach((line) => line.geometry.dispose());
      slabs.forEach((mesh) => mesh.clear());
      scene.clear();
      renderer.dispose();
    };
  }, [layers]);

  return (
    <figure className="relative overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="blueprint absolute inset-0" aria-hidden="true" />
      <div
        ref={hostRef}
        className="relative aspect-[4/3] w-full touch-pan-y"
        role="img"
        aria-label={label}
      >
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
        {failed ? (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <p className="max-w-xs font-mono text-xs uppercase tracking-[0.18em] text-muted">
              {label}
            </p>
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-4">
          <span className="label">{label}</span>
          <span className="index">{hint}</span>
        </div>

        <ul className="pointer-events-none absolute inset-x-0 bottom-0 hidden gap-1 p-4 sm:grid sm:grid-cols-5">
          {layers.map((layer, index) => (
            <li
              key={layer.title}
              className={`rounded-lg border px-2 py-1.5 backdrop-blur-sm transition-colors ${
                active === index ? "border-accent/60 bg-bg/70" : "border-border/60 bg-bg/35"
              }`}
            >
              <span className="flex items-start gap-1.5">
                <span
                  aria-hidden="true"
                  className="mt-1 size-1.5 shrink-0 rounded-full transition-transform"
                  style={{
                    backgroundColor: `var(--${layer.accent})`,
                    transform: active === index ? "scale(1.6)" : "scale(1)",
                  }}
                />
                <span className="line-clamp-2 font-mono text-[9px] uppercase leading-[1.25] tracking-[0.08em] text-text">
                  {layer.title}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="relative flex items-center justify-between gap-4 border-t border-border px-4 py-3">
        <span className="label">{hint}</span>
        <span className="index">three.js · webgl2</span>
      </figcaption>
    </figure>
  );
}
