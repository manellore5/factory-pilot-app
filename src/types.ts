export const CATEGORIES = ['Food', 'Transport', 'Housing', 'Fun', 'Other'] as const
export type Category = (typeof CATEGORIES)[number]

export const CURRENCIES = ['USD', 'EUR', 'GBP'] as const
export type Currency = (typeof CURRENCIES)[number]

export interface Expense {
  id: string
  description: string
  amount: number
  category: Category
  /** ISO date, YYYY-MM-DD */
  date: string
}

export type NewExpense = Omit<Expense, 'id'>
