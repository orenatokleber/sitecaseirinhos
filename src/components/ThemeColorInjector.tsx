import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteContent";

/**
 * Converts a hex color (#rrggbb) to HSL string "h s% l%" for CSS variables.
 */
function hexToHsl(hex: string): string | null {
  if (!hex || !/^#([0-9A-Fa-f]{6})$/.test(hex)) return null;

  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/**
 * Injects global theme colors from site_settings into CSS custom properties.
 */
export function ThemeColorInjector() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const colors = settings?.theme_colors as Record<string, string> | undefined;
    if (!colors) return;

    const root = document.documentElement;
    const mappings: Record<string, string> = {
      primary: '--primary',
      accent: '--accent',
      gold: '--gold',
      background: '--background',
      foreground: '--foreground',
    };

    Object.entries(mappings).forEach(([key, cssVar]) => {
      const hsl = hexToHsl(colors[key]);
      if (hsl) {
        root.style.setProperty(cssVar, hsl);
      } else if (!colors[key]) {
        // Reset to default if cleared
        root.style.removeProperty(cssVar);
      }
    });

    return () => {
      // Cleanup on unmount
      Object.values(mappings).forEach((cssVar) => {
        root.style.removeProperty(cssVar);
      });
    };
  }, [settings]);

  return null;
}
