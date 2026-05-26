import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Normalize a WhatsApp number to digits-only, with Brazil country code (55) prepended if missing. */
export function normalizeWhatsApp(raw?: string | null): string {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : `55${digits}`;
}

/** Format a phone string for display. Accepts any input and returns "(DD) NNNNN-NNNN". */
export function formatPhoneDisplay(raw?: string | null): string {
  if (!raw) return "";
  let d = String(raw).replace(/\D/g, "");
  if (d.startsWith("55") && d.length > 11) d = d.slice(2);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return raw;
}

/** Build a full Instagram URL from a handle (@user), user, or full URL. */
export function normalizeInstagramUrl(raw?: string | null): string {
  if (!raw) return "";
  const v = String(raw).trim();
  if (/^https?:\/\//i.test(v)) return v;
  const handle = v.replace(/^@/, "").replace(/^instagram\.com\//i, "");
  return `https://instagram.com/${handle}`;
}

/** Display form of an Instagram handle: "@user". */
export function formatInstagramHandle(raw?: string | null): string {
  if (!raw) return "";
  const v = String(raw).trim();
  const match = v.match(/instagram\.com\/([^/?#]+)/i);
  const handle = match ? match[1] : v.replace(/^@/, "");
  return `@${handle}`;
}
