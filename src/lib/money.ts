import type { Currency } from '../types'

const SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export function currencySymbol(currency: Currency): string {
  return SYMBOLS[currency]
}

/** Formats a single amount with two decimals, e.g. "$12.50". */
export function formatCurrency(amount: number, currency: Currency): string {
  return `${currencySymbol(currency)}${amount.toFixed(2)}`
}

/** Parses user input into a number; returns NaN for unparseable input. */
export function parseAmount(input: string): number {
  return Number(input.trim())
}
