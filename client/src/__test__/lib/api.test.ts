jest.mock('axios', () => {
  const mockGet = jest.fn()
  const mockPost = jest.fn()
  const mockPut = jest.fn()
  const mockDelete = jest.fn()

  const mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
  }

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
  }
})

import axios from 'axios'
import { api } from '@/lib/api'

const mockAxiosInstance = (axios.create as jest.Mock)()

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication Endpoints', () => {
    describe('register', () => {
      it('should call register endpoint with correct data', async () => {
        const mockResponse = {
          id: 1,
          email: 'test@example.com',
          full_name: 'Test User',
          is_admin: false,
        }

        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })

        const registerData = {
          email: 'test@example.com',
          password: 'password123',
          full_name: 'Test User',
        }

        const result = await api.register(registerData)

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/auth/register', registerData)
        expect(result).toEqual(mockResponse)
      })

      it('should handle registration error', async () => {
        const error = new Error('Email already exists')
        mockAxiosInstance.post.mockRejectedValue(error)

        await expect(
          api.register({
            email: 'test@example.com',
            password: 'password123',
            full_name: 'Test User',
          })
        ).rejects.toThrow('Email already exists')
      })
    })

    describe('login', () => {
      it('should call login endpoint with correct credentials', async () => {
        const mockResponse = {
          access_token: 'test-token',
          token_type: 'bearer',
        }

        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })

        const credentials = {
          email: 'test@example.com',
          password: 'password123',
        }

        const result = await api.login(credentials)

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/auth/login', credentials)
        expect(result).toEqual(mockResponse)
      })

      it('should handle login error', async () => {
        const error = new Error('Invalid credentials')
        mockAxiosInstance.post.mockRejectedValue(error)

        await expect(
          api.login({
            email: 'test@example.com',
            password: 'wrong',
          })
        ).rejects.toThrow('Invalid credentials')
      })
    })
  })

  describe('Sweets Endpoints', () => {
    describe('getSweets', () => {
      it('should fetch all sweets', async () => {
        const mockSweets = [
          { id: 1, name: 'Chocolate', category: 'Chocolate', price: 2.99, quantity: 50 },
          { id: 2, name: 'Gummy Bears', category: 'Gummy', price: 1.99, quantity: 30 },
        ]

        mockAxiosInstance.get.mockResolvedValue({ data: mockSweets })

        const result = await api.getSweets()

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/sweets')
        expect(result).toEqual(mockSweets)
      })
    })

    describe('searchSweets', () => {
      it('should search sweets with name filter', async () => {
        const mockSweets = [
          { id: 1, name: 'Chocolate Bar', category: 'Chocolate', price: 2.99, quantity: 50 },
        ]

        mockAxiosInstance.get.mockResolvedValue({ data: mockSweets })

        const result = await api.searchSweets({ name: 'Chocolate' })

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/sweets/search?name=Chocolate')
        expect(result).toEqual(mockSweets)
      })

      it('should search sweets with category filter', async () => {
        mockAxiosInstance.get.mockResolvedValue({ data: [] })

        await api.searchSweets({ category: 'Gummy' })

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/sweets/search?category=Gummy')
      })

      it('should search sweets with price range', async () => {
        mockAxiosInstance.get.mockResolvedValue({ data: [] })

        await api.searchSweets({ min_price: 2, max_price: 5 })

        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/v1/sweets/search?min_price=2&max_price=5')
      })

      it('should search sweets with combined filters', async () => {
        mockAxiosInstance.get.mockResolvedValue({ data: [] })

        await api.searchSweets({
          name: 'Chocolate',
          category: 'Chocolate',
          min_price: 2,
          max_price: 5,
        })

        expect(mockAxiosInstance.get).toHaveBeenCalledWith(
          '/api/v1/sweets/search?name=Chocolate&category=Chocolate&min_price=2&max_price=5'
        )
      })
    })

    describe('createSweet', () => {
      it('should create a new sweet', async () => {
        const sweetData = {
          name: 'New Sweet',
          category: 'Candy',
          price: 3.99,
          quantity: 100,
        }

        const mockResponse = { id: 1, ...sweetData }

        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })

        const result = await api.createSweet(sweetData)

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/sweets', sweetData)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('updateSweet', () => {
      it('should update a sweet', async () => {
        const updateData = {
          name: 'Updated Sweet',
          price: 4.99,
        }

        const mockResponse = {
          id: 1,
          name: 'Updated Sweet',
          category: 'Candy',
          price: 4.99,
          quantity: 100,
        }

        mockAxiosInstance.put.mockResolvedValue({ data: mockResponse })

        const result = await api.updateSweet(1, updateData)

        expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/v1/sweets/1', updateData)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('deleteSweet', () => {
      it('should delete a sweet', async () => {
        mockAxiosInstance.delete.mockResolvedValue({})

        await api.deleteSweet(1)

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/v1/sweets/1')
      })
    })

    describe('purchaseSweet', () => {
      it('should purchase a sweet', async () => {
        const purchaseData = { quantity: 5 }
        const mockResponse = {
          id: 1,
          name: 'Sweet',
          category: 'Candy',
          price: 2.99,
          quantity: 45,
        }

        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })

        const result = await api.purchaseSweet(1, purchaseData)

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/sweets/1/purchase', purchaseData)
        expect(result).toEqual(mockResponse)
      })
    })

    describe('restockSweet', () => {
      it('should restock a sweet', async () => {
        const restockData = { quantity: 50 }
        const mockResponse = {
          id: 1,
          name: 'Sweet',
          category: 'Candy',
          price: 2.99,
          quantity: 100,
        }

        mockAxiosInstance.post.mockResolvedValue({ data: mockResponse })

        const result = await api.restockSweet(1, restockData)

        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/v1/sweets/1/restock', restockData)
        expect(result).toEqual(mockResponse)
      })
    })
  })
})
