import { RepoArt } from "./RepoArt";
import { SectionHeader } from "./SectionHeader";
import { getDict, type Locale } from "@/lib/i18n";
import { REPOS, REPO_GROUPS } from "@/lib/repos";

export function RepoList({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const groups = REPO_GROUPS.map((group) => ({
    id: group,
    label: dict.home.repoGroups[group],
    repos: REPOS.filter((repo) => repo.group === group),
  })).filter((group) => group.repos.length > 0);

  return (
    <section id="repositories" className="border-t border-border">
      <div className="container-page max-w-6xl py-16">
        <SectionHeader
          index="05"
          label={dict.home.labels.repos}
          title={dict.home.reposTitle}
          subtitle={dict.home.reposSubtitle}
        />

        <div className="mt-10 flex flex-wrap items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
          <span className="rounded-full border border-border bg-surface px-3 py-1">{REPOS.length} repos</span>
          <span className="rounded-full border border-border bg-surface px-3 py-1">
            {groups.length} layers
          </span>
          <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent">
            63 plugins
          </span>
        </div>

        {groups.map((group) => (
          <div key={group.id} className="mt-12 first:mt-10">
            <div className="flex items-baseline gap-3 border-b border-border pb-2.5">
              <h3 className="text-sm font-medium">{group.label}</h3>
              <span className="index">{String(group.repos.length).padStart(2, "0")}</span>
            </div>

            <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {group.repos.map((repo) => (
                <li key={repo.name} className="min-w-0">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex h-full flex-col rounded-xl border border-border bg-surface/40 transition-colors hover:border-accent/50 hover:bg-surface"
                  >
                    <div className="flex gap-3.5 p-4">
                      <div className="w-[74px] shrink-0 self-start rounded-lg border border-border/70 bg-bg/60 p-1">
                        <RepoArt visual={repo.visual} accent={repo.accent} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-2">
                          <h4 className="truncate font-mono text-sm transition-colors group-hover:text-accent">
                            {repo.name}
                          </h4>
                          <span className="ml-auto shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted">
                            {repo.role[locale]}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-5 text-muted">{repo.description[locale]}</p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-2 border-t border-border px-4 py-2.5 font-mono text-[0.62rem] text-muted">
                      <span className="truncate">{repo.install}</span>
                      <span
                        aria-hidden="true"
                        className="ml-auto shrink-0 transition-colors group-hover:text-accent"
                      >
                        ↗
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
