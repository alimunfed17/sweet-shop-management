export interface User {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface CreateSweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateSweetData {
  name?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export interface PurchaseData {
  quantity: number;
}

export interface SearchFilters {
  name?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
}