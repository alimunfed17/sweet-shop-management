import { render, screen, fireEvent } from '@testing-library/react'
import SweetCard from "@/components/SweetCard";
import { useAuthStore } from '@/store/authStore'

jest.mock('@/store/authStore')

const mockSweet = {
  id: 1,
  name: 'Chocolate Bar',
  category: 'Chocolate',
  price: 2.99,
  quantity: 50,
}

describe('SweetCard Component', () => {
  const mockOnPurchase = jest.fn()
  const mockOnEdit = jest.fn()
  const mockOnDelete = jest.fn()
  const mockOnRestock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      user: { is_admin: false },
    })
  })

  describe('Rendering - Regular User', () => {
    it('should render sweet name', () => {
      render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('Chocolate Bar')).toBeInTheDocument()
    })

    it('should render sweet price', () => {
      render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('$2.99')).toBeInTheDocument()
    })

    it('should render sweet category', () => {
      render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('Chocolate')).toBeInTheDocument()
    })

    it('should render quantity information', () => {
      render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('50 in stock')).toBeInTheDocument()
    })

    it('should render purchase button for regular user', () => {
      render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('Purchase')).toBeInTheDocument()
    })
  })

  describe('Stock Badges', () => {
    it('should show "In Stock" badge when quantity >= 10', () => {
      render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('In Stock')).toBeInTheDocument()
    })

    it('should show "Low Stock" badge when quantity < 10', () => {
      const lowStockSweet = { ...mockSweet, quantity: 5 }
      render(<SweetCard sweet={lowStockSweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('Low Stock')).toBeInTheDocument()
    })

    it('should show "Out of Stock" badge when quantity is 0', () => {
      const outOfStockSweet = { ...mockSweet, quantity: 0 }
      render(<SweetCard sweet={outOfStockSweet} onPurchase={mockOnPurchase} />)
      const outOfStockElements = screen.getAllByText('Out of Stock')
      expect(outOfStockElements[0]).toBeInTheDocument()
      expect(outOfStockElements[0].tagName).toBe('SPAN')
    })
  })

  describe('Purchase Button', () => {
    it('should be enabled when quantity > 0', () => {
      render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)
      const button = screen.getByText('Purchase').closest('button')
      expect(button).not.toBeDisabled()
    })

    it('should be disabled when quantity is 0', () => {
      const outOfStockSweet = { ...mockSweet, quantity: 0 }
      render(<SweetCard sweet={outOfStockSweet} onPurchase={mockOnPurchase} />)
      const button = screen.getByRole('button', { name: /out of stock/i })
      expect(button).toBeDisabled()
    })

    it('should call onPurchase when clicked', () => {
      render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)
      const button = screen.getByText('Purchase')
      fireEvent.click(button)
      expect(mockOnPurchase).toHaveBeenCalledWith(mockSweet)
    })
  })

  describe('Admin View', () => {
    beforeEach(() => {
      ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { is_admin: true },
      })
    })

    it('should show Edit button for admin', () => {
      render(
        <SweetCard
          sweet={mockSweet}
          onPurchase={mockOnPurchase}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRestock={mockOnRestock}
        />
      )
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })

    it('should show Restock button for admin', () => {
      render(
        <SweetCard
          sweet={mockSweet}
          onPurchase={mockOnPurchase}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRestock={mockOnRestock}
        />
      )
      expect(screen.getByText('Restock')).toBeInTheDocument()
    })

    it('should show Delete button for admin', () => {
      render(
        <SweetCard
          sweet={mockSweet}
          onPurchase={mockOnPurchase}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRestock={mockOnRestock}
        />
      )
      const deleteButton = screen.getAllByRole('button').find(btn => 
        btn.className.includes('bg-red-600')
      )
      expect(deleteButton).toBeInTheDocument()
    })

    it('should not show Purchase button for admin', () => {
      render(
        <SweetCard
          sweet={mockSweet}
          onPurchase={mockOnPurchase}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRestock={mockOnRestock}
        />
      )
      expect(screen.queryByText('Purchase')).not.toBeInTheDocument()
    })

    it('should call onEdit when Edit button is clicked', () => {
      render(
        <SweetCard
          sweet={mockSweet}
          onPurchase={mockOnPurchase}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRestock={mockOnRestock}
        />
      )
      fireEvent.click(screen.getByText('Edit'))
      expect(mockOnEdit).toHaveBeenCalledWith(mockSweet)
    })

    it('should call onRestock when Restock button is clicked', () => {
      render(
        <SweetCard
          sweet={mockSweet}
          onPurchase={mockOnPurchase}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onRestock={mockOnRestock}
        />
      )
      fireEvent.click(screen.getByText('Restock'))
      expect(mockOnRestock).toHaveBeenCalledWith(mockSweet)
    })
  })

  describe('Category Display', () => {
    it('should show correct emoji for Chocolate category', () => {
      render(<SweetCard sweet={mockSweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('🍫')).toBeInTheDocument()
    })

    it('should show correct emoji for Gummy category', () => {
      const gummySweet = { ...mockSweet, category: 'Gummy' }
      render(<SweetCard sweet={gummySweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('🐻')).toBeInTheDocument()
    })

    it('should show correct emoji for Candy category', () => {
      const candySweet = { ...mockSweet, category: 'Candy' }
      render(<SweetCard sweet={candySweet} onPurchase={mockOnPurchase} />)
      expect(screen.getByText('🍬')).toBeInTheDocument()
    })
  })
})
