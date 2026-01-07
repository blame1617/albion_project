// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Esta función ya la trae shadcn por defecto
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- AGREGA ESTA NUEVA FUNCIÓN ---
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString + "Z"); // La Z es importante porque la API devuelve UTC
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Hace unos segundos";
  if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
  return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
}

export function isPriceOld(dateString: string): boolean {
  // 4 horas en milisegundos
  const FOUR_HOURS = 4 * 60 * 60 * 1000;
  
  const priceDate = new Date(dateString + "Z").getTime();
  const now = Date.now();
  
  return priceDate < (now - FOUR_HOURS);
}