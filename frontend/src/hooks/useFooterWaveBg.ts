import { useEffect } from "react";

/**
 * Sets the background color that fills behind the footer's wave divider.
 * Pages call this with the color of their LAST section so the divider
 * blends seamlessly into that section instead of showing a color break.
 *
 * Pass any valid CSS color, e.g. "hsl(var(--secondary))", "hsl(var(--chocolate))".
 */
export const useFooterWaveBg = (color: string) => {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.getPropertyValue("--footer-wave-bg");
    root.style.setProperty("--footer-wave-bg", color);
    return () => {
      if (previous) root.style.setProperty("--footer-wave-bg", previous);
      else root.style.removeProperty("--footer-wave-bg");
    };
  }, [color]);
};
