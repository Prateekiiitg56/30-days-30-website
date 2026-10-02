import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import { Motion } from "@/components/Motion";
import { MiniCart, Toaster } from "@/components/Overlays";
import "./globals.css";

const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-jost", display: "swap" });

export const metadata: Metadata = {
  title: { default: "ORVAN — Fashion that moves with you", template: "%s · ORVAN" },
  description: "Editorial fashion for Men, Women, Kids and Beauty — with a Virtual Closet to try your cart on before you buy.",
};

export const viewport: Viewport = { themeColor: "#5C1A1F" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jost.variable} suppressHydrationWarning>
      <head>
        {/* Before first paint: opt into motion unless the visitor prefers reduced motion. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')",
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-porcelain">
        <a
          href="#main"
          className="t-label sr-only z-[70] bg-ink px-5 py-4 text-porcelain focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
        <MiniCart />
        <Motion />
        <Toaster />
      </body>
    </html>
  );
}
