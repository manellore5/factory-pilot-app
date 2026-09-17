import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Expense } from '../types'
import { Summary } from './Summary'

describe('Summary', () => {
  it('renders category totals with share percentages', () => {
    const expenses: Expense[] = [
      { id: '1', description: 'Groceries', amount: 64.5, category: 'Food', date: '2026-09-01' },
      { id: '2', description: 'Bus pass', amount: 35.5, category: 'Transport', date: '2026-09-02' },
    ]

    render(<Summary expenses={expenses} currency="USD" />)

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')

    // Header + 2 category rows + footer = 4 rows
    expect(rows).toHaveLength(4)

    // Check Food row (64.5 / 100 = 64.5%)
    const foodRow = rows[1]
    expect(within(foodRow).getByText('Food')).toBeInTheDocument()
    expect(within(foodRow).getByText('$64.50')).toBeInTheDocument()
    expect(within(foodRow).getByText('64.5%')).toBeInTheDocument()

    // Check Transport row (35.5 / 100 = 35.5%)
    const transportRow = rows[2]
    expect(within(transportRow).getByText('Transport')).toBeInTheDocument()
    expect(within(transportRow).getByText('$35.50')).toBeInTheDocument()
    expect(within(transportRow).getByText('35.5%')).toBeInTheDocument()

    // Check footer shows 100.0%
    const footerRow = rows[3]
    expect(within(footerRow).getByText('All categories')).toBeInTheDocument()
    expect(within(footerRow).getByText('$100.00')).toBeInTheDocument()
    expect(within(footerRow).getByText('100.0%')).toBeInTheDocument()
  })

  it('renders empty state when no expenses', () => {
    render(<Summary expenses={[]} currency="USD" />)
    expect(screen.getByText('Nothing to summarise.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
