"use client";

import { useState } from "react";
import type { NavItemDef } from "@/lib/nav";

interface NavItem extends NavItemDef {
  visible: boolean;
}

interface NavigationManagerProps {
  initialItems: NavItem[];
}

const GROUP_LABELS: Record<NavItemDef["group"], string> = {
  main: "Hauptmenü",
  more: "„Aktuelles“-Menü",
  cta: "Button",
};

export default function NavigationManager({ initialItems }: NavigationManagerProps) {
  const [items, setItems] = useState<NavItem[]>(initialItems);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedInfo, setSavedInfo] = useState<{ warning?: string } | null>(null);

  function toggle(id: string) {
    setSavedInfo(null);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSavedInfo(null);
    try {
      const visibility = Object.fromEntries(items.map((item) => [item.id, item.visible]));
      const res = await fetch("/api/admin/settings/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Speichern fehlgeschlagen.");
        return;
      }
      setSavedInfo({ warning: data.warning });
    } catch {
      setError("Verbindung zum Server fehlgeschlagen.");
    } finally {
      setSaving(false);
    }
  }

  const groups: NavItemDef["group"][] = ["main", "more", "cta"];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-6">
        {groups.map((group) => {
          const groupItems = items.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={group} className="mb-6 last:mb-0">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                {GROUP_LABELS[group]}
              </p>
              <div className="divide-y divide-border rounded-lg border border-border">
                {groupItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <span>
                      <span className="font-medium text-foreground">{item.label}</span>{" "}
                      <span className="text-muted">{item.href}</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={item.visible}
                      onChange={() => toggle(item.id)}
                      className="h-4 w-4 shrink-0 rounded border-border accent-accent"
                    />
                  </label>
                ))}
              </div>
            </div>
          );
        })}

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        {savedInfo && (
          <div
            className={`mt-4 rounded-lg border px-3.5 py-2.5 text-sm ${
              savedInfo.warning
                ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
            }`}
          >
            {savedInfo.warning ?? "Gespeichert. Die Änderung ist live auf der Website sichtbar."}
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-5 rounded-lg bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {saving ? "Wird gespeichert…" : "Speichern"}
        </button>
      </div>
    </div>
  );
}
