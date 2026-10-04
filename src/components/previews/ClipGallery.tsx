"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

export type ClipItem = { id: string; label: string };

export type ClipGroupView = { id: string; title: string; note: string; items: ClipItem[] };

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11-6.86a1 1 0 0 0 0-1.7l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <rect x="7" y="5" width="3.5" height="14" rx="1" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1" />
    </svg>
  );
}

function ClipCard({ item, playLabel, pauseLabel }: { item: ClipItem; playLabel: string; pauseLabel: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) void video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => {});
    else video.pause();
  }, []);

  return (
    <figure className="group/clip">
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
        <video
          ref={videoRef}
          src={withBasePath(`/previews/clips/${item.id}.mp4`)}
          poster={withBasePath(`/previews/clips/${item.id}-poster.webp`)}
          width={960}
          height={540}
          muted
          loop
          playsInline
          preload="none"
          aria-label={item.label}
          onClick={toggle}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="block aspect-video w-full cursor-pointer object-cover"
        />
        <span className="pointer-events-none absolute left-3 top-3 rounded-md border border-border bg-bg/80 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted backdrop-blur">
          {item.label}
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? pauseLabel : playLabel}
          className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg/80 text-text backdrop-blur transition-opacity hover:border-accent/50 sm:opacity-0 sm:group-hover/clip:opacity-100 sm:focus-visible:opacity-100 motion-reduce:opacity-100"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </figure>
  );
}

export function ClipGallery({
  groups,
  playLabel,
  pauseLabel,
}: {
  groups: ClipGroupView[];
  playLabel: string;
  pauseLabel: string;
}) {
  return (
    <div className="space-y-14">
      {groups.map((group) => (
        <div key={group.id}>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="text-sm font-medium">{group.title}</h3>
            <p className="text-xs text-muted">{group.note}</p>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((item) => (
              <ClipCard key={item.id} item={item} playLabel={playLabel} pauseLabel={pauseLabel} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
