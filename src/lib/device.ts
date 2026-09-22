export type DeviceType = "mobile" | "tablet" | "desktop";

const MOBILE_UA = /Android.*Mobile|iPhone|iPod|Windows Phone/i;
const TABLET_UA = /iPad|Android(?!.*Mobile)|Tablet/i;

/**
 * Combines viewport width, pointer/hover capability and User-Agent hints
 * rather than relying on any single signal alone: width alone mismatches a
 * narrowed desktop window, UA alone mismatches new/unlisted devices, and
 * pointer alone mismatches touch-screen laptops.
 */
export function detectDevice(win: Window): DeviceType {
  const ua = win.navigator.userAgent;
  const width = win.innerWidth;
  const coarsePointer = win.matchMedia?.("(pointer: coarse)").matches ?? false;
  const noHover = win.matchMedia?.("(hover: none)").matches ?? false;
  const touchLike = coarsePointer || noHover;

  if (TABLET_UA.test(ua) || (touchLike && width >= 768 && width < 1280)) {
    return "tablet";
  }
  if (MOBILE_UA.test(ua) || (touchLike && width < 768)) {
    return "mobile";
  }
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/** Inlined into <head> so the device is known before first paint (no flash of wrong layout). */
export const DEVICE_BOOTSTRAP_SCRIPT = `
(function () {
  var MOBILE_UA = /Android.*Mobile|iPhone|iPod|Windows Phone/i;
  var TABLET_UA = /iPad|Android(?!.*Mobile)|Tablet/i;
  function detect() {
    var ua = navigator.userAgent;
    var w = window.innerWidth;
    var coarse = (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) || false;
    var noHover = (window.matchMedia && window.matchMedia("(hover: none)").matches) || false;
    var touchLike = coarse || noHover;
    if (TABLET_UA.test(ua) || (touchLike && w >= 768 && w < 1280)) return "tablet";
    if (MOBILE_UA.test(ua) || (touchLike && w < 768)) return "mobile";
    if (w < 768) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  }
  function apply() {
    document.documentElement.setAttribute("data-device", detect());
  }
  apply();
  window.addEventListener("resize", apply, { passive: true });
})();
`;
