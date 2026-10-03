import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page py-24 text-center">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Page not found</h1>
      <Link href="/" className="btn mt-6 inline-flex">
        Back to home
      </Link>
    </main>
  );
}
