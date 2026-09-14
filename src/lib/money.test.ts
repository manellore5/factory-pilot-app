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

  it('formats sums with floating-point artifacts cleanly', () => {
    // 0.1 + 0.2 === 0.30000000000000004 in IEEE 754
    expect(formatCurrency(0.1 + 0.2, 'USD')).toBe('$0.30')
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
