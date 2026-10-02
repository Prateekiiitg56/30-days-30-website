import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { ButtonLink, Eyebrow } from "@/components/ui";

export const metadata: Metadata = { title: "Thank you" };

export default async function Confirmation({ searchParams }: { searchParams: Promise<{ order?: string; email?: string }> }) {
  const { order, email } = await searchParams;
  return (
    <section className="container-x flex flex-col items-center py-20 text-center md:py-32">
      <Icon name="check-circle" size={36} className="text-success" />
      <Eyebrow className="mt-6 text-oxblood">Order confirmed</Eyebrow>
      <h1 className="t-display-l mt-4">Thank you</h1>
      <p className="t-body-l mt-6 text-ink-soft">
        Order <span className="font-medium text-ink">{order ?? "ORV-000000"}</span>
      </p>
      {email && <p className="mt-2 text-ink-soft">A confirmation is on its way to {email}.</p>}
      <p className="t-caption mt-6 max-w-sm text-ink-soft">This was a demo order. Nothing was charged.</p>
      <ButtonLink href="/shop/all" className="mt-10">Continue shopping</ButtonLink>
    </section>
  );
}
