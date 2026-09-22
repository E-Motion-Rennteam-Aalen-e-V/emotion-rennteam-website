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
          className="rounded-xl border border-accent/30 bg-surface px-6 py-5 text-center"
        >
          <p className="text-sm font-semibold text-accent" role="status">
            ✓ Vielen Dank!
          </p>
          <p className="mt-1 text-xs text-muted">
            Du erhältst in Kürze eine Bestätigungsmail.
          </p>
        </motion.div>
      ) : (
        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            <HoneypotField />

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                E-Mail-Adresse
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="deine@email.de"
                aria-invalid={status === "error"}
                className="w-full flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/30"
              />
              <button
                type="submit"
                disabled={status === "sending" || !privacyChecked}
                className="shrink-0 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-all hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {status === "sending" ? "Wird angemeldet…" : "Anmelden"}
              </button>
            </div>
            {errorMessage && (
              <p role="alert" className="text-xs text-red-500">
                {errorMessage}
              </p>
            )}

            <label
              htmlFor="newsletter-privacy"
              className="flex items-start gap-2.5 text-left text-xs leading-relaxed text-muted cursor-pointer"
            >
              <input
                id="newsletter-privacy"
                type="checkbox"
                checked={privacyChecked}
                onChange={(e) => setPrivacyChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-accent"
                required
              />
              <span>
                Ich stimme der{" "}
                <Link href="/datenschutz" className="font-semibold text-accent-text hover:underline">
                  Datenschutzerklärung
                </Link>
                {" "}zu und akzeptiere die Speicherung meiner Daten zur Newsletter-Verwaltung.
              </span>
            </label>

            <p className="text-xs text-muted">Abmeldung jederzeit möglich – kein Spam, versprochen.</p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
