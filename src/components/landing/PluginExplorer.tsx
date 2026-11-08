"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { getDict, type Locale } from "@/lib/i18n";
import {
  PLUGIN_COUNTS,
  PLUGIN_GROUPS,
  PLUGINS,
  type PluginGroup,
} from "@/lib/plugins";

export function PluginExplorer({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const [group, setGroup] = useState<PluginGroup | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return PLUGINS.filter((plugin) => {
      if (group !== "all" && plugin.group !== group) return false;
      if (!term) return true;
      return (
        plugin.id.toLowerCase().includes(term) ||
        plugin.note[locale].toLowerCase().includes(term) ||
        plugin.note.en.toLowerCase().includes(term)
      );
    });
  }, [group, locale, query]);

  return (
    <section id="plugins" className="border-t border-border">
      <div className="container-wide py-16">
        <SectionHeader
          index="06"
          label={dict.home.labels.plugins}
          title={dict.home.pluginsTitle}
          subtitle={dict.home.pluginsSubtitle}
        />

        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-surface/40 p-4 sm:flex-row sm:items-center">
          <label className="relative flex min-w-0 flex-1 items-center">
            <span className="sr-only">{dict.plugins.search}</span>
            <span aria-hidden="true" className="absolute left-3 font-mono text-xs text-muted">
              /
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={dict.plugins.search}
              className="h-10 w-full rounded-lg border border-border bg-bg/70 pl-7 pr-3 font-mono text-xs text-text placeholder:text-muted focus:border-accent/60 focus:outline-none"
            />
          </label>
          <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {filtered.length} / {PLUGINS.length} {dict.plugins.countLabel}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label={dict.plugins.filterLabel}>
          <button
            type="button"
            onClick={() => setGroup("all")}
            aria-pressed={group === "all"}
            className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
              group === "all"
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-border bg-surface text-muted hover:text-text"
            }`}
          >
            {dict.plugins.all} · {PLUGINS.length}
          </button>
          {PLUGIN_GROUPS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setGroup(item)}
              aria-pressed={group === item}
              className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                group === item
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:text-text"
              }`}
            >
              {dict.plugins.groups[item]} · {PLUGIN_COUNTS[item]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-10 border-t border-border pt-6 text-sm text-muted">{dict.plugins.empty}</p>
        ) : (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((plugin) => (
              <li key={plugin.id} className="min-w-0">
                <article className="group flex h-full flex-col rounded-xl border border-border bg-bg/50 p-4 transition-colors hover:border-accent/40 hover:bg-surface/60">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full transition-transform group-hover:scale-150"
                      style={{ backgroundColor: `var(--${plugin.accent})` }}
                    />
                    <h3 className="truncate font-mono text-sm text-text transition-colors group-hover:text-accent">
                      {plugin.id}
                    </h3>
                    <span className="ml-auto shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                      {dict.plugins.origins[plugin.origin]}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted">{plugin.note[locale]}</p>
                  <p className="mt-auto pt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted/70">
                    {dict.plugins.groups[plugin.group]}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted">{dict.plugins.hint}</p>
      </div>
    </section>
  );
}
