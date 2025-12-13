import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SweetForm from "@/components/SweetForm";

describe('SweetForm Component', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering - Create Mode', () => {
    it('should render all form fields', () => {
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      expect(screen.getByLabelText(/sweet name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/quantity/i)).toBeInTheDocument()
    })

    it('should render submit button with "Create Sweet" text', () => {
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      expect(screen.getByRole('button', { name: /create sweet/i })).toBeInTheDocument()
    })

    it('should render cancel button', () => {
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('should have empty initial values', () => {
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      expect(screen.getByLabelText(/sweet name/i)).toHaveValue('')
      expect(screen.getByLabelText(/price/i)).toHaveValue(null)
      expect(screen.getByLabelText(/quantity/i)).toHaveValue(null)
    })
  })

  describe('Rendering - Edit Mode', () => {
    const existingSweet = {
      id: 1,
      name: 'Chocolate Bar',
      category: 'Chocolate',
      price: 2.99,
      quantity: 50,
    }

    it('should render submit button with "Update Sweet" text', () => {
      render(<SweetForm sweet={existingSweet} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      expect(screen.getByRole('button', { name: /update sweet/i })).toBeInTheDocument()
    })

    it('should pre-fill form with sweet data', () => {
      render(<SweetForm sweet={existingSweet} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      expect(screen.getByLabelText(/sweet name/i)).toHaveValue('Chocolate Bar')
      expect(screen.getByLabelText(/category/i)).toHaveValue('Chocolate')
      expect(screen.getByLabelText(/price/i)).toHaveValue(2.99)
      expect(screen.getByLabelText(/quantity/i)).toHaveValue(50)
    })
  })

  describe('Category Dropdown', () => {
    it('should have "Select a category" as default option', () => {
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      const select = screen.getByLabelText(/category/i)
      expect(select).toHaveTextContent('Select a category')
    })

    it('should have all category options', () => {
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      const select = screen.getByLabelText(/category/i)
      
      expect(select).toHaveTextContent('Chocolate')
      expect(select).toHaveTextContent('Gummy')
      expect(select).toHaveTextContent('Candy')
      expect(select).toHaveTextContent('Lollipop')
      expect(select).toHaveTextContent('Cookies')
      expect(select).toHaveTextContent('Cake')
      expect(select).toHaveTextContent('Other')
    })
  })

  describe('Form Validation', () => {
    it('should show error for empty name', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      await user.click(screen.getByRole('button', { name: /create sweet/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for empty category', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      await user.type(screen.getByLabelText(/sweet name/i), 'Test Sweet')
      await user.click(screen.getByRole('button', { name: /create sweet/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/category is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for empty price', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      await user.type(screen.getByLabelText(/sweet name/i), 'Test Sweet')
      await user.selectOptions(screen.getByLabelText(/category/i), 'Chocolate')
      await user.click(screen.getByRole('button', { name: /create sweet/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/price is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for price less than or equal to 0', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      await user.type(screen.getByLabelText(/sweet name/i), 'Test Sweet')
      await user.selectOptions(screen.getByLabelText(/category/i), 'Chocolate')
      await user.type(screen.getByLabelText(/price/i), '0')
      await user.click(screen.getByRole('button', { name: /create sweet/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/price must be greater than 0/i)).toBeInTheDocument()
      })
    })

    it('should show error for negative quantity', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      await user.type(screen.getByLabelText(/sweet name/i), 'Test Sweet')
      await user.selectOptions(screen.getByLabelText(/category/i), 'Chocolate')
      await user.type(screen.getByLabelText(/price/i), '2.99')
      await user.clear(screen.getByLabelText(/quantity/i))
      await user.type(screen.getByLabelText(/quantity/i), '-5')
      await user.click(screen.getByRole('button', { name: /create sweet/i }))
      
      await waitFor(() => {
        expect(screen.getByText(/quantity cannot be negative/i)).toBeInTheDocument()
      })
    })
  })

  describe('Form Submission', () => {
    it('should call onSubmit with form data', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockResolvedValue(undefined)
      
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      await user.type(screen.getByLabelText(/sweet name/i), 'New Sweet')
      await user.selectOptions(screen.getByLabelText(/category/i), 'Chocolate')
      await user.type(screen.getByLabelText(/price/i), '3.99')
      await user.type(screen.getByLabelText(/quantity/i), '100')
      
      await user.click(screen.getByRole('button', { name: /create sweet/i }))
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Sweet',
            category: 'Chocolate',
            price: 3.99,
            quantity: 100,
          }),
          expect.anything()
        )
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
      
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      await user.type(screen.getByLabelText(/sweet name/i), 'Test Sweet')
      await user.selectOptions(screen.getByLabelText(/category/i), 'Candy')
      await user.type(screen.getByLabelText(/price/i), '1.99')
      await user.type(screen.getByLabelText(/quantity/i), '50')
      
      const submitPromise = user.click(screen.getByRole('button', { name: /create sweet/i }))
      
      // Check immediately after click
      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /create sweet/i })
        expect(submitButton).toBeDisabled()
      })

      await submitPromise
    })

    it('should not submit if form is invalid', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      // Try to submit empty form
      await user.click(screen.getByRole('button', { name: /create sweet/i }))
      
      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled()
      })
    })
  })

  describe('Cancel Button', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should not submit form when cancel is clicked', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      await user.type(screen.getByLabelText(/sweet name/i), 'Test')
      await user.click(screen.getByRole('button', { name: /cancel/i }))
      
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Input Fields', () => {
    it('should update name input value', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      const nameInput = screen.getByLabelText(/sweet name/i) as HTMLInputElement
      await user.type(nameInput, 'Gummy Bears')
      
      expect(nameInput.value).toBe('Gummy Bears')
    })

    it('should update category selection', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement
      await user.selectOptions(categorySelect, 'Gummy')
      
      expect(categorySelect.value).toBe('Gummy')
    })

    it('should accept decimal values for price', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      const priceInput = screen.getByLabelText(/price/i) as HTMLInputElement
      await user.type(priceInput, '9.99')
      
      expect(priceInput.value).toBe('9.99')
    })

    it('should accept integer values for quantity', async () => {
      const user = userEvent.setup()
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      
      const quantityInput = screen.getByLabelText(/quantity/i) as HTMLInputElement
      await user.type(quantityInput, '75')
      
      expect(quantityInput.value).toBe('75')
    })
  })

  describe('Placeholders', () => {
    it('should have placeholder for name input', () => {
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      expect(screen.getByPlaceholderText(/e.g., Dark Chocolate Bar/i)).toBeInTheDocument()
    })

    it('should have placeholder for price input', () => {
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      expect(screen.getByPlaceholderText('9.99')).toBeInTheDocument()
    })

    it('should have placeholder for quantity input', () => {
      render(<SweetForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
      expect(screen.getByPlaceholderText('100')).toBeInTheDocument()
    })
  })
})
