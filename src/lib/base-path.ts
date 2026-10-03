// GitHub Pages project sites live under /<repo>/. `next.config.ts` injects
// NEXT_PUBLIC_BASE_PATH (default "/web"); Next prefixes <Link> and next/image
// automatically, but plain <img> and other absolute URLs need this helper.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/web";

export function withBasePath(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}
