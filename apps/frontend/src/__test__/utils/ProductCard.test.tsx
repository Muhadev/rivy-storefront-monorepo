import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/types/api';

// Mock stores
vi.mock('@/stores/cart.store', () => ({
  useCartStore: () => ({
    addToCart: vi.fn(),
  }),
}));

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    isAuthenticated: true,
  }),
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockProduct: Product = {
  id: 1,
  name: 'Test Solar Panel',
  description: 'A test solar panel for testing',
  price: 299.99,
  stock: 10,
  categoryId: 1,
  imageUrl: 'https://example.com/image.jpg',
  category: {
    id: 1,
    name: 'Solar Panels',
    description: 'Solar panel category',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  averageRating: 4.5,
  reviewCount: 10,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product information correctly', () => {
    const onViewDetails = vi.fn();
    
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} onViewDetails={onViewDetails} />
      </TestWrapper>
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText('$299.99')).toBeInTheDocument();
    expect(screen.getByText('Solar Panels')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('calls onViewDetails when view button is clicked', () => {
    const onViewDetails = vi.fn();
    
    render(
      <TestWrapper>
        <ProductCard product={mockProduct} onViewDetails={onViewDetails} />
      </TestWrapper>
    );

    const viewButton = screen.getByRole('button', { name: /view/i });
    fireEvent.click(viewButton);
    
    expect(onViewDetails).toHaveBeenCalledWith(mockProduct);
  });

  it('shows out of stock badge when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    
    render(
      <TestWrapper>
        <ProductCard product={outOfStockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('shows low stock badge when stock is 5 or less', () => {
    const lowStockProduct = { ...mockProduct, stock: 3 };
    
    render(
      <TestWrapper>
        <ProductCard product={lowStockProduct} />
      </TestWrapper>
    );

    expect(screen.getByText('Low Stock')).toBeInTheDocument();
  });
});