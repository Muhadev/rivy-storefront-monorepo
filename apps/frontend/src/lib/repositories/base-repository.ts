/**
 * Base Repository Pattern Implementation
 * Provides consistent data access layer with caching and error handling
 */

import { httpClient } from '../http-client';
import type { ApiResponse, PaginatedResponse } from '../../types';

export interface RepositoryConfig {
  baseEndpoint: string;
  cacheTimeout?: number;
  retryAttempts?: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export abstract class BaseRepository<T, CreateT = Partial<T>, UpdateT = Partial<T>> {
  protected config: Required<RepositoryConfig>;
  private cache = new Map<string, { data: any; timestamp: number }>();

  constructor(config: RepositoryConfig) {
    this.config = {
      cacheTimeout: 5 * 60 * 1000, // 5 minutes default
      retryAttempts: 3,
      ...config,
    };
  }

  /**
   * Get cache key for a request
   */
  private getCacheKey(endpoint: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramString}`;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.config.cacheTimeout;
  }

  /**
   * Get data from cache if valid
   */
  private getFromCache<R>(key: string): R | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Store data in cache
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear cache for specific pattern or all
   */
  protected clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Make HTTP request with caching and retry logic
   */
  protected async request<R>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    data?: any,
    options: {
      useCache?: boolean;
      skipRetry?: boolean;
      params?: any;
    } = {}
  ): Promise<R> {
    const { useCache = method === 'get', skipRetry = false, params } = options;
    const fullEndpoint = `${this.config.baseEndpoint}${endpoint}`;
    
    // Try cache first for GET requests
    if (useCache) {
      const cacheKey = this.getCacheKey(fullEndpoint, params || data);
      const cached = this.getFromCache<R>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    let lastError: any;
    const maxAttempts = skipRetry ? 1 : this.config.retryAttempts;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        let response: ApiResponse<R>;

        switch (method) {
          case 'get':
            response = await httpClient.get(fullEndpoint, { params });
            break;
          case 'post':
            response = await httpClient.post(fullEndpoint, data);
            break;
          case 'put':
            response = await httpClient.put(fullEndpoint, data);
            break;
          case 'patch':
            response = await httpClient.patch(fullEndpoint, data);
            break;
          case 'delete':
            response = await httpClient.delete(fullEndpoint);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        const result = response.data;

        // Cache successful GET responses
        if (useCache && method === 'get') {
          const cacheKey = this.getCacheKey(fullEndpoint, params || data);
          this.setCache(cacheKey, result);
        }

        // Clear related cache for mutation operations
        if (['post', 'put', 'patch', 'delete'].includes(method)) {
          this.clearCache(this.config.baseEndpoint);
        }

        return result;
      } catch (error) {
        lastError = error;
        
        // Don't retry on client errors (4xx)
        if (error && typeof error === 'object' && 'status' in error) {
          const statusError = error as { status: number };
          if (statusError.status >= 400 && statusError.status < 500) {
            break;
          }
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < maxAttempts) {
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    throw lastError;
  }

  /**
   * Find all records with pagination and filtering
   */
  async findAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
    return this.request<PaginatedResponse<T>>('get', '', null, { params });
  }

  /**
   * Find a single record by ID
   */
  async findById(id: number | string): Promise<T> {
    return this.request<T>('get', `/${id}`);
  }

  /**
   * Create a new record
   */
  async create(data: CreateT): Promise<T> {
    return this.request<T>('post', '', data, { skipRetry: true });
  }

  /**
   * Update an existing record
   */
  async update(id: number | string, data: UpdateT): Promise<T> {
    return this.request<T>('put', `/${id}`, data, { skipRetry: true });
  }

  /**
   * Partially update an existing record
   */
  async patch(id: number | string, data: Partial<UpdateT>): Promise<T> {
    return this.request<T>('patch', `/${id}`, data, { skipRetry: true });
  }

  /**
   * Delete a record
   */
  async delete(id: number | string): Promise<void> {
    return this.request<void>('delete', `/${id}`, null, { skipRetry: true });
  }

  /**
   * Search records
   */
  async search(query: string, params?: Omit<QueryParams, 'search'>): Promise<PaginatedResponse<T>> {
    return this.request<PaginatedResponse<T>>('get', '/search', null, {
      params: { ...params, search: query }
    });
  }

  /**
   * Get repository statistics
   */
  async getStats(): Promise<any> {
    return this.request<any>('get', '/stats');
  }

  /**
   * Bulk operations
   */
  async bulkCreate(data: CreateT[]): Promise<T[]> {
    return this.request<T[]>('post', '/bulk', data, { skipRetry: true });
  }

  async bulkUpdate(updates: Array<{ id: number | string; data: UpdateT }>): Promise<T[]> {
    return this.request<T[]>('patch', '/bulk', updates, { skipRetry: true });
  }

  async bulkDelete(ids: Array<number | string>): Promise<void> {
    return this.request<void>('delete', '/bulk', { ids }, { skipRetry: true });
  }

  /**
   * Export data
   */
  async export(format: 'csv' | 'xlsx' | 'json' = 'csv', filters?: any): Promise<Blob> {
    const response = await httpClient.getInstance().get(
      `${this.config.baseEndpoint}/export`,
      {
        params: { format, ...filters },
        responseType: 'blob',
      }
    );
    return response.data;
  }

  /**
   * Import data
   */
  async import(file: File, options?: any): Promise<{ success: number; failed: number; errors?: any[] }> {
    const result = await httpClient.uploadFile(`${this.config.baseEndpoint}/import`, file);
    const data = result.data as any;
    return {
      success: data?.success || 0,
      failed: data?.failed || 0,
      errors: data?.errors || []
    };
  }
}
