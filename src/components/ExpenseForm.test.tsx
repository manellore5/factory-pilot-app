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

  it('shows "Amount must be a number" for input with thousands separator', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Description'), 'Coffee')
    await user.type(screen.getByLabelText('Amount'), '1,000')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByText('Amount must be a number')).toBeInTheDocument()
  })

  it('rejects empty description and shows error', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Amount'), '5.00')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByText('Description is required')).toBeInTheDocument()
  })

  it('rejects zero amount and shows error', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Description'), 'Coffee')
    await user.type(screen.getByLabelText('Amount'), '0')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByText('Amount must be greater than zero')).toBeInTheDocument()
  })

  it('rejects negative amount and shows error', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Description'), 'Coffee')
    await user.type(screen.getByLabelText('Amount'), '-5')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByText('Amount must be greater than zero')).toBeInTheDocument()
  })

  it('rejects empty date and shows error', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Description'), 'Coffee')
    await user.type(screen.getByLabelText('Amount'), '3.50')
    await user.clear(screen.getByLabelText('Date'))
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByText('Date is required')).toBeInTheDocument()
  })

  it('rejects "Infinity" string input and shows error', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<ExpenseForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText('Description'), 'Coffee')
    await user.type(screen.getByLabelText('Amount'), 'Infinity')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByText('Amount must be greater than zero')).toBeInTheDocument()
  })
})
