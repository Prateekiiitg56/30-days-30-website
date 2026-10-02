import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Listing } from "@/components/Listing";
import { Breadcrumb } from "@/components/Overlays";
import { categories } from "@/lib/catalogue";

const names: Record<string, string> = { all: "New in", ...Object.fromEntries(categories.map((c) => [c.id, c.name])) };

export function generateStaticParams() {
  return Object.keys(names).map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  return { title: names[category] ?? "Shop" };
}

export default async function ShopPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = names[category];
  if (!title) notFound();

  return (
    <div className="container-x pb-20 pt-8 md:pb-28 md:pt-10">
      <Breadcrumb items={[["Home", "/"], [title]]} />
      <h1 data-split className="t-h1 mt-4">{title}</h1>
      <Listing category={category} />
    </div>
  );
}
