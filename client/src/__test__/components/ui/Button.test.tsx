import { render, screen, fireEvent } from '@testing-library/react'
import Button from "@/components/ui/Button";

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with children text', () => {
      render(<Button>Click Me</Button>)
      expect(screen.getByText('Click Me')).toBeInTheDocument()
    })

    it('should apply primary variant by default', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-600')
    })

    it('should apply secondary variant when specified', () => {
      render(<Button variant="secondary">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-secondary-600')
    })

    it('should apply danger variant when specified', () => {
      render(<Button variant="danger">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600')
    })

    it('should apply ghost variant when specified', () => {
      render(<Button variant="ghost">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-transparent')
    })
  })

  describe('Sizes', () => {
    it('should apply medium size by default', () => {
      render(<Button>Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2')
    })

    it('should apply small size when specified', () => {
      render(<Button size="sm">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-3', 'py-1.5')
    })

    it('should apply large size when specified', () => {
      render(<Button size="lg">Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-6', 'py-3')
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Button</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should show loading spinner when isLoading is true', () => {
      render(<Button isLoading>Button</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
      // Check for Loader2 icon (it has a specific class)
      const button = screen.getByRole('button')
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('should be disabled when isLoading is true', () => {
      render(<Button isLoading>Button</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('Interactions', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Button</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick} disabled>Button</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when loading', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick} isLoading>Button</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Custom Props', () => {
    it('should accept and apply custom className', () => {
      render(<Button className="custom-class">Button</Button>)
      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('should accept type prop', () => {
      render(<Button type="submit">Button</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
  })
})