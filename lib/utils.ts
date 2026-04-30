import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function calculatePourCost(components: Array<{ cost: number; amount: number }>): number {
  return components.reduce((sum, c) => sum + (c.cost * c.amount), 0)
}

export function calculateDilution(spirit_abv: number, final_volume: number, dilution_amount: number): number {
  const spiritVolume = final_volume - dilution_amount
  return (spirit_abv * spiritVolume) / final_volume
}
