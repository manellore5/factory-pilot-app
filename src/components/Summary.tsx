import { grandTotal, totalsByCategory } from '../lib/expenses'
import { currencySymbol } from '../lib/money'
import type { Currency, Expense } from '../types'

interface Props {
  expenses: Expense[]
  currency: Currency
}

export function Summary({ expenses, currency }: Props) {
  const totals = totalsByCategory(expenses)
  const symbol = currencySymbol(currency)
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
                <td className="amount">
                  {symbol}
                  {totals[c]}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>All categories</th>
              <th className="amount">
                {symbol}
                {grandTotal(expenses)}
              </th>
            </tr>
          </tfoot>
        </table>
      )}
    </section>
  )
}
