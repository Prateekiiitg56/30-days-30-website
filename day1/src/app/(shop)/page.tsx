import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { Icon, type IconName } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { bestOf, categories, getProduct, type Product } from "@/lib/catalogue";

const trust: { icon: IconName; label: string; caption: string }[] = [
  { icon: "truck", label: "Fast delivery", caption: "Dispatched in 24 hours" },
  { icon: "box", label: "Easy returns", caption: "Free returns within 30 days" },
  { icon: "badge-check", label: "Quality assured", caption: "Natural fibres, checked by hand" },
  { icon: "lock", label: "Secure payment", caption: "Encrypted at every step" },
];

export default function Home() {
  const best = bestOf.map(getProduct).filter(Boolean) as Product[];

  return (
    <>
      <Hero />
      <Marquee />

      {/* Category band — oxblood (H-2) */}
      <section aria-labelledby="cat-title" className="on-dark bg-oxblood text-on-brand">
        <h2 id="cat-title" className="sr-only">Shop by category</h2>
        <div data-reveal="stagger" className="container-x grid divide-y divide-on-brand/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {categories
            .filter((c) => c.image)
            .map((c) => (
              <Link
                key={c.id}
                href={`/shop/${c.id}`}
                className="group flex items-center gap-6 py-8 md:px-6 md:py-14 md:first:pl-0 md:last:pr-0 lg:gap-8 lg:px-10"
              >
                <div data-tilt className="relative aspect-[150/190] w-[110px] shrink-0 overflow-hidden bg-stone shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] lg:w-[150px]">
                  <Image
                    src={c.image!}
                    alt=""
                    fill
                    sizes="150px"
                    className="object-cover transition-transform duration-700 ease-brand group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="t-h3">{c.name}</h3>
                  <p className="mt-2 text-[15px] text-on-brand/90">{c.line}</p>
                  <span className="t-label mt-5 inline-flex items-center gap-2 text-blush">
                    Shop {c.name}
                    <Icon name="arrow-right" size={16} className="transition-transform duration-200 ease-brand group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* New Vibes — linen (H-3) */}
      <section aria-labelledby="vibes-title" className="bg-linen">
        <div className="container-x grid items-stretch md:grid-cols-2 md:min-h-[560px]">
          <div data-reveal className="flex flex-col justify-center py-16 md:py-20 md:pr-12">
            <Eyebrow rule className="text-oxblood">New season</Eyebrow>
            <h2 id="vibes-title" data-split className="t-display-l mt-6">
              New
              <br />
              vibes
            </h2>
            <p className="t-body-l mt-6 max-w-sm text-ink-soft">Discover everything new and now.</p>
            <ButtonLink href="/shop/all?sort=new" className="mt-10 self-start">
              Explore collection
            </ButtonLink>
          </div>
          <div className="relative -mx-5 aspect-[4/5] overflow-hidden md:mx-0 md:aspect-auto">
            <div data-parallax="40" className="absolute -inset-y-12 inset-x-0">
            <Image
              src="/images/editorial/new-vibes.webp"
              alt="Model in a blush satin slip dress with a cream shirt draped over her shoulders"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[50%_20%]"
            />
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Closet promo — petal (H-6) */}
      <section aria-labelledby="closet-title" className="bg-blush-soft">
        <div data-reveal className="container-x flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex items-start gap-5">
            <span className="flex size-12 shrink-0 items-center justify-center bg-oxblood text-on-brand">
              <Icon name="sparkle" size={22} />
            </span>
            <div>
              <p className="t-label text-[12px] text-oxblood">Virtual Closet</p>
              <h2 id="closet-title" className="mt-2 text-[22px] font-medium leading-tight md:text-[26px]">
                Add to cart, then try it on.
              </h2>
              <p className="mt-1 text-ink-soft">Upload one photo and see your whole cart on you before you pay.</p>
            </div>
          </div>
          <Link href="/help#closet" className="t-label link-underline min-h-11 shrink-0 self-start md:self-auto">
            How the Virtual Closet works
          </Link>
        </div>
      </section>

      {/* Trust row (H-4) */}
      <section aria-label="Why ORVAN" className="bg-porcelain">
        <ul data-reveal="stagger" data-draw className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:py-16 lg:grid-cols-4 lg:py-0 lg:min-h-[200px] lg:items-center">
          {trust.map((t) => (
            <li key={t.label} className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-5">
              <Icon name={t.icon} size={28} className="shrink-0 text-oxblood" />
              <div>
                <p className="t-label text-[13px]">{t.label}</p>
                <p className="t-caption mt-1.5 text-ink-soft">{t.caption}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Best of ORVAN (H-5) */}
      <section aria-labelledby="best-title" className="bg-chalk">
        <div className="container-x py-16 md:py-24">
          <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
            <h2 id="best-title" data-split className="t-h2">Best of ORVAN</h2>
            <Link href="/shop/all" className="t-label link-underline min-h-11 shrink-0 content-center">
              View all
            </Link>
          </div>
          <div data-reveal="stagger" className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {best.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
