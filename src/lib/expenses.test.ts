import { describe, expect, it } from 'vitest'
import type { Expense } from '../types'
import {
  addExpense,
  filterByCategory,
  filterByMonth,
  formatExpenseTotal,
  getUniqueMonths,
  grandTotal,
  removeExpense,
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
    expect(validateExpenseInput('Coffee', 3.5)).toEqual({})
  })

  it('returns description error for empty description', () => {
    const errors = validateExpenseInput('', 3.5)
    expect(errors.description).toBe('Description is required')
    expect(errors.amount).toBeUndefined()
  })

  it('returns description error for whitespace-only description', () => {
    const errors = validateExpenseInput('   ', 3.5)
    expect(errors.description).toBe('Description is required')
  })

  it('returns amount error for zero amount', () => {
    const errors = validateExpenseInput('Coffee', 0)
    expect(errors.amount).toBe('Amount must be greater than zero')
    expect(errors.description).toBeUndefined()
  })

  it('returns amount error for negative amount', () => {
    const errors = validateExpenseInput('Coffee', -5)
    expect(errors.amount).toBe('Amount must be greater than zero')
  })

  it('returns amount error for NaN amount', () => {
    const errors = validateExpenseInput('Coffee', NaN)
    expect(errors.amount).toBe('Amount must be greater than zero')
  })

  it('returns multiple errors when both fields are invalid', () => {
    const errors = validateExpenseInput('', -5)
    expect(errors.description).toBe('Description is required')
    expect(errors.amount).toBe('Amount must be greater than zero')
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
