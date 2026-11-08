"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type PaletteSwatch = {
  name: string;
  hex: string;
};

export function PaletteGem({
  palettes,
  label,
  hint,
}: {
  palettes: PaletteSwatch[];
  label: string;
  hint: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetColor = useRef(new THREE.Color(palettes[0]?.hex ?? "#eab308"));
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    targetColor.current.set(palettes[selected]?.hex ?? palettes[0]?.hex ?? "#eab308");
  }, [selected, palettes]);

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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0.55, 8.2);
    camera.lookAt(0, 0, 0);

    const style = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback;
    let surface = token("--surface-2", "#141418");
    let text = token("--text", "#f4f2f8");
    let border = token("--border", "#1f1f25");

    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.55);
    key.position.set(4, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(new THREE.Color(targetColor.current), 0.75);
    rim.position.set(-5, -2, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(new THREE.Color(targetColor.current), 16, 20, 2);
    fill.position.set(-2, 2, 4);
    scene.add(fill);

    const gemGeometry = new THREE.IcosahedronGeometry(1.42, 1);
    const gemMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(surface),
      emissive: targetColor.current.clone(),
      emissiveIntensity: 0.12,
      metalness: 0.52,
      roughness: 0.3,
      flatShading: true,
    });
    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    scene.add(gem);

    const wireGeometry = new THREE.EdgesGeometry(gemGeometry, 8);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(targetColor.current),
      transparent: true,
      opacity: 0.45,
    });
    const wire = new THREE.LineSegments(wireGeometry, wireMaterial);
    gem.add(wire);

    const haloMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(targetColor.current),
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.008, 8, 140), haloMaterial);
    halo.rotation.x = Math.PI / 2.6;
    scene.add(halo);

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    const dotGeometry = new THREE.SphereGeometry(0.045, 8, 8);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(text),
      transparent: true,
      opacity: 0.5,
    });
    const dots: THREE.Mesh[] = [];
    for (let index = 0; index < 26; index += 1) {
      const dot = new THREE.Mesh(dotGeometry, dotMaterial);
      const angle = (index / 26) * Math.PI * 2;
      const radius = 2.6 + (index % 4) * 0.12;
      dot.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.4) * 0.9, Math.sin(angle) * radius);
      orbitGroup.add(dot);
      dots.push(dot);
    }

    const grid = new THREE.GridHelper(12, 12, new THREE.Color(border), new THREE.Color(border));
    const gridMaterial = grid.material as THREE.LineBasicMaterial;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.2;
    grid.position.y = -2.7;
    scene.add(grid);

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    let tiltX = 0;
    let tiltY = 0;
    let targetX = 0;
    let targetY = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      targetY = (((event.clientX - rect.left) / rect.width) * 2 - 1) * 0.5;
      targetX = -(((event.clientY - rect.top) / rect.height) * 2 - 1) * 0.35;
      if (reduceMotion) renderer.render(scene, camera);
    };
    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
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

    const animate = (time: number) => {
      if (!running) return;
      timer.update(time);
      const delta = Math.min(timer.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      tiltX += (targetX - tiltX) * Math.min(1, delta * 5);
      tiltY += (targetY - tiltY) * Math.min(1, delta * 5);
      gem.rotation.x = elapsed * 0.16 + tiltX;
      gem.rotation.y = elapsed * 0.22 + tiltY;
      halo.rotation.z = elapsed * 0.07;
      orbitGroup.rotation.y = elapsed * 0.12;
      dots.forEach((dot, index) => {
        dot.position.y = Math.sin(elapsed * 0.8 + index) * 0.9;
      });

      const current = gemMaterial.emissive as THREE.Color;
      current.lerp(targetColor.current, Math.min(1, delta * 3.2));
      wireMaterial.color.lerp(targetColor.current, Math.min(1, delta * 3.2));
      haloMaterial.color.copy(targetColor.current);
      rim.color.lerp(targetColor.current, Math.min(1, delta * 3.2));
      fill.color.lerp(targetColor.current, Math.min(1, delta * 3.2));
      const targetEmissive = 0.12 + Math.sin(elapsed * 1.4) * 0.035;
      gemMaterial.emissiveIntensity += (targetEmissive - gemMaterial.emissiveIntensity) * Math.min(1, delta * 4);

      renderer.render(scene, camera);
    };

    if (!reduceMotion) {
      renderer.setAnimationLoop(animate);
    } else {
      gem.rotation.set(0.12, 0.4, 0);
      renderer.render(scene, camera);
    }

    const applyTheme = () => {
      const nextStyle = getComputedStyle(document.documentElement);
      const nextSurface = nextStyle.getPropertyValue("--surface-2").trim() || surface;
      const nextText = nextStyle.getPropertyValue("--text").trim() || text;
      const nextBorder = nextStyle.getPropertyValue("--border").trim() || border;
      surface = nextSurface;
      text = nextText;
      border = nextBorder;
      gemMaterial.color.set(surface);
      dotMaterial.color.set(text);
      (grid.material as THREE.LineBasicMaterial).color.set(border);
      if (reduceMotion) renderer.render(scene, camera);
    };
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const visibility = () => {
      if (document.hidden) {
        running = false;
        renderer.setAnimationLoop(null);
      } else if (visible && !reduceMotion) {
        running = true;
        clock.start();
        renderer.setAnimationLoop(animate);
      }
    };
    document.addEventListener("visibilitychange", visibility);

    const intersection = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (!reduceMotion) {
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
      gemGeometry.dispose();
      gemMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      halo.geometry.dispose();
      haloMaterial.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      grid.geometry.dispose();
      gridMaterial.dispose();
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <figure className="relative overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="blueprint absolute inset-0" aria-hidden="true" />
      <div ref={hostRef} className="relative aspect-square w-full touch-pan-y">
        <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
        {failed ? (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <p className="max-w-[16rem] font-mono text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
          </div>
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-4">
          <span className="label">{label}</span>
          <span className="index">{hint}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {palettes.map((palette, index) => (
              <button
                key={palette.name}
                type="button"
                onClick={() => setSelected(index)}
                aria-label={palette.name}
                aria-pressed={selected === index}
                title={palette.name}
                className={`h-6 w-6 rounded-md border transition-transform ${
                  selected === index ? "scale-110 border-text" : "border-border hover:scale-105"
                }`}
                style={{ backgroundColor: palette.hex }}
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {palettes[selected]?.name}
          </p>
        </div>
      </div>
      <figcaption className="relative flex items-center justify-between gap-4 border-t border-border px-4 py-3">
        <span className="label">{hint}</span>
        <span className="index">three.js · palette</span>
      </figcaption>
    </figure>
  );
}
