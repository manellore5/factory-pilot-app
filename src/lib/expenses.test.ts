import { describe, expect, it } from 'vitest'
import type { Expense } from '../types'
import { parseAmount } from './money'
import {
  addExpense,
  filterByCategory,
  filterByMonth,
  formatExpenseTotal,
  getUniqueMonths,
  grandTotal,
  removeExpense,
  resolveEffectiveMonth,
  shareOfTotal,
  sortByAmount,
  sortByDate,
  totalsByCategory,
  validateExpenseInput,
} from './expenses'

const sample: Expense[] = [
  { id: 'a', description: 'Groceries', amount: 42, category: 'Food', date: '2026-09-01' },
  { id: 'b', description: 'Bus pass', amount: 30, category: 'Transport', date: '2026-09-03' },
  { id: 'c', description: 'Lunch', amount: 12.5, category: 'Food', date: '2026-09-02' },
]

describe('addExpense', () => {
  it('appends a new expense with a generated id', () => {
    const next = addExpense(sample, {
      description: 'Rent',
      amount: 900,
      category: 'Housing',
      date: '2026-09-01',
    })
    expect(next).toHaveLength(4)
    expect(next[3].id).toBeTruthy()
    expect(next[3].description).toBe('Rent')
    expect(sample).toHaveLength(3)
  })
})

describe('removeExpense', () => {
  it('removes the expense with the given id', () => {
    const next = removeExpense(sample, 'b')
    expect(next.map((e) => e.id)).toEqual(['a', 'c'])
  })

  it('returns the list unchanged for an unknown id', () => {
    expect(removeExpense(sample, 'zzz')).toBe(sample)
  })

  it('removes the correct expense when amounts are identical', () => {
    const dupes: Expense[] = [
      { id: 'x', description: 'Coffee', amount: 4.5, category: 'Food', date: '2026-09-01' },
      { id: 'y', description: 'Tea', amount: 4.5, category: 'Food', date: '2026-09-02' },
    ]
    const next = removeExpense(dupes, 'y')
    expect(next.map((e) => e.id)).toEqual(['x'])
    expect(next[0].description).toBe('Coffee')
  })
})

describe('filterByCategory', () => {
  it('returns everything for "All"', () => {
    expect(filterByCategory(sample, 'All')).toHaveLength(3)
  })

  it('keeps only the matching category', () => {
    expect(filterByCategory(sample, 'Food').map((e) => e.id)).toEqual(['a', 'c'])
  })
})

describe('filterByMonth', () => {
  const multiMonth: Expense[] = [
    { id: 'a', description: 'Groceries', amount: 42, category: 'Food', date: '2026-09-01' },
    { id: 'b', description: 'Bus pass', amount: 30, category: 'Transport', date: '2026-08-15' },
    { id: 'c', description: 'Lunch', amount: 12.5, category: 'Food', date: '2026-09-15' },
  ]

  it('returns everything for "All"', () => {
    expect(filterByMonth(multiMonth, 'All')).toHaveLength(3)
  })

  it('keeps only expenses from the matching month', () => {
    expect(filterByMonth(multiMonth, '2026-09').map((e) => e.id)).toEqual(['a', 'c'])
  })

  it('returns empty array for non-matching month', () => {
    expect(filterByMonth(multiMonth, '2026-07')).toEqual([])
  })
})

describe('getUniqueMonths', () => {
  it('returns unique months sorted newest first', () => {
    const expenses: Expense[] = [
      { id: 'a', description: 'A', amount: 1, category: 'Food', date: '2026-07-01' },
      { id: 'b', description: 'B', amount: 1, category: 'Food', date: '2026-09-01' },
      { id: 'c', description: 'C', amount: 1, category: 'Food', date: '2026-08-01' },
      { id: 'd', description: 'D', amount: 1, category: 'Food', date: '2026-09-15' },
    ]
    expect(getUniqueMonths(expenses)).toEqual(['2026-09', '2026-08', '2026-07'])
  })

  it('returns empty array for no expenses', () => {
    expect(getUniqueMonths([])).toEqual([])
  })
})

describe('sortByDate', () => {
  it('orders newest first without mutating the input', () => {
    expect(sortByDate(sample).map((e) => e.id)).toEqual(['b', 'c', 'a'])
    expect(sample[0].id).toBe('a')
  })
})

describe('sortByAmount', () => {
  it('orders largest first without mutating the input', () => {
    expect(sortByAmount(sample).map((e) => e.id)).toEqual(['a', 'b', 'c'])
    expect(sample[0].id).toBe('a')
  })

  it('preserves order for equal amounts', () => {
    const ties: Expense[] = [
      { id: 'x', description: 'A', amount: 10, category: 'Food', date: '2026-09-01' },
      { id: 'y', description: 'B', amount: 10, category: 'Food', date: '2026-09-02' },
      { id: 'z', description: 'C', amount: 10, category: 'Food', date: '2026-09-03' },
    ]
    expect(sortByAmount(ties).map((e) => e.id)).toEqual(['x', 'y', 'z'])
  })

  it('returns empty array for empty input', () => {
    expect(sortByAmount([])).toEqual([])
  })
})

describe('totalsByCategory', () => {
  it('sums amounts per category', () => {
    expect(totalsByCategory(sample)).toEqual({ Food: 54.5, Transport: 30 })
  })

  it('returns an empty object for no expenses', () => {
    expect(totalsByCategory([])).toEqual({})
  })
})

describe('grandTotal', () => {
  it('sums all amounts', () => {
    expect(grandTotal(sample)).toBe(84.5)
  })
})

