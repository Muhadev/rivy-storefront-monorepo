import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';
import { 
  Product, 
  Category, 
  ProductFilters, 
  ApiResponse, 
  PaginatedResponse,
  BackendProductsResponse 
} from '@/types/api';

export class ProductRepository {
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    // Get the backend response
    const backendResponse = await apiClient.get<BackendProductsResponse>(
      ENDPOINTS.PRODUCTS.LIST,
      filters
    );
    
    // Transform to frontend expected format
    return {
      data: backendResponse.products,
      pagination: {
        ...backendResponse.pagination,
        hasPrev: backendResponse.pagination.hasPrevious // Map backend 'hasPrevious' to frontend 'hasPrev'
      }
    };
  }

  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return response.data;
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.CREATE,
      productData
    );
    return response.data;
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.UPDATE(id),
      productData
    );
    return response.data;
  }

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));
  }

  async getCategories(): Promise<Category[]> {
    // Categories are returned directly as an array from backend
    const categories = await apiClient.get<Category[]>(
      ENDPOINTS.PRODUCTS.CATEGORIES
    );
    
    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        try {
          const products = await this.getProducts({ category: category.id, limit: 1 });
          return {
            ...category,
            productCount: products.pagination.total
          };
        } catch (error) {
          return {
            ...category,
            productCount: 0
          };
        }
      })
    );
    
    return categoriesWithCounts;
  }
}

export const productRepository = new ProductRepository();