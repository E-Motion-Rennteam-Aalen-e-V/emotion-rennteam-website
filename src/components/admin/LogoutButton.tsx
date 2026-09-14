"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    const isDirty = (window as unknown as Record<string, unknown>).__cmsDirty;
    if (isDirty && !window.confirm("Ungespeicherte Änderungen verwerfen und abmelden?")) return;
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-foreground disabled:opacity-60"
    >
      {loading ? "…" : "Abmelden"}
    </button>
  );
}
