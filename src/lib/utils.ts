import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Mapea n de [inMin,inMax] a [outMin,outMax] y lo clampea. Útil para scroll/mouse. */
export function mapRange(
  n: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const t = (n - inMin) / (inMax - inMin);
  const clamped = Math.min(Math.max(t, 0), 1);
  return outMin + clamped * (outMax - outMin);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
