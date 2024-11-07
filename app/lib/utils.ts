import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatNumber(value: number): string {
  const fixedValue = (value / 1000000).toFixed(1);

  if (value < 1000) {
    return value.toString();
  }

  if (value < 1000000) {
    if (fixedValue.endsWith(".0")) {
      return `${(value / 1000).toFixed(0)}k`;
    }

    return `${(value / 1000).toFixed(1)}k`;
  }

  if (fixedValue.endsWith(".0")) {
    return `${(value / 1000000).toFixed(0)}m`;
  }

  return `${(value / 1000000).toFixed(1)}m`;
}
