import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) return `₹${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `₹${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(1)}K`
  return `₹${value.toFixed(0)}`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}
