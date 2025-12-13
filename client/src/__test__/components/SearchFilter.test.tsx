import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchFilter from "@/components/SearchFilter";

describe('SearchFilter Component', () => {
  const mockOnSearch = jest.fn()
  const mockOnReset = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render search title', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      expect(screen.getByText('Search & Filter')).toBeInTheDocument()
    })

    it('should render name input', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      expect(screen.getByLabelText('Sweet Name')).toBeInTheDocument()
    })

    it('should render category dropdown', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      expect(screen.getByLabelText('Category')).toBeInTheDocument()
    })

    it('should render min price input', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      expect(screen.getByLabelText('Min Price')).toBeInTheDocument()
    })

    it('should render max price input', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      expect(screen.getByLabelText('Max Price')).toBeInTheDocument()
    })

    it('should render Search button', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
    })

    it('should render Clear button', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
    })
  })

  describe('Category Options', () => {
    it('should have All Categories option', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      const select = screen.getByLabelText('Category') as HTMLSelectElement
      expect(select).toHaveTextContent('All Categories')
    })

    it('should have Chocolate option', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      const select = screen.getByLabelText('Category')
      expect(select).toHaveTextContent('Chocolate')
    })

    it('should have Gummy option', () => {
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      const select = screen.getByLabelText('Category')
      expect(select).toHaveTextContent('Gummy')
    })
  })

  describe('Form Inputs', () => {
    it('should update name input value', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      const nameInput = screen.getByLabelText('Sweet Name') as HTMLInputElement
      await user.type(nameInput, 'Chocolate')
      
      expect(nameInput.value).toBe('Chocolate')
    })

    it('should update category selection', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement
      await user.selectOptions(categorySelect, 'Chocolate')
      
      expect(categorySelect.value).toBe('Chocolate')
    })

    it('should update min price input', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      const minPriceInput = screen.getByLabelText('Min Price') as HTMLInputElement
      await user.type(minPriceInput, '5')
      
      expect(minPriceInput.value).toBe('5')
    })

    it('should update max price input', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      const maxPriceInput = screen.getByLabelText('Max Price') as HTMLInputElement
      await user.type(maxPriceInput, '10')
      
      expect(maxPriceInput.value).toBe('10')
    })
  })

  describe('Search Functionality', () => {
    it('should call onSearch with form data when submitted', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      await user.type(screen.getByLabelText('Sweet Name'), 'Chocolate')
      await user.click(screen.getByRole('button', { name: /search/i }))
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalled()
      })
    })

    it('should submit with all filled fields', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      await user.type(screen.getByLabelText('Sweet Name'), 'Chocolate')
      await user.selectOptions(screen.getByLabelText('Category'), 'Chocolate')
      await user.type(screen.getByLabelText('Min Price'), '2')
      await user.type(screen.getByLabelText('Max Price'), '5')
      
      await user.click(screen.getByRole('button', { name: /search/i }))
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Chocolate',
            category: 'Chocolate',
            min_price: 2,
            max_price: 5,
          }),
          expect.anything()
        )
      })
    })

    it('should submit with empty fields', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      await user.click(screen.getByRole('button', { name: /search/i }))
      
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalled()
      })
    })
  })

  describe('Reset Functionality', () => {
    it('should call onReset when Clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      await user.click(screen.getByRole('button', { name: /clear/i }))
      
      expect(mockOnReset).toHaveBeenCalled()
    })

    it('should clear all form fields when reset', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      await user.type(screen.getByLabelText('Sweet Name'), 'Chocolate')
      await user.selectOptions(screen.getByLabelText('Category'), 'Chocolate')
      
      await user.click(screen.getByRole('button', { name: /clear/i }))
      
      await waitFor(() => {
        const nameInput = screen.getByLabelText('Sweet Name') as HTMLInputElement
        const categorySelect = screen.getByLabelText('Category') as HTMLSelectElement
        expect(nameInput.value).toBe('')
        expect(categorySelect.value).toBe('')
      })
    })
  })

  describe('Price Validation', () => {
    it('should accept numeric values for min price', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      const minPriceInput = screen.getByLabelText('Min Price') as HTMLInputElement
      await user.type(minPriceInput, '5.99')
      
      expect(minPriceInput.value).toBe('5.99')
    })

    it('should accept numeric values for max price', async () => {
      const user = userEvent.setup()
      render(<SearchFilter onSearch={mockOnSearch} onReset={mockOnReset} />)
      
      const maxPriceInput = screen.getByLabelText('Max Price') as HTMLInputElement
      await user.type(maxPriceInput, '10.50')
      
      expect(maxPriceInput.value).toBe('10.5')
    })
  })
})
