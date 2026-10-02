import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-center py-24 text-center md:py-32">
      <p className="t-display-l text-oxblood">404</p>
      <h1 className="t-h2 mt-6">This page has moved on</h1>
      <p className="mt-3 text-ink-soft">The piece you&rsquo;re looking for isn&rsquo;t here.</p>
      <ButtonLink href="/shop/all" className="mt-10">Shop new in</ButtonLink>
    </section>
  );
}
