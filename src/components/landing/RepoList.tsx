import { SectionHeader } from "./SectionHeader";
import { getDict, type Locale } from "@/lib/i18n";
import { REPOS } from "@/lib/repos";

export function RepoList({ locale }: { locale: Locale }) {
  const dict = getDict(locale);

  return (
    <section className="border-t border-border">
      <div className="container-page max-w-4xl py-16">
        <SectionHeader
          index="03"
          label={dict.home.labels.repos}
          title={dict.home.reposTitle}
          subtitle={dict.home.reposSubtitle}
        />

        <div className="mt-10 hidden grid-cols-[9rem_1fr_2rem] gap-6 border-b border-border pb-2 sm:grid">
          <span className="label">{dict.home.table.repo}</span>
          <span className="label">{dict.home.table.purpose}</span>
          <span />
        </div>

        <ul>
          {REPOS.map((repo, index) => (
            <li key={repo.name}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="group grid grid-cols-[2rem_1fr] items-baseline gap-x-4 gap-y-1 border-b border-border py-4 sm:grid-cols-[9rem_1fr_2rem] sm:gap-6"
              >
                <span className="index sm:hidden">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-mono text-sm transition-colors group-hover:text-accent">{repo.name}</span>
                <span className="col-start-2 text-sm leading-6 text-muted sm:col-start-auto">
                  {repo.description[locale]}
                </span>
                <span
                  aria-hidden="true"
                  className="col-start-2 hidden text-muted transition-colors group-hover:text-text sm:col-start-auto sm:block"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
