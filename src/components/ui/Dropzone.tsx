"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface DroppedFile {
  id: string;
  file: File;
  previewUrl: string | null;
}

interface Props {
  accept?: string;
  maxSizeMb?: number;
  maxFiles?: number;
  onChange?: (files: DroppedFile[]) => void;
  className?: string;
}

type Action =
  | { type: "add"; files: DroppedFile[] }
  | { type: "remove"; id: string };

function reducer(state: DroppedFile[], action: Action): DroppedFile[] {
  switch (action.type) {
    case "add":
      return [...state, ...action.files].slice(0, 6);
    case "remove":
      return state.filter((f) => f.id !== action.id);
    default:
      return state;
  }
}

function fileIcon(type: string) {
  if (type.startsWith("image/")) return "🖼️";
  if (type === "application/pdf") return "📄";
  return "📎";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Dropzone({
  accept = "image/png,image/jpeg,image/webp,image/gif,application/pdf",
  maxSizeMb = 8,
  maxFiles = 6,
  onChange,
  className = "",
}: Props) {
  const [files, dispatch] = useReducer(reducer, []);
  const [dragging, setDragging] = useState(false);
  const [dragCount, setDragCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  useEffect(() => {
    onChange?.(files);
  }, [files, onChange]);

  const processFiles = useCallback(
    (incoming: FileList | File[]) => {
      setError(null);
      const list = Array.from(incoming);
      const maxBytes = maxSizeMb * 1024 * 1024;
      const acceptedTypes = accept.split(",").map((s) => s.trim());

      const valid: File[] = [];
      let errMsg: string | null = null;

      for (const file of list) {
        if (files.length + valid.length >= maxFiles) {
          errMsg = `Maximal ${maxFiles} Dateien erlaubt.`;
          break;
        }
        if (file.size > maxBytes) {
          errMsg = `„${file.name}" ist zu groß (max. ${maxSizeMb} MB).`;
          continue;
        }
        const typeMatch = acceptedTypes.some(
          (t) => t === file.type || (t.endsWith("/*") && file.type.startsWith(t.replace("/*", "/")))
        );
        if (!typeMatch) {
          errMsg = `„${file.name}" ist kein unterstützter Dateityp.`;
          continue;
        }
        valid.push(file);
      }

      if (errMsg) setError(errMsg);
      if (!valid.length) return;

      const droppedFiles: DroppedFile[] = valid.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      }));

      dispatch({ type: "add", files: droppedFiles });
    },
    [files.length, maxFiles, maxSizeMb, accept]
  );

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current += 1;
    setDragCount(e.dataTransfer.items.length);
    setDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current === 0) setDragging(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    setDragCount(0);
    processFiles(e.dataTransfer.files);
  };

  // Paste support
  useEffect(() => {
    function onPaste(e: ClipboardEvent) {
      if (!e.clipboardData?.files.length) return;
      processFiles(e.clipboardData.files);
    }
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [processFiles]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Drop zone */}
      <motion.div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        animate={dragging ? { scale: 1.015 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className={`relative cursor-pointer select-none overflow-hidden rounded-xl border-2 border-dashed px-5 py-7 text-center transition-colors duration-200 ${
          dragging
            ? "border-accent bg-accent/10"
            : "border-border bg-surface hover:border-accent/50 hover:bg-accent/5"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Dateien hochladen"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        {/* Animated upload icon */}
        <motion.div
          animate={dragging ? { y: -4, scale: 1.15 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </motion.div>

        <p className="text-sm font-semibold text-foreground">
          {dragging ? "Loslassen zum Hochladen" : "Dateien hier ablegen"}
        </p>
        <p className="mt-1 text-xs text-muted">
          oder{" "}
          <span className="font-medium text-accent-text underline underline-offset-2">
            durchsuchen
          </span>{" "}
          · auch einfügen möglich
        </p>
        <p className="mt-2 text-xs text-muted/70">
          PNG, JPG, WebP, GIF oder PDF · max. {maxSizeMb} MB · bis zu {maxFiles} Dateien
        </p>

        {/* Drag count badge */}
        <AnimatePresence>
          {dragging && dragCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-lg"
            >
              {dragCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
        aria-hidden
      />

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            role="alert"
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* File list */}
      <AnimatePresence initial={false}>
        {files.map((f, i) => (
          <motion.div
            key={f.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 28,
              delay: i * 0.04,
            }}
            className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            {/* Thumbnail or icon */}
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-accent/10">
              {f.previewUrl ? (
                <motion.img
                  src={f.previewUrl}
                  alt={f.file.name}
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg">
                  {fileIcon(f.file.type)}
                </div>
              )}
            </div>

            {/* Name + size */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{f.file.name}</p>
              <p className="text-xs text-muted">{formatSize(f.file.size)}</p>
            </div>

            {/* Remove button */}
            <motion.button
              type="button"
              onClick={() => {
                if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
                dispatch({ type: "remove", id: f.id });
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className="shrink-0 rounded-full p-1 text-muted opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100 focus:opacity-100"
              aria-label={`${f.file.name} entfernen`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
