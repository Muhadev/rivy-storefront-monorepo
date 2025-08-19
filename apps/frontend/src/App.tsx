import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminOrders } from '@/pages/admin/AdminOrders';
import { AdminReviews } from '@/pages/admin/AdminReviews';
import { AdminReviewForm } from '@/pages/admin/AdminReviewForm';
import { AdminDiscountForm } from '@/pages/admin/AdminDiscountForm';
import { AdminDiscounts } from '@/pages/admin/AdminDiscounts';
import { AdminProfile } from '@/pages/admin/AdminProfile';
import { AdminCustomers } from '@/pages/admin/AdminCustomers';
import AdminProductForm from '@/pages/admin/AdminProductForm';
import ProfilePage from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 429 (rate limit) or 401 (unauthorized) errors
        if (error?.response?.status === 429 || error?.response?.status === 401) {
          return false;
        }
        // Retry other errors up to 2 times
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to conditionally render Header
function ConditionalHeader() {
  const location = useLocation();
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  const adminRoutes = ['/admin'];
  
  // Don't render header on auth pages or admin pages
  if (authRoutes.includes(location.pathname) || location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Header />;
}

// Component to conditionally render Footer
function ConditionalFooter() {
  const location = useLocation();
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];
  const adminRoutes = ['/admin'];
  
  // Don't render footer on auth pages or admin pages
  if (authRoutes.includes(location.pathname) || location.pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Footer />;
}

function AppContent() {
  const { isAuthenticated, user } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    // Fetch cart when user is authenticated
    if (isAuthenticated) {
      fetchCart().catch(() => {
        // Silent fail - cart might be empty or user might not have permission
      });
    }
  }, [isAuthenticated, fetchCart]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ConditionalHeader />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
              <Route path="products">
                <Route index element={<AdminProducts />} />
                <Route path="new" element={<AdminProductForm />} />
                <Route path=":id/edit" element={<AdminProductForm />} />
              </Route>
              <Route path="orders" element={<AdminOrders />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="reviews/new" element={<AdminReviewForm />} />
              <Route path="reviews/:id/edit" element={<AdminReviewForm />} />
              <Route path="discounts" element={<AdminDiscounts />} />
              <Route path="discounts/new" element={<AdminDiscountForm />} />
              <Route path="discounts/:id/edit" element={<AdminDiscountForm />} />
              <Route path="customers" element={<AdminCustomers />} />
              {/* Add more admin routes here */}
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      
      <ConditionalFooter />
    </div>
  );
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  );
}

export default App;