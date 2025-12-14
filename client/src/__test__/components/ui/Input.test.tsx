import { render, screen, fireEvent } from '@testing-library/react'
import Input from "@/components/ui/Input"

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with label when provided', () => {
      render(<Input label="Email" />)
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter email" />)
      expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
    })

    it('should render error message when provided', () => {
      render(<Input error="This field is required" />)
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })
  })

  describe('Input Types', () => {
    it('should default to text type', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
    })

    it('should render as password input when type is password', () => {
      render(<Input type="password" />)
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should render as email input when type is email', () => {
      render(<Input type="email" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    })

    it('should render as number input when type is number', () => {
      render(<Input type="number" />)
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  describe('Styling', () => {
    it('should apply error border when error is present', () => {
      render(<Input error="Error message" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-red-500')
    })

    it('should apply normal border when no error', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('border-gray-300')
    })

    it('should apply custom className', () => {
      render(<Input className="custom-input" />)
      expect(screen.getByRole('textbox')).toHaveClass('custom-input')
    })
  })

  describe('Interactions', () => {
    it('should update value on change', () => {
      render(<Input />)
      const input = screen.getByRole('textbox') as HTMLInputElement
      
      fireEvent.change(input, { target: { value: 'test value' } })
      expect(input.value).toBe('test value')
    })

    it('should call onChange handler', () => {
      const handleChange = jest.fn()
      render(<Input onChange={handleChange} />)
      
      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test' } })
      
      expect(handleChange).toHaveBeenCalled()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })
  })

  describe('Validation', () => {
    it('should accept required attribute', () => {
      render(<Input required />)
      expect(screen.getByRole('textbox')).toBeRequired()
    })

    it('should accept min and max length', () => {
      render(<Input minLength={5} maxLength={10} />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('minLength', '5')
      expect(input).toHaveAttribute('maxLength', '10')
    })
  })

  describe('Error Display', () => {
    it('should show error text in red', () => {
      render(<Input error="Invalid input" />)
      const errorText = screen.getByText('Invalid input')
      expect(errorText).toHaveClass('text-red-600')
    })

    it('should not show error text when error prop is not provided', () => {
      render(<Input />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})