import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Overlays";
import { ProductDetail } from "@/components/ProductDetail";
import { categories, getProduct, products } from "@/lib/catalogue";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = getProduct((await params).id);
  return { title: p?.name ?? "Product", description: p?.description };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  const cat = categories.find((c) => c.id === product.category)!;

  return (
    <div className="container-x pb-20 pt-8 md:pb-28 md:pt-10">
      <Breadcrumb items={[["Home", "/"], [cat.name, `/shop/${cat.id}`], [product.name]]} />
      <ProductDetail product={product} />
    </div>
  );
}
