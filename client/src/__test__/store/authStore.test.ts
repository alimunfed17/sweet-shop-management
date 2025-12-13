import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuthStore } from "@/store/authStore";
import { api } from '@/lib/api'

jest.mock('@/lib/api', () => ({
  api: {
    login: jest.fn(),
    register: jest.fn(),
  },
}))

describe('Auth Store', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore())
      
      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('Login', () => {
    it('should login successfully', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.test'
      ;(api.login as jest.Mock).mockResolvedValue({
        access_token: mockToken,
        token_type: 'bearer',
      })

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        })
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.token).toBe(mockToken)
        expect(result.current.user).toBeTruthy()
        expect(result.current.user?.email).toBe('test@example.com')
      })
    })

    it('should store token in localStorage', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.test'
      ;(api.login as jest.Mock).mockResolvedValue({
        access_token: mockToken,
        token_type: 'bearer',
      })

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        })
      })

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken)
      })
    })

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials')
      ;(api.login as jest.Mock).mockRejectedValue(error)

      const { result } = renderHook(() => useAuthStore())

      await expect(
        act(async () => {
          await result.current.login({
            email: 'test@example.com',
            password: 'wrong',
          })
        })
      ).rejects.toThrow('Invalid credentials')

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
    })
  })

  describe('Register', () => {
    it('should register and login successfully', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.test'
      
      ;(api.register as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        is_admin: false,
      })
      
      ;(api.login as jest.Mock).mockResolvedValue({
        access_token: mockToken,
        token_type: 'bearer',
      })

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.register({
          email: 'test@example.com',
          password: 'password123',
          full_name: 'Test User',
        })
      })

      await waitFor(() => {
        expect(api.register).toHaveBeenCalled()
        expect(api.login).toHaveBeenCalled()
        expect(result.current.isAuthenticated).toBe(true)
      })
    })

    it('should handle registration error', async () => {
      const error = new Error('Email already exists')
      ;(api.register as jest.Mock).mockRejectedValue(error)

      const { result } = renderHook(() => useAuthStore())

      await expect(
        act(async () => {
          await result.current.register({
            email: 'test@example.com',
            password: 'password123',
            full_name: 'Test User',
          })
        })
      ).rejects.toThrow('Email already exists')

      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('Logout', () => {
    it('should logout and clear state', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.test'
      ;(api.login as jest.Mock).mockResolvedValue({
        access_token: mockToken,
        token_type: 'bearer',
      })

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        })
      })

      act(() => {
        result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.token).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should clear localStorage on logout', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.logout()
      })

      expect(localStorage.removeItem).toHaveBeenCalledWith('token')
      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('Check Auth', () => {
    it('should restore auth state from localStorage', () => {
      const mockToken = 'test-token'
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        is_admin: false,
      }

      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))

      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.checkAuth()
      })

      expect(result.current.token).toBe(mockToken)
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle missing token in localStorage', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.checkAuth()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle invalid user data in localStorage', () => {
      localStorage.setItem('token', 'test-token')
      localStorage.setItem('user', 'invalid-json')

      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.checkAuth()
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.user).toBeNull()
    })
  })
})