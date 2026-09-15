import { useState, type FormEvent } from 'react'
import { validateExpenseInput, type ExpenseInputErrors } from '../lib/expenses'
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
  const [errors, setErrors] = useState<ExpenseInputErrors>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = parseAmount(amount)
    const validationErrors = validateExpenseInput(description, parsed)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
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
        {errors.description && <span className="error">{errors.description}</span>}
      </label>
      <label>
        Amount
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.00"
        />
        {errors.amount && <span className="error">{errors.amount}</span>}
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
