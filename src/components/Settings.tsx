import { CURRENCIES, type Currency } from '../types'

interface Props {
  currency: Currency
  onChange: (currency: Currency) => void
}

export function Settings({ currency, onChange }: Props) {
  return (
    <section>
      <h2>Settings</h2>
      <label>
        Currency
        <select value={currency} onChange={(e) => onChange(e.target.value as Currency)}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}
