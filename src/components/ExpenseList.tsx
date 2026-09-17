import { useState } from 'react'
import { filterByCategory, filterByMonth, formatExpenseTotal, getUniqueMonths, grandTotal, sortByDate } from '../lib/expenses'
import { formatCurrency } from '../lib/money'
import { CATEGORIES, type Category, type Currency, type Expense, type NewExpense } from '../types'
import { ExpenseForm } from './ExpenseForm'

interface Props {
  expenses: Expense[]
  currency: Currency
  onAdd: (expense: NewExpense) => void
  onRemove: (id: string) => void
}

export function ExpenseList({ expenses, currency, onAdd, onRemove }: Props) {
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [month, setMonth] = useState<string>('All')
  const months = getUniqueMonths(expenses)
  const visible = sortByDate(filterByMonth(filterByCategory(expenses, category), month))

  return (
    <section>
      <h2>Expenses</h2>
      <ExpenseForm onAdd={onAdd} />
      <div className="toolbar">
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | 'All')}
          >
            <option value="All">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Month
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="All">All</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>
      {expenses.length === 0 ? (
        <p className="empty">No expenses yet.</p>
      ) : visible.length === 0 ? (
        <p className="empty">No expenses match the selected filters.</p>
      ) : (
        <>
          <ul className="expense-list">
            {visible.map((e) => (
              <li key={e.id}>
                <span className="date">{e.date}</span>
                <span className="description">{e.description}</span>
                <span className="category">{e.category}</span>
                <span className="amount">{formatCurrency(e.amount, currency)}</span>
                <button
                  type="button"
                  onClick={() => onRemove(e.id)}
                  aria-label={`Delete ${e.description}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <p className="list-total">
            {formatExpenseTotal(visible.length, grandTotal(visible), currency)}
          </p>
        </>
      )}
    </section>
  )
}
