"use client";

import { useEffect, useRef, useState } from "react";
import { getDict, type Locale } from "@/lib/i18n";

const TARGETS = [24, 69, 155, 58, 18, 2] as const;

export function StatsStrip({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const hostRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<number[]>(() => [...TARGETS]);
  const startedRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValues([...TARGETS]);
      startedRef.current = true;
      return;
    }

    let frame = 0;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        setValues(TARGETS.map(() => 0));
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          if (cancelled) return;
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValues(TARGETS.map((target) => Math.round(target * eased)));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(host);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const labels = [
    dict.home.stats.repos,
    dict.home.stats.plugins,
    dict.home.stats.palettes,
    dict.home.stats.scenes,
    dict.home.stats.modules,
    dict.home.stats.compositors,
  ];

  return (
    <section className="border-t border-border">
      <div ref={hostRef} className="container-wide py-8">
        <div className="flex flex-wrap items-center gap-y-3 divide-x divide-border/70 rounded-xl border border-border bg-surface/40 px-2 py-4 sm:grid sm:grid-cols-3 lg:grid-cols-6">
          {TARGETS.map((target, index) => (
            <div key={labels[index]} className="flex min-w-[8rem] flex-1 flex-col px-4 py-1.5">
              <span className="font-mono text-2xl tabular-nums tracking-tight text-text">
                {(values[index] ?? target).toLocaleString(locale === "es" ? "es-ES" : "en-US")}
                {index === 2 ? "+" : ""}
              </span>
              <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {labels[index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
