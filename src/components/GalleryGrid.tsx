"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";
import { AnimatePresence, motion } from "framer-motion";
import { StaggerGroup, StaggerItem } from "@/components/motion/Stagger";

type GalleryImage = {
  slug: string;
  title: string;
  image: string;
};

// Thumbnail with a pulsing skeleton until the image has actually decoded, so
// a slow connection reads as "loading" instead of "broken" (the gap this was
// added to close). Falls back to ImageWithFallback's placeholder on a real
// load error (e.g. a moved/deleted file).
function GalleryThumbnail({
  src,
  priority,
  onError,
}: {
  src: string;
  priority: boolean;
  onError?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // An image served from the browser cache can finish loading before this
  // component's onLoad handler is even attached, so the load event never
  // reaches us and the thumbnail would stay stuck at opacity-0 forever.
  // Catch that case once on mount by checking the native `complete` flag.
  useLayoutEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-surface-2" aria-hidden />}
      <ImageWithFallback
        ref={imgRef}
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover transition-all duration-500 group-hover:scale-110 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        priority={priority}
        onLoad={() => setLoaded(true)}
        onImageError={onError}
      />
    </>
  );
}

export default function GalleryGrid({ images, onImageError }: { images: GalleryImage[]; onImageError?: () => void }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? images[activeIndex] : null;
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  function open(index: number, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  }

  function close() {
    setActiveIndex(null);
    lastTriggerRef.current?.focus();
  }

  function next() {
    setActiveIndex((i) => (i !== null ? (i + 1) % images.length : null));
  }

  function prev() {
    setActiveIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }

  // Keyboard support for the lightbox: Escape closes it, arrow keys step
  // through images. Also lock body scroll while it's open and trap focus.
  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Tab") {
        const focusable = Array.from(
          document.querySelectorAll("[data-focus-trap]")
        ) as HTMLButtonElement[];
        if (focusable.length === 0) return;
        const currentIndex = focusable.indexOf(document.activeElement as HTMLButtonElement);
        if (e.shiftKey) {
          if (currentIndex <= 0) {
            e.preventDefault();
            focusable[focusable.length - 1].focus();
          }
        } else {
          if (currentIndex === focusable.length - 1) {
            e.preventDefault();
            focusable[0].focus();
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, images.length]);

  // Move focus into the dialog when it opens so keyboard/screen-reader users
  // land somewhere sensible instead of staying on the (now hidden) trigger.
  useEffect(() => {
    if (active) closeButtonRef.current?.focus();
  }, [active]);

  return (
    <>
      <StaggerGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, i) => (
          <StaggerItem key={img.slug}>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {/* alt="" - the caption span below already gives this button an accessible
                  name via img.title; a non-empty alt here would announce it twice. */}
              <GalleryThumbnail src={img.image} priority={i < 3} onError={onImageError} />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-sm font-semibold text-foreground">{img.title}</span>
              </div>
            </button>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
                <ImageWithFallback
                  src={active.image}
                  alt={active.title}
                  fill
                  sizes="90vw"
                  className="object-contain bg-background"
                />
              </div>
              <p className="mt-4 text-center text-sm text-muted">{active.title}</p>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                aria-label="Schließen"
                data-focus-trap
                className="absolute -top-4 -right-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                ✕
              </button>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Vorheriges Bild"
                    data-focus-trap
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/80 text-foreground hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Nächstes Bild"
                    data-focus-trap
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/80 text-foreground hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    →
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