describe('validateExpenseInput', () => {
  it('returns empty object for valid input', () => {
    expect(validateExpenseInput('Coffee', 3.5, '2026-09-17')).toEqual({})
  })

  it('returns description error for empty description', () => {
    const errors = validateExpenseInput('', 3.5, '2026-09-17')
    expect(errors.description).toBe('Description is required')
    expect(errors.amount).toBeUndefined()
  })

  it('returns description error for whitespace-only description', () => {
    const errors = validateExpenseInput('   ', 3.5, '2026-09-17')
    expect(errors.description).toBe('Description is required')
  })

  it('returns amount error for zero amount', () => {
    const errors = validateExpenseInput('Coffee', 0, '2026-09-17')
    expect(errors.amount).toBe('Amount must be greater than zero')
    expect(errors.description).toBeUndefined()
  })

  it('returns amount error for negative amount', () => {
    const errors = validateExpenseInput('Coffee', -5, '2026-09-17')
    expect(errors.amount).toBe('Amount must be greater than zero')
  })

  it('returns amount error for NaN amount', () => {
    const errors = validateExpenseInput('Coffee', NaN, '2026-09-17')
    expect(errors.amount).toBe('Amount must be a number')
  })

  it('returns "must be a number" for NaN from parseAmount("1,000")', () => {
    const errors = validateExpenseInput('Coffee', parseAmount('1,000'), '2026-09-17')
    expect(errors.amount).toBe('Amount must be a number')
  })

  it('returns amount error for Infinity amount', () => {
    const errors = validateExpenseInput('Coffee', Infinity, '2026-09-17')
    expect(errors.amount).toBe('Amount must be greater than zero')
  })

  it('returns amount error for -Infinity amount', () => {
    const errors = validateExpenseInput('Coffee', -Infinity, '2026-09-17')
    expect(errors.amount).toBe('Amount must be greater than zero')
  })

  it('returns amount error for overflowing number (1e400)', () => {
    const errors = validateExpenseInput('Coffee', parseFloat('1e400'), '2026-09-17')
    expect(errors.amount).toBe('Amount must be greater than zero')
  })

  it('returns multiple errors when both fields are invalid', () => {
    const errors = validateExpenseInput('', -5, '2026-09-17')
    expect(errors.description).toBe('Description is required')
    expect(errors.amount).toBe('Amount must be greater than zero')
  })

  it('returns date error for empty date', () => {
    const errors = validateExpenseInput('Coffee', 3.5, '')
    expect(errors.date).toBe('Date is required')
    expect(errors.description).toBeUndefined()
    expect(errors.amount).toBeUndefined()
  })

  it('returns date error for invalid date format', () => {
    expect(validateExpenseInput('Coffee', 3.5, '09-17-2026').date).toBe('Date is required')
    expect(validateExpenseInput('Coffee', 3.5, '2026/09/17').date).toBe('Date is required')
    expect(validateExpenseInput('Coffee', 3.5, 'invalid').date).toBe('Date is required')
  })

  it('returns multiple errors including date when all fields are invalid', () => {
    const errors = validateExpenseInput('', -5, '')
    expect(errors.description).toBe('Description is required')
    expect(errors.amount).toBe('Amount must be greater than zero')
    expect(errors.date).toBe('Date is required')
  })
})

describe('formatExpenseTotal', () => {
  it('formats total with plural expenses', () => {
    expect(formatExpenseTotal(3, 84.5, 'USD')).toBe('Total: $84.50 (3 expenses)')
  })

  it('formats total with singular expense', () => {
    expect(formatExpenseTotal(1, 42, 'USD')).toBe('Total: $42.00 (1 expense)')
  })

  it('formats zero expenses', () => {
    expect(formatExpenseTotal(0, 0, 'USD')).toBe('Total: $0.00 (0 expenses)')
  })

  it('formats with EUR currency', () => {
    expect(formatExpenseTotal(2, 100, 'EUR')).toBe('Total: €100.00 (2 expenses)')
  })
})

describe('resolveEffectiveMonth', () => {
  it('returns "All" when month is "All"', () => {
    expect(resolveEffectiveMonth('All', ['2026-09', '2026-08'])).toBe('All')
  })

  it('returns the month when it exists in available months', () => {
    expect(resolveEffectiveMonth('2026-09', ['2026-09', '2026-08'])).toBe('2026-09')
  })

  it('returns "All" when month does not exist in available months', () => {
    expect(resolveEffectiveMonth('2026-07', ['2026-09', '2026-08'])).toBe('All')
  })

  it('returns "All" when available months is empty', () => {
    expect(resolveEffectiveMonth('2026-09', [])).toBe('All')
  })
})

describe('shareOfTotal', () => {
  it('returns each category share as a percentage rounded to one decimal', () => {
    // Food: 54.5, Transport: 30 → total 84.5
    // Food: 54.5/84.5 = 64.497...% → 64.5%
    // Transport: 30/84.5 = 35.502...% → 35.5%
    expect(shareOfTotal({ Food: 54.5, Transport: 30 })).toEqual({ Food: 64.5, Transport: 35.5 })
  })

  it('returns 100.0 for a single category', () => {
    expect(shareOfTotal({ Housing: 1200 })).toEqual({ Housing: 100 })
  })

  it('returns 0 for all categories when sum is zero', () => {
    expect(shareOfTotal({ Food: 0, Transport: 0 })).toEqual({ Food: 0, Transport: 0 })
  })

  it('returns empty object for empty input', () => {
    expect(shareOfTotal({})).toEqual({})
  })

  it('does not mutate the input', () => {
    const input = { Food: 50, Transport: 50 }
    shareOfTotal(input)
    expect(input).toEqual({ Food: 50, Transport: 50 })
  })
})
