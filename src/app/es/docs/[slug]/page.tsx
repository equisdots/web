import type { Metadata } from "next";
import { DocPage } from "@/components/docs/DocPage";
import { getDoc, getDocSlugs } from "@/lib/docs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getDocSlugs("es").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc("es", slug);
  return doc ? { title: doc.title, description: doc.description } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DocPage locale="es" slug={slug} />;
}
