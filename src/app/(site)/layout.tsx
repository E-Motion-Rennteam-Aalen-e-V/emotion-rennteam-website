import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { getHiddenNavIds } from "@/lib/nav-settings.server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const hiddenIds = await getHiddenNavIds();
  return (
    <>
      <Header hiddenIds={hiddenIds} />
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer hiddenIds={hiddenIds} />
    </>
  );
}
