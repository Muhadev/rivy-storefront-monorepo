import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export class UserRepository {
  async getProfile(): Promise<User> {
    return await apiClient.get<User>(ENDPOINTS.USERS.PROFILE);
  }

  async updateProfile(data: UpdateUserData): Promise<User> {
    return await apiClient.put<User>(ENDPOINTS.USERS.UPDATE, data);
  }

  async deleteAccount(): Promise<void> {
    await apiClient.delete(ENDPOINTS.USERS.DELETE);
  }
}

export const userRepository = new UserRepository();
