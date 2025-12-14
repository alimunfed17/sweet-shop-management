import { cn, formatPrice, getErrorMessage } from "@/lib/utils";

describe('Utility Functions', () => {
  describe('cn - className utility', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', false && 'hidden', true && 'visible')
      expect(result).toContain('base')
      expect(result).toContain('visible')
      expect(result).not.toContain('hidden')
    })

    it('should merge Tailwind classes correctly', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toContain('px-4')
    })

    it('should handle empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle undefined and null', () => {
      const result = cn('class1', undefined, null, 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })
  })

  describe('formatPrice', () => {
    it('should format price as USD currency', () => {
      const result = formatPrice(9.99)
      expect(result).toBe('$9.99')
    })

    it('should format whole numbers correctly', () => {
      const result = formatPrice(10)
      expect(result).toBe('$10.00')
    })

    it('should format large numbers', () => {
      const result = formatPrice(1234.56)
      expect(result).toBe('$1,234.56')
    })

    it('should format very large numbers with commas', () => {
      const result = formatPrice(1234567.89)
      expect(result).toBe('$1,234,567.89')
    })

    it('should format zero correctly', () => {
      const result = formatPrice(0)
      expect(result).toBe('$0.00')
    })

    it('should format decimal places correctly', () => {
      const result = formatPrice(5.5)
      expect(result).toBe('$5.50')
    })

    it('should round to 2 decimal places', () => {
      const result = formatPrice(9.999)
      expect(result).toBe('$10.00')
    })

    it('should handle negative numbers', () => {
      const result = formatPrice(-5.99)
      expect(result).toBe('-$5.99')
    })
  })

  describe('getErrorMessage', () => {
    it('should extract error message from response detail string', () => {
      const error = {
        response: {
          data: {
            detail: 'Invalid credentials',
          },
        },
      }
      const result = getErrorMessage(error)
      expect(result).toBe('Invalid credentials')
    })

    it('should handle error with detail as object', () => {
      const error = {
        response: {
          data: {
            detail: { message: 'Complex error' },
          },
        },
      }
      const result = getErrorMessage(error)
      expect(result).toBe('An error occurred')
    })

    it('should use error message when no response', () => {
      const error = {
        message: 'Network error',
      }
      const result = getErrorMessage(error)
      expect(result).toBe('Network error')
    })

    it('should return default message when no detail or message', () => {
      const error = {
        response: {
          data: {},
        },
      }
      const result = getErrorMessage(error)
      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle string errors', () => {
      const error = 'Something went wrong'
      const result = getErrorMessage(error)
      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle null or undefined', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred')
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred')
    })

    it('should handle errors without response property', () => {
      const error = new Error('Test error')
      const result = getErrorMessage(error)
      expect(result).toBe('Test error')
    })
  })
})