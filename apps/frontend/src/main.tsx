import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { SecurityProvider } from './contexts/SecurityContext'
import { ToastProvider } from './components/ui/Toast'
import { ErrorBoundary } from './components/ui/ErrorBoundary'

// Layouts
import Layout from './ui/Layout'
import { AdminLayout } from './components/dashboard/AdminLayout'

// Public pages
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Confirm from './pages/Confirm'

// Auth pages
import { SignInPage } from './features/auth/SignInPage'
import { SignUpPage } from './features/auth/SignUpPage'

// Admin pages (we'll create these)
import { AdminDashboard } from './features/admin/AdminDashboard'
import { ProductsManagement } from './features/admin/ProductsManagement'
import { OrdersManagement } from './features/admin/OrdersManagement'
import { CustomersManagement } from './features/admin/CustomersManagement'
import { DiscountsManagement } from './features/admin/DiscountsManagement'

// Protected Route Component
import { ProtectedRoute } from './components/common/ProtectedRoute'

const router = createBrowserRouter([
  // Public routes
  { 
    path: '/', 
    element: <Layout />, 
    children: [
      { index: true, element: <Catalog /> },
      { path: 'product/:id', element: <Product /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'confirm/:id', element: <Confirm /> },
    ]
  },
  
  // Auth routes
  { path: '/signin', element: <SignInPage /> },
  { path: '/signup', element: <SignUpPage /> },
  
  // Admin routes (protected)
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'products', element: <ProductsManagement /> },
      { path: 'orders', element: <OrdersManagement /> },
      { path: 'customers', element: <CustomersManagement /> },
      { path: 'discounts', element: <DiscountsManagement /> },
    ]
  }
])

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return [408, 429].includes(error.response.status) && failureCount < 2;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <SecurityProvider>
        <QueryClientProvider client={client}>
          <ToastProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </SecurityProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
