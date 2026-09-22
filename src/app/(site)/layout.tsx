import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { getHiddenNavIds } from "@/lib/nav-settings.server";
import { getVehicles } from "@/lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const hiddenIds = await getHiddenNavIds();
  const vehicles = getVehicles();
  return (
    <>
      <Header hiddenIds={hiddenIds} vehicles={vehicles} />
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </>
  );
}
