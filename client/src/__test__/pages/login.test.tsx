import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from "@/app/(auth)/login/page"
import { useAuthStore } from '@/store/authStore'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/store/authStore')

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Login Page', () => {
  const mockLogin = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      pathname: '/login',
    })
    
    ;(useAuthStore as unknown as jest.Mock).mockReturnValue({
      login: mockLogin,
    })
  })

  describe('Rendering', () => {
    it('should render login form', () => {
      render(<LoginPage />)
      expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('should render logo and title', () => {
      render(<LoginPage />)
      expect(screen.getByText('Sweet Shop')).toBeInTheDocument()
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    })

    it('should render link to registration', () => {
      render(<LoginPage />)
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
      expect(screen.getByText(/sign up/i)).toBeInTheDocument()
    })

    it('should render demo credentials', () => {
      render(<LoginPage />)
      expect(screen.getByText(/demo credentials/i)).toBeInTheDocument()
      expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('should show error for empty email', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for invalid email format', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email address')
      await user.type(emailInput, 'invalid-email')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
      }, { timeout: 2000 })
    })

    it('should show error for empty password', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email address')
      await user.type(emailInput, 'test@example.com')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    it('should show error for password less than 6 characters', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, '12345')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
      })
    })
  })

  describe('Login Functionality', () => {
    it('should call login with correct credentials', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue({ success: true })

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        })
      }, { timeout: 2000 })
    })

    it('should redirect to home page after successful login', async () => {
      const user = userEvent.setup()
      mockLogin.mockResolvedValue({ success: true })

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      }, { timeout: 2000 })
    })

    it('should show loading state during login', async () => {
      const user = userEvent.setup()
      let resolveLogin: () => void
      const loginPromise = new Promise<void>((resolve) => {
        resolveLogin = resolve
      })
      mockLogin.mockReturnValue(loginPromise)

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })

      resolveLogin!()
    })

    it('should handle login error', async () => {
      const user = userEvent.setup()
      const mockError = new Error('Invalid credentials')
      mockLogin.mockRejectedValue(mockError)

      render(<LoginPage />)

      const emailInput = screen.getByPlaceholderText('Email address')
      const passwordInput = screen.getByPlaceholderText('Password')

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'wrongpassword')

      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled()
      }, { timeout: 2000 })
    })
  })

  describe('Navigation', () => {
    it('should have link to registration page', () => {
      render(<LoginPage />)
      const signUpLink = screen.getByText(/sign up/i)
      expect(signUpLink.closest('a')).toHaveAttribute('href', '/register')
    })
  })
})
