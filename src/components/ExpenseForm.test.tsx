import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ExpenseForm } from './ExpenseForm'

describe('ExpenseForm', () => {
  it('submits a parsed expense and clears the text fields', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Description'), 'Coffee')
    await user.type(screen.getByLabelText('Amount'), '3.50')
    await user.selectOptions(screen.getByLabelText('Category'), 'Food')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd.mock.calls[0][0]).toMatchObject({
      description: 'Coffee',
      amount: 3.5,
      category: 'Food',
    })
    expect(screen.getByLabelText('Description')).toHaveValue('')
    expect(screen.getByLabelText('Amount')).toHaveValue('')
  })

  it('ignores non-numeric amounts', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Description'), 'Coffee')
    await user.type(screen.getByLabelText('Amount'), 'abc')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
  })
})
