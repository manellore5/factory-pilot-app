import type { Category, Currency, Expense, NewExpense } from '../types'
import { formatCurrency } from './money'

export interface ExpenseInputErrors {
  description?: string
  amount?: string
  date?: string
}

export function validateExpenseInput(
  description: string,
  amount: number,
  date: string
): ExpenseInputErrors {
  const errors: ExpenseInputErrors = {}
  if (description.trim() === '') {
    errors.description = 'Description is required'
  }
  if (Number.isNaN(amount)) {
    errors.amount = 'Amount must be a number'
  } else if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = 'Amount must be greater than zero'
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Date is required'
  }
  return errors
}

export function createId(): string {
  return crypto.randomUUID()
}

export function addExpense(expenses: Expense[], input: NewExpense): Expense[] {
  return [...expenses, { id: createId(), ...input }]
}

/** Removes the expense with the given id. */
export function removeExpense(expenses: Expense[], id: string): Expense[] {
  const before = expenses.length
  const result = expenses.filter((e) => e.id !== id)
  return result.length < before ? result : expenses
}

export function filterByCategory(expenses: Expense[], category: Category | 'All'): Expense[] {
  if (category === 'All') return expenses
  return expenses.filter((e) => e.category === category)
}

export function filterByMonth(expenses: Expense[], month: string): Expense[] {
  if (month === 'All') return expenses
  return expenses.filter((e) => e.date.slice(0, 7) === month)
}

export function getUniqueMonths(expenses: Expense[]): string[] {
  const months = new Set(expenses.map((e) => e.date.slice(0, 7)))
  return [...months].sort((a, b) => b.localeCompare(a))
}

export function resolveEffectiveMonth(month: string, availableMonths: string[]): string {
  if (month === 'All' || availableMonths.includes(month)) {
    return month
  }
  return 'All'
}

/** Newest first; ties keep insertion order. */
export function sortByDate(expenses: Expense[]): Expense[] {
  return [...expenses].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}

export function totalsByCategory(expenses: Expense[]): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const e of expenses) {
    totals[e.category] = (totals[e.category] ?? 0) + e.amount
  }
  return totals
}

export function grandTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}

export function formatExpenseTotal(count: number, total: number, currency: Currency): string {
  const noun = count === 1 ? 'expense' : 'expenses'
  return `Total: ${formatCurrency(total, currency)} (${count} ${noun})`
}

/**
 * Returns each category's share of the total as a percentage rounded to one decimal.
 * When the sum is zero, every share is 0. Does not mutate the input.
 */
export function shareOfTotal(totals: Record<string, number>): Record<string, number> {
  const sum = Object.values(totals).reduce((acc, v) => acc + v, 0)
  const shares: Record<string, number> = {}
  for (const key of Object.keys(totals)) {
    shares[key] = sum === 0 ? 0 : Math.round((totals[key] / sum) * 1000) / 10
  }
  return shares
}
