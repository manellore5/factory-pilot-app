import { useState } from 'react'
import { ExpenseList } from './components/ExpenseList'
import { Settings } from './components/Settings'
import { Summary } from './components/Summary'
import { addExpense, removeExpense } from './lib/expenses'
import type { Currency, Expense, NewExpense } from './types'

type View = 'expenses' | 'summary' | 'settings'

const SEED: Expense[] = [
  { id: 'seed-1', description: 'Groceries', amount: 54.2, category: 'Food', date: '2026-09-02' },
  { id: 'seed-2', description: 'Monthly transit pass', amount: 75, category: 'Transport', date: '2026-09-01' },
  { id: 'seed-3', description: 'Cinema', amount: 14.5, category: 'Fun', date: '2026-09-06' },
  { id: 'seed-4', description: 'Rent', amount: 1200, category: 'Housing', date: '2026-08-31' },
]

const VIEWS: { id: View; label: string }[] = [
  { id: 'expenses', label: 'Expenses' },
  { id: 'summary', label: 'Summary' },
  { id: 'settings', label: 'Settings' },
]

export default function App() {
  const [view, setView] = useState<View>('expenses')
  const [expenses, setExpenses] = useState<Expense[]>(SEED)
  const [currency, setCurrency] = useState<Currency>('USD')

  function handleAdd(input: NewExpense) {
    setExpenses((current) => addExpense(current, input))
  }

  function handleRemove(id: string) {
    setExpenses((current) => removeExpense(current, id))
  }

  return (
    <main className="app">
      <h1>Expense tracker</h1>
      <nav className="tabs" aria-label="Views">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={view === v.id ? 'active' : ''}
            aria-current={view === v.id ? 'page' : undefined}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </nav>
      {view === 'expenses' && (
        <ExpenseList
          expenses={expenses}
          currency={currency}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      )}
      {view === 'summary' && <Summary expenses={expenses} currency={currency} />}
      {view === 'settings' && <Settings currency={currency} onChange={setCurrency} />}
    </main>
  )
}
