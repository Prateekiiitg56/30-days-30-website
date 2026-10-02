import { SiteFooter } from "@/components/SiteFooter";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
