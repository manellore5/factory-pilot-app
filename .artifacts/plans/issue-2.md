# Plan: Fix removeExpense to delete by id instead of amount

**Issue**: #2 — Deleting an expense removes the wrong row when another expense has the same amount

## Goal

Fix `removeExpense` in `src/lib/expenses.ts` so it removes the expense matching the given `id`, regardless of whether other expenses share the same `amount`. Add a regression test covering the duplicate-amount scenario. All existing tests, lint, type-check, and build must pass.

## Scope

**In scope:**
- Fix `removeExpense` function in `src/lib/expenses.ts`
- Add test case for duplicate amounts in `src/lib/expenses.test.ts`

**Out of scope:**
- Other functions in `expenses.ts` (no changes needed)
- UI components (already pass correct `id`)
- Any architectural changes

## Phases

### Phase 1: Fix the removeExpense function

**File**: `src/lib/expenses.ts`

**Current code (lines 12-17):**
```typescript
export function removeExpense(expenses: Expense[], id: string): Expense[] {
  const target = expenses.find((e) => e.id === id)
  if (!target) return expenses
  const index = expenses.findIndex((e) => e.amount === target.amount)  // BUG
  return expenses.filter((_, i) => i !== index)
}
```

**Fixed code:**
```typescript
export function removeExpense(expenses: Expense[], id: string): Expense[] {
  const before = expenses.length
  const result = expenses.filter((e) => e.id !== id)
  return result.length < before ? result : expenses
}
```

This:
- Uses direct `filter` by `id` (matches codebase pattern in `filterByCategory`)
- Returns original array reference when id not found (preserves existing behavior tested on line 40)
- Removes unnecessary indirection

**Verification:**
```bash
npm test -- src/lib/expenses.test.ts --reporter=verbose
```

### Phase 2: Add regression test for duplicate amounts

**File**: `src/lib/expenses.test.ts`

**Add new test** inside the `describe('removeExpense', ...)` block after the existing tests (after line 41):

```typescript
  it('removes the correct expense when amounts are identical', () => {
    const dupes: Expense[] = [
      { id: 'x', description: 'Coffee', amount: 4.5, category: 'Food', date: '2026-09-01' },
      { id: 'y', description: 'Tea', amount: 4.5, category: 'Food', date: '2026-09-02' },
    ]
    const next = removeExpense(dupes, 'y')
    expect(next.map((e) => e.id)).toEqual(['x'])
    expect(next[0].description).toBe('Coffee')
  })
```

**Verification:**
```bash
npm test -- src/lib/expenses.test.ts --reporter=verbose
```

### Phase 3: Full verification

Run all checks to ensure no regressions:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

All must pass.

## Risks

| Risk | Mitigation |
|------|------------|
| Breaking existing behavior when id not found | Test on line 39-41 covers this; verify it still passes |
| Type errors from change | Run `tsc --noEmit` |
| Other callers depending on buggy behavior | Only consumer is `ExpenseList.tsx` which passes correct id |

## Assumptions

1. The docstring "Removes the expense with the given id" is the intended contract — id-based deletion is correct.
2. Returning the original array reference for unknown id is desired (existing test asserts `toBe(sample)`).
3. The simplified `filter` approach follows codebase conventions (see `filterByCategory`).
4. No other code depends on the buggy amount-matching behavior.

## Open Questions

None — this is a straightforward bug fix with clear fix and test requirements.
