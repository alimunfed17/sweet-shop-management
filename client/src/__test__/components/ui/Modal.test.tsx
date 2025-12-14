import { render, screen, fireEvent } from '@testing-library/react'
import Modal from "@/components/ui/Modal";

describe('Modal Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  describe('Visibility', () => {
    it('should not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={mockOnClose}>
          Modal Content
        </Modal>
      )
      expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
    })

    it('should render when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          Modal Content
        </Modal>
      )
      expect(screen.getByText('Modal Content')).toBeInTheDocument()
    })
  })

  describe('Title', () => {
    it('should render title when provided', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          Content
        </Modal>
      )
      expect(screen.getByText('Test Modal')).toBeInTheDocument()
    })

    it('should not render title section when title is not provided', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          Content
        </Modal>
      )
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })

    it('should render close button in header when title is provided', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          Content
        </Modal>
      )
      const closeButtons = screen.getAllByRole('button')
      expect(closeButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Sizes', () => {
    it('should apply medium size by default', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          Content
        </Modal>
      )
      const modal = container.querySelector('.max-w-lg')
      expect(modal).toBeInTheDocument()
    })

    it('should apply small size when specified', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="sm">
          Content
        </Modal>
      )
      const modal = container.querySelector('.max-w-md')
      expect(modal).toBeInTheDocument()
    })

    it('should apply large size when specified', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="lg">
          Content
        </Modal>
      )
      const modal = container.querySelector('.max-w-2xl')
      expect(modal).toBeInTheDocument()
    })

    it('should apply extra large size when specified', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} size="xl">
          Content
        </Modal>
      )
      const modal = container.querySelector('.max-w-4xl')
      expect(modal).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onClose when backdrop is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          Content
        </Modal>
      )
      const backdrop = screen.getByText('Content').parentElement?.parentElement?.previousSibling
      if (backdrop) {
        fireEvent.click(backdrop as Element)
        expect(mockOnClose).toHaveBeenCalledTimes(1)
      }
    })

    it('should call onClose when X button is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          Content
        </Modal>
      )
      const closeButton = screen.getByRole('button')
      fireEvent.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('should not call onClose when modal content is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div data-testid="modal-content">Content</div>
        </Modal>
      )
      const content = screen.getByTestId('modal-content')
      fireEvent.click(content)
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  describe('Content', () => {
    it('should render children content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Test Content</p>
        </Modal>
      )
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render complex nested content', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>
            <h3>Title</h3>
            <p>Paragraph</p>
            <button>Action</button>
          </div>
        </Modal>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Paragraph')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })

  describe('Animations', () => {
    it('should have animation classes when opened', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          Content
        </Modal>
      )
      const modalContainer = container.querySelector('.animate-fade-in')
      expect(modalContainer).toBeInTheDocument()
      
      const modalContent = container.querySelector('.animate-scale-in')
      expect(modalContent).toBeInTheDocument()
    })
  })
})