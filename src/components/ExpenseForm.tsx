import { useState, type FormEvent } from 'react'
import { parseAmount } from '../lib/money'
import { CATEGORIES, type Category, type NewExpense } from '../types'

interface Props {
  onAdd: (expense: NewExpense) => void
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function ExpenseForm({ onAdd }: Props) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Food')
  const [date, setDate] = useState(today)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = parseAmount(amount)
    if (Number.isNaN(parsed)) return
    onAdd({ description: description.trim(), amount: parsed, category, date })
    setDescription('')
    setAmount('')
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit} aria-label="Add expense">
      <label>
        Description
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Coffee"
        />
      </label>
      <label>
        Amount
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.00"
        />
      </label>
      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <button type="submit">Add</button>
    </form>
  )
}
