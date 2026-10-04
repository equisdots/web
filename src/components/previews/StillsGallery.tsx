"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";

export type StillItem = {
  id: string;
  title: string;
  note: string;
  kind: string;
  width: number;
  height: number;
  variantWidths: number[];
};

export type StillSection =
  | { id: string; layout: "feature"; title: string; note: string; items: StillItem[] }
  | { id: string; layout: "masonry"; title: string; note: string; strip: StillItem; items: StillItem[] };

type Labels = { open: string; close: string; dialog: string };

function srcSet(item: StillItem): string {
  const variants = item.variantWidths.map(
    (width) => `${withBasePath(`/previews/shots/${item.id}-${width}.webp`)} ${width}w`
  );
  const full = `${withBasePath(`/previews/shots/${item.id}.webp`)} ${item.width}w`;
  return [...variants, full].join(", ");
}

function StillCard({
  item,
  sizes,
  eager,
  labels,
  onOpen,
}: {
  item: StillItem;
  sizes: string;
  eager?: boolean;
  labels: Labels;
  onOpen: (item: StillItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      aria-label={`${labels.open}: ${item.title}`}
      className="group/still block w-full overflow-hidden rounded-xl border border-border bg-surface text-left transition-colors hover:border-accent/50"
    >
      <span className="relative block overflow-hidden bg-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath(`/previews/shots/${item.id}.webp`)}
          srcSet={srcSet(item)}
          sizes={sizes}
          width={item.width}
          height={item.height}
          alt={item.title}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="block h-auto w-full transition-transform duration-500 ease-out group-hover/still:scale-[1.015]"
        />
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-bg/80 text-muted opacity-0 backdrop-blur transition-opacity group-hover/still:opacity-100"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </svg>
        </span>
      </span>
      <span className="block border-t border-border px-4 py-3.5">
        <span className="flex items-baseline gap-3">
          <span className="text-sm font-medium">{item.title}</span>
          <span className="ml-auto shrink-0 rounded-full border border-border px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-muted">
            {item.kind}
          </span>
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted">{item.note}</span>
      </span>
    </button>
  );
}

function SectionHeader({ title, note }: { title: string; note: string }) {
  return (
    <div className="border-b border-border pb-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{note}</p>
    </div>
  );
}

export function StillsGallery({ sections, labels }: { sections: StillSection[]; labels: Labels }) {
  const [active, setActive] = useState<StillItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) dialog.showModal();
    if (!active && dialog.open) dialog.close();
  }, [active]);

  return (
    <>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="container-wide mt-16">
          <SectionHeader title={section.title} note={section.note} />

          {section.layout === "feature" ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {section.items.map((item, index) => (
                <div key={item.id} className={index === 0 ? "sm:col-span-2" : undefined}>
                  <StillCard
                    item={item}
                    eager={index === 0}
                    labels={labels}
                    onOpen={setActive}
                    sizes={index === 0 ? "(min-width: 1408px) 1408px, 100vw" : "(min-width: 1408px) 700px, (min-width: 640px) 50vw, 100vw"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="mt-8">
                <StillCard
                  item={section.strip}
                  eager
                  labels={labels}
                  onOpen={setActive}
                  sizes="(min-width: 1408px) 1408px, 100vw"
                />
              </div>
              <div className="mt-5 columns-1 gap-5 sm:columns-2 xl:columns-3">
                {section.items.map((item) => (
                  <div key={item.id} className="mb-5 break-inside-avoid">
                    <StillCard
                      item={item}
                      labels={labels}
                      onOpen={setActive}
                      sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      ))}

      <dialog
        ref={dialogRef}
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setActive(null);
        }}
        aria-label={labels.dialog}
        className="m-auto w-[min(96vw,88rem)] bg-transparent p-0 outline-none backdrop:bg-black/75"
      >
        {active ? (
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(`/previews/shots/${active.id}.webp`)}
              width={active.width}
              height={active.height}
              alt={active.title}
              className="mx-auto block max-h-[76vh] w-auto max-w-full bg-bg object-contain"
            />
            <div className="flex items-start gap-4 border-t border-border px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{active.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted">{active.note}</p>
              </div>
              <span className="ml-auto shrink-0 rounded-full border border-border px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.12em] text-muted">
                {active.kind}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label={labels.close}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg/85 text-text backdrop-blur transition-colors hover:border-accent/50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
