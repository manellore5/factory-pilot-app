import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Expense } from '../types'
import { ExpenseList } from './ExpenseList'

const expenses: Expense[] = [
  { id: 'a', description: 'Groceries', amount: 42, category: 'Food', date: '2026-09-01' },
  { id: 'b', description: 'Bus pass', amount: 30, category: 'Transport', date: '2026-08-15' },
  { id: 'c', description: 'Lunch', amount: 12.5, category: 'Food', date: '2026-09-15' },
]

function getFilterDropdowns() {
  // The toolbar has the filter dropdowns; ExpenseForm has its own Category dropdown
  // Use getAllByRole to find comboboxes and identify the filter ones by their options
  const selects = screen.getAllByRole('combobox')
  // Filter category dropdown is the one with "All" option that also has "Transport"
  const categoryFilter = selects.find(
    (s) => within(s).queryByRole('option', { name: 'All' }) && within(s).queryByRole('option', { name: 'Transport' })
  )!
  const monthFilter = screen.getByLabelText('Month')
  return { categoryFilter, monthFilter }
}

describe('ExpenseList', () => {
  it('filters expenses by selected month', async () => {
    const user = userEvent.setup()
    render(
      <ExpenseList
        expenses={expenses}
        currency="USD"
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />
    )

    // Initially shows all 3 expenses
    expect(screen.getAllByRole('listitem')).toHaveLength(3)

    const { monthFilter } = getFilterDropdowns()

    // Select September 2026
    await user.selectOptions(monthFilter, '2026-09')

    // Should show only 2 expenses from September
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Lunch')).toBeInTheDocument()
    expect(screen.queryByText('Bus pass')).not.toBeInTheDocument()
  })

  it('combines category and month filters', async () => {
    const user = userEvent.setup()
    render(
      <ExpenseList
        expenses={expenses}
        currency="USD"
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />
    )

    const { categoryFilter, monthFilter } = getFilterDropdowns()

    // Filter by Food category AND September
    await user.selectOptions(categoryFilter, 'Food')
    await user.selectOptions(monthFilter, '2026-09')

    // Should show only Food expenses from September (Groceries, Lunch)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(screen.getByText('Groceries')).toBeInTheDocument()
    expect(screen.getByText('Lunch')).toBeInTheDocument()
  })

  it('shows empty state when no expenses match filters', async () => {
    const user = userEvent.setup()
    render(
      <ExpenseList
        expenses={expenses}
        currency="USD"
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />
    )

    const { categoryFilter, monthFilter } = getFilterDropdowns()

    // Filter by Transport AND September (no matches)
    await user.selectOptions(categoryFilter, 'Transport')
    await user.selectOptions(monthFilter, '2026-09')

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
    expect(screen.getByText('No expenses match the selected filters.')).toBeInTheDocument()
    expect(screen.queryByText('No expenses yet.')).not.toBeInTheDocument()
  })

  it('shows "No expenses yet." when expenses array is empty', () => {
    render(
      <ExpenseList
        expenses={[]}
        currency="USD"
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />
    )

    expect(screen.getByText('No expenses yet.')).toBeInTheDocument()
    expect(screen.queryByText('No expenses match the selected filters.')).not.toBeInTheDocument()
  })

  it('displays total for visible expenses', () => {
    render(
      <ExpenseList
        expenses={expenses}
        currency="USD"
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />
    )

    // Total of all 3 expenses: 42 + 30 + 12.5 = 84.5
    expect(screen.getByText('Total: $84.50 (3 expenses)')).toBeInTheDocument()
  })

  it('updates total when filters are applied', async () => {
    const user = userEvent.setup()
    render(
      <ExpenseList
        expenses={expenses}
        currency="USD"
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />
    )

    const { monthFilter } = getFilterDropdowns()
    await user.selectOptions(monthFilter, '2026-09')

    // September expenses: 42 + 12.5 = 54.5
    expect(screen.getByText('Total: $54.50 (2 expenses)')).toBeInTheDocument()
    expect(screen.queryByText('Total: $84.50 (3 expenses)')).not.toBeInTheDocument()
  })

  it('hides total when showing empty state', () => {
    render(
      <ExpenseList
        expenses={[]}
        currency="USD"
        onAdd={vi.fn()}
        onRemove={vi.fn()}
      />
    )

    expect(screen.queryByText(/^Total:/)).not.toBeInTheDocument()
  })
})
