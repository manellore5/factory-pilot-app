import { describe, expect, it } from 'vitest'
import { currencySymbol, formatCurrency, parseAmount } from './money'

describe('currencySymbol', () => {
  it('maps each currency to its symbol', () => {
    expect(currencySymbol('USD')).toBe('$')
    expect(currencySymbol('EUR')).toBe('€')
    expect(currencySymbol('GBP')).toBe('£')
  })
})

describe('formatCurrency', () => {
  it('always shows two decimals', () => {
    expect(formatCurrency(12.5, 'USD')).toBe('$12.50')
    expect(formatCurrency(7, 'EUR')).toBe('€7.00')
  })
})

describe('parseAmount', () => {
  it('parses decimal input and trims whitespace', () => {
    expect(parseAmount(' 12.50 ')).toBe(12.5)
  })

  it('returns NaN for non-numeric input', () => {
    expect(parseAmount('abc')).toBeNaN()
  })
})
