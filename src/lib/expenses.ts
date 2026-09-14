import type { Category, Expense, NewExpense } from '../types'

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
