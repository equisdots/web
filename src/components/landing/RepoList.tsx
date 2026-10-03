import { getDict, type Locale } from "@/lib/i18n";
import { REPOS } from "@/lib/repos";

export function RepoList({ locale }: { locale: Locale }) {
  const dict = getDict(locale);

  return (
    <section className="border-t border-border">
      <div className="container-page max-w-4xl py-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">{dict.home.reposTitle}</h2>
          <p className="mt-2 text-muted">{dict.home.reposSubtitle}</p>
        </div>

        <ul className="mt-8 border-t border-border">
          {REPOS.map((repo) => (
            <li key={repo.name}>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="w-36 shrink-0 font-mono text-sm transition-colors group-hover:text-accent">
                  {repo.name}
                </span>
                <span className="text-sm text-muted">{repo.description[locale]}</span>
                <span aria-hidden="true" className="ml-auto hidden text-muted transition-colors group-hover:text-text sm:block">
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
