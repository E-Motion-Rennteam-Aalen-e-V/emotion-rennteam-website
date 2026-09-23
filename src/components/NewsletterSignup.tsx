"use client";

import { FormEvent, useState } from "react";

export interface NewsletterSignupProps {
  className?: string;
  onSuccess?: () => void;
}

export function NewsletterSignup({ className = "", onSuccess }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formRenderedAt] = useState(Date.now());

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent,
          website: "", // honeypot
          formRenderedAt,
        }),
      });

      const data = (await response.json()) as { ok: boolean; errors?: Record<string, string>; error?: string };

      if (!response.ok) {
        if (data.errors) {
          setError(Object.values(data.errors)[0] || "Anmeldung fehlgeschlagen");
        } else {
          setError(data.error || "Anmeldung fehlgeschlagen");
        }
        return;
      }

      if (!data.ok) {
        setError(data.error || "Anmeldung fehlgeschlagen");
        return;
      }

      setSubmitted(true);
      setEmail("");
      setConsent(false);
      onSuccess?.();

      // Auto-reset nach 5 Sekunden
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError("Netzwerkfehler. Bitte versuche es später erneut.");
      console.error("Newsletter signup error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className={`rounded-lg bg-green-50 p-4 text-green-800 ${className}`}>
        <p className="font-semibold">✓ Danke für deine Anmeldung!</p>
        <p className="text-sm mt-1">Du erhältst in Kürze eine Willkommens-Email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-3">
        <div>
          <label htmlFor="newsletter-email" className="block text-sm font-medium mb-1">
            E-Mail-Adresse
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.de"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={loading}
          />
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="mt-1 rounded border-gray-300"
            disabled={loading}
          />
          <span>
            Ich stimme der Speicherung meiner E-Mail für Newsletter-Updates zu.{" "}
            <a href="/datenschutz" className="text-blue-600 hover:underline">
              Datenschutz
            </a>
          </span>
        </label>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email || !consent}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Wird angemeldet..." : "Newsletter abonnieren"}
        </button>
      </div>
    </form>
  );
}
