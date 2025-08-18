import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import { ApiResponse, AuthResponse, User } from '@/types/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  role?: 'customer' | 'admin';
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export class AuthRepository {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Backend returns { user, ... } directly, not wrapped in ApiResponse
    return await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      credentials
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Backend returns { token, user } directly, not wrapped in ApiResponse  
    return await apiClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );
  }

  async forgotPassword(data: ForgotPasswordData): Promise<void> {
    await apiClient.post<{ message: string }>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    await apiClient.post<{ message: string }>(
      ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
  }
}

export const authRepository = new AuthRepository();