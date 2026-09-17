import { grandTotal, shareOfTotal, totalsByCategory } from '../lib/expenses'
import { formatCurrency } from '../lib/money'
import type { Currency, Expense } from '../types'

interface Props {
  expenses: Expense[]
  currency: Currency
}

export function Summary({ expenses, currency }: Props) {
  const totals = totalsByCategory(expenses)
  const shares = shareOfTotal(totals)
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
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c}>
                <td>{c}</td>
                <td className="amount">{formatCurrency(totals[c], currency)}</td>
                <td className="amount">{shares[c].toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>All categories</th>
              <th className="amount">{formatCurrency(grandTotal(expenses), currency)}</th>
              <th className="amount">100.0%</th>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  )
}
