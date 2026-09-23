"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getConsentServerSnapshot,
  hasMarketingConsent,
  readConsentCookie,
  subscribeConsent,
} from "@/lib/consent";
import { trackPixelEvent } from "@/lib/metaPixel";

/**
 * Loads the Meta Pixel (via next/script, strategy="afterInteractive") only
 * when both NEXT_PUBLIC_META_PIXEL_ID is configured and the visitor has
 * given marketing consent in the cookie banner (DSGVO: no tracking before
 * consent). Renders nothing, and stays a safe no-op, otherwise.
 */
export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsentCookie,
    getConsentServerSnapshot
  );
  const enabled = Boolean(pixelId) && hasMarketingConsent(consent);
  const skipNextPageView = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    // The injected script below already fires the initial PageView once it
    // loads; only track pathname changes after that.
    if (skipNextPageView.current) {
      skipNextPageView.current = false;
      return;
    }
    trackPixelEvent("PageView");
  }, [enabled, pathname]);

  if (!enabled) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
