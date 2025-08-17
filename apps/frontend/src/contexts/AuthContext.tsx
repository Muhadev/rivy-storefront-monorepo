/**
 * Authentication Context and Provider
 * Manages global authentication state with React Context
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authRepository } from '../lib/repositories';
import type { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      if (authRepository.isAuthenticated()) {
        // Try to get current user from API
        const currentUser = await authRepository.getCurrentUser();
        setUser(currentUser);
      } else {
        // Check for stored user data
        const storedUser = authRepository.getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear invalid auth data
      await authRepository.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authRepository.login(credentials);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const response = await authRepository.register(userData);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authRepository.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authRepository.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      if (authRepository.isAuthenticated()) {
        const currentUser = await authRepository.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Don't throw error for refresh failures
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user && authRepository.isAuthenticated(),
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for checking user permissions
export function usePermissions() {
  const { user } = useAuth();

  const hasRole = (role: User['role'] | User['role'][]) => {
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const isAdmin = () => hasRole('admin');
  const isSuperAdmin = () => hasRole('admin'); // Using admin since super_admin doesn't exist in User type
  const isCustomer = () => hasRole('customer');

  return {
    user,
    hasRole,
    isAdmin,
    isSuperAdmin,
    isCustomer,
  };
}

export { AuthContext };
export default AuthContext;
