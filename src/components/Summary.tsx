import { grandTotal, totalsByCategory } from '../lib/expenses'
import { formatCurrency } from '../lib/money'
import type { Currency, Expense } from '../types'

interface Props {
  expenses: Expense[]
  currency: Currency
}

export function Summary({ expenses, currency }: Props) {
  const totals = totalsByCategory(expenses)
  const categories = Object.keys(totals).sort()

  return (
    <section>
      <h2>Summary</h2>
      {categories.length === 0 ? (
        <p className="empty">Nothing to summarise.</p>
      ) : (
        <table className="summary">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c}>
                <td>{c}</td>
                <td className="amount">{formatCurrency(totals[c], currency)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>All categories</th>
              <th className="amount">{formatCurrency(grandTotal(expenses), currency)}</th>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  )
}
