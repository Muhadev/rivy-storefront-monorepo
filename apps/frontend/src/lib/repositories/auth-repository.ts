/**
 * Authentication Repository
 * Handles all authentication-related API operations
 */

import { BaseRepository } from './base-repository';
import { httpClient } from '../http-client';
import { STORAGE_KEYS } from '../../config/constants';
import type { 
  User, 
  AuthTokens, 
  LoginCredentials, 
  RegisterData, 
  ResetPasswordData 
} from '../../types';

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthRepository extends BaseRepository<User> {
  constructor() {
    super({
      baseEndpoint: '/auth',
      cacheTimeout: 0, // Don't cache auth operations
    });
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('post', '/login', credentials, {
      skipRetry: true
    });

    // Store tokens and user data
    this.storeAuthData(response);
    
    return response;
  }

  /**
   * Register new user
   */
  async register(userData: RegisterData): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('post', '/register', userData, {
      skipRetry: true
    });

    // Store tokens and user data
    this.storeAuthData(response);
    
    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.request<void>('post', '/logout', {}, { skipRetry: true });
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<AuthTokens>('post', '/refresh', {
      refreshToken
    }, { skipRetry: true });

    // Update stored tokens
    localStorage.setItem(STORAGE_KEYS.authToken, response.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, response.refreshToken);

    return response;
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('post', '/forgot-password', {
      email
    }, { skipRetry: true });
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return this.request<{ message: string }>('post', '/reset-password', data, {
      skipRetry: true
    });
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('post', '/verify-email', {
      token
    }, { skipRetry: true });
  }

  /**
   * Resend verification email
   */
  async resendVerification(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('post', '/resend-verification', {
      email
    }, { skipRetry: true });
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>('post', '/change-password', data, {
      skipRetry: true
    });
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return this.request<User>('get', '/me');
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.request<User>('put', '/me', data, {
      skipRetry: true
    });

    // Update stored user data
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(response));
    
    return response;
  }

  /**
   * Delete user account
   */
  async deleteAccount(password: string): Promise<{ message: string }> {
    const response = await this.request<{ message: string }>('delete', '/me', {
      password
    }, { skipRetry: true });

    this.clearAuthData();
    
    return response;
  }

  /**
   * Enable two-factor authentication
   */
  async enableTwoFactor(): Promise<{
    qrCode: string;
    secret: string;
    backupCodes: string[];
  }> {
    return this.request<{
      qrCode: string;
      secret: string;
      backupCodes: string[];
    }>('post', '/2fa/enable', {}, { skipRetry: true });
  }

  /**
   * Verify and activate two-factor authentication
   */
  async verifyTwoFactor(data: {
    token: string;
    secret: string;
  }): Promise<{ message: string; backupCodes: string[] }> {
    return this.request<{ message: string; backupCodes: string[] }>('post', '/2fa/verify', data, {
      skipRetry: true
    });
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactor(password: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('post', '/2fa/disable', {
      password
    }, { skipRetry: true });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    const user = localStorage.getItem(STORAGE_KEYS.user);
    
    if (!token || !user) {
      return false;
    }

    try {
      // Check if token is expired (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        this.clearAuthData();
        return false;
      }

      return true;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Get stored user data
   */
  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.user);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get stored auth token
   */
  getStoredToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.authToken);
  }

  /**
   * Store authentication data
   */
  private storeAuthData(response: LoginResponse): void {
    const { user, tokens } = response;
    
    localStorage.setItem(STORAGE_KEYS.authToken, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    
    // Set token in HTTP client
    httpClient.setAuthToken(tokens.accessToken);
  }

  /**
   * Clear authentication data
   */
  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.user);
    
    // Clear token from HTTP client
    httpClient.clearAuthToken();
    
    // Clear any cached data
    this.clearCache();
  }

  /**
   * Login with social provider
   */
  async socialLogin(provider: 'google' | 'facebook' | 'github', token: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('post', `/social/${provider}`, {
      token
    }, { skipRetry: true });

    this.storeAuthData(response);
    
    return response;
  }

  /**
   * Check email availability
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    return this.request<{ available: boolean }>('post', '/check-email', {
      email
    }, { skipRetry: true });
  }
}

export const authRepository = new AuthRepository();
export default authRepository;
