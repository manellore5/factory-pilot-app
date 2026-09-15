import { describe, expect, it } from 'vitest'
import type { Expense } from '../types'
import {
  addExpense,
  filterByCategory,
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
