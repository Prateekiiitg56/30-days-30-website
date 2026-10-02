import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui";
import { formatPrice, FREE_DELIVERY_THRESHOLD } from "@/lib/catalogue";

export const metadata: Metadata = { title: "Help" };

const sections = [
  {
    id: "closet",
    title: "How the Virtual Closet works",
    body: [
      "Add clothes to your cart, then open your cart and tap “Try on in Virtual Closet”.",
      "Choose Full body (head to toe) or Half body (head to hips) and add one photo of yourself.",
      "Every piece in your cart appears on you. Switch items on and off, change size or colour, and your cart updates straight away.",
    ],
  },
  {
    id: "privacy",
    title: "Photo privacy",
    body: [
      "Your photo is used only to create your preview. It is never public and never used to train models.",
      "It is deleted when your session ends, unless you save a look. You can delete a saved look from your cart at any time.",
    ],
  },
  { id: "track", title: "Track order", body: ["Your confirmation email has a tracking link as soon as your parcel leaves us."] },
  {
    id: "returns",
    title: "Delivery & returns",
    body: [`Free delivery on orders above ${formatPrice(FREE_DELIVERY_THRESHOLD)}. Free returns within 30 days of delivery.`],
  },
  { id: "sizes", title: "Size guide", body: ["Every product page has a size guide with body measurements in centimetres."] },
  { id: "app", title: "Download app", body: ["The ORVAN app is coming soon for iOS and Android."] },
  { id: "contact", title: "Contact", body: ["Write to care@orvan.example — we reply within one working day."] },
];

export default function HelpPage() {
  return (
    <div className="container-x grid gap-12 pb-20 pt-10 md:pb-28 md:pt-14 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Eyebrow rule className="text-oxblood">Help</Eyebrow>
        <h1 className="t-h1 mt-4">How can we help?</h1>
        <nav aria-label="Help topics" className="mt-8">
          <ul className="flex flex-col">
            {sections.map((s) => (
              <li key={s.id}>
                <Link href={`#${s.id}`} className="inline-flex min-h-11 items-center text-ink-soft hover:text-ink">{s.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-col lg:col-span-7 lg:col-start-6">
        {sections.map((s) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="border-b border-line py-8 first:pt-0">
            <h2 id={`${s.id}-t`} className="t-h3">{s.title}</h2>
            {s.body.map((p) => (
              <p key={p} className="mt-3 max-w-prose text-ink-soft">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
