import axios, { AxiosInstance } from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  Sweet,
  CreateSweetData,
  UpdateSweetData,
  PurchaseData,
  User,
  SearchFilters,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async register(data: RegisterData): Promise<User> {
    const response = await this.client.post<User>('/api/v1/auth/register', data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/api/v1/auth/login', credentials);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/api/v1/auth/me');
    return response.data;
  }


  async getSweets(): Promise<Sweet[]> {
    const response = await this.client.get<Sweet[]>('/api/v1/sweets');
    return response.data;
  }

  async searchSweets(filters: SearchFilters): Promise<Sweet[]> {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.category) params.append('category', filters.category);
    if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
    if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());

    const response = await this.client.get<Sweet[]>(`/api/v1/sweets/search?${params.toString()}`);
    return response.data;
  }

  async createSweet(data: CreateSweetData): Promise<Sweet> {
    const response = await this.client.post<Sweet>('/api/v1/sweets', data);
    return response.data;
  }

  async updateSweet(id: number, data: UpdateSweetData): Promise<Sweet> {
    const response = await this.client.put<Sweet>(`/api/v1/sweets/${id}`, data);
    return response.data;
  }

  async deleteSweet(id: number): Promise<void> {
    await this.client.delete(`/api/v1/sweets/${id}`);
  }

  async purchaseSweet(id: number, data: PurchaseData): Promise<Sweet> {
    const response = await this.client.post<Sweet>(`/api/v1/sweets/${id}/purchase`, data);
    return response.data;
  }

  async restockSweet(id: number, data: PurchaseData): Promise<Sweet> {
    const response = await this.client.post<Sweet>(`/api/v1/sweets/${id}/restock`, data);
    return response.data;
  }
}

export const api = new ApiClient();