import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './ui/Layout'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Confirm from './pages/Confirm'

const router = createBrowserRouter([
  { path: '/', element: <Layout />, children: [
    { index: true, element: <Catalog /> },
    { path: 'product/:id', element: <Product /> },
    { path: 'cart', element: <Cart /> },
    { path: 'checkout', element: <Checkout /> },
    { path: 'confirm/:id', element: <Confirm /> },
  ]}
])

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
