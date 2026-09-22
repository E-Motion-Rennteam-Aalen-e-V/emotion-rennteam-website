"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFormSubmit } from "@/lib/useFormSubmit";
import HoneypotField from "@/components/HoneypotField";

export default function NewsletterForm() {
  const { status, errorMessage, submit } = useFormSubmit("/api/newsletter");
  const [privacyChecked, setPrivacyChecked] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!privacyChecked) return;
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    await submit(payload);
  }

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm font-semibold text-accent mb-1" role="status">
            ✓ Vielen Dank!
          </p>
          <p className="text-xs text-muted">
            Du erhältst in Kürze eine Bestätigungsmail.
          </p>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <HoneypotField />

            <div className="space-y-2">
              <label htmlFor="newsletter-email" className="text-xs font-semibold uppercase tracking-widest text-accent-text">
                E-Mail-Adresse
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="deine@email.de"
                aria-invalid={status === "error"}
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
              />
              {errorMessage && (
                <p role="alert" className="text-xs text-red-500">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-2">
              <input
                id="newsletter-privacy"
                type="checkbox"
                checked={privacyChecked}
                onChange={(e) => setPrivacyChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
                required
              />
              <label htmlFor="newsletter-privacy" className="text-xs text-muted leading-relaxed cursor-pointer">
                Ich stimme der{" "}
                <Link href="/datenschutz" className="font-semibold text-accent hover:underline">
                  Datenschutzerklärung
                </Link>
                {" "}zu und akzeptiere die Speicherung meiner Daten zur Newsletter-Verwaltung.
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "sending" || !privacyChecked}
              className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-all hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {status === "sending" ? "Wird angemeldet…" : "Jetzt anmelden"}
            </button>

            <p className="text-center text-xs text-muted">
              Abmeldung jederzeit möglich – kein Spam, versprochen.
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
