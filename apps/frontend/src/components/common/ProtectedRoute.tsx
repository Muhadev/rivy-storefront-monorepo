/**
 * Protected Route Component
 * Handles authentication and authorization for protected routes
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageLoading } from '../ui/Loading';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'customer' | 'admin' | 'super_admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return <PageLoading message="Checking authentication..." />;
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user role
    if (user.role === 'customer') {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
}
