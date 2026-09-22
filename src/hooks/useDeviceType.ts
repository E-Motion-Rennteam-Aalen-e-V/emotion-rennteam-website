"use client";

import { useSyncExternalStore } from "react";
import { detectDevice, type DeviceType } from "@/lib/device";

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange, { passive: true });
  return () => window.removeEventListener("resize", onChange);
}

function getSnapshot(): DeviceType {
  const fromDom = document.documentElement.getAttribute("data-device") as DeviceType | null;
  return fromDom ?? detectDevice(window);
}

function getServerSnapshot(): DeviceType {
  return "desktop";
}

/**
 * Reads the device type the inline bootstrap script (see layout.tsx) already
 * wrote to <html data-device>, then keeps it in sync on resize/orientation
 * change via useSyncExternalStore, so React never disagrees with the DOM
 * attribute the script owns.
 */
export function useDeviceType(): DeviceType {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
