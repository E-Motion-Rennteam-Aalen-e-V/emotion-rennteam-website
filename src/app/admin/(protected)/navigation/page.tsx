import { NAV_ITEMS, isNavItemVisible } from "@/lib/nav";
import { getNavVisibility } from "@/lib/nav-settings.server";
import NavigationManager from "@/components/admin/NavigationManager";

export default async function NavigationPage() {
  const visibility = await getNavVisibility();
  const items = NAV_ITEMS.map((item) => ({ ...item, visible: isNavItemVisible(item.id, visibility) }));

  return (
    <div>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground">Navigation</h1>
        <p className="text-sm text-muted">
          Blende Menüpunkte im Header der Website ein oder aus. Die Änderung wird gespeichert, per Git committed
          und ist danach live auf der Website sichtbar.
        </p>
      </div>
      <NavigationManager initialItems={items} />
    </div>
  );
}
