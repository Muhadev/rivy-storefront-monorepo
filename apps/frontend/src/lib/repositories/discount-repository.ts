/**
 * Discount Repository
 * Handles all discount-related API operations
 */

import { BaseRepository } from './base-repository';
import type { Discount, CreateDiscountData, UpdateDiscountData, DiscountFilters } from '../../types';

class DiscountRepository extends BaseRepository<Discount, CreateDiscountData, UpdateDiscountData> {
  private endpoint = '/discounts';

  constructor() {
    super({
      baseEndpoint: '/discounts',
    });
  }

  async getAll(filters?: DiscountFilters) {
    return this.request<Discount[]>('get', '', undefined, { params: filters });
  }

  async getById(id: number) {
    return this.request<Discount>('get', `/${id}`);
  }

  async create(data: CreateDiscountData) {
    return this.request<Discount>('post', '', data);
  }

  async update(id: number, data: UpdateDiscountData) {
    return this.request<Discount>('put', `/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return this.request<void>('delete', `/${id}`);
  }

  async activate(id: number) {
    return this.request<Discount>('patch', `/${id}/activate`);
  }

  async deactivate(id: number) {
    return this.request<Discount>('patch', `/${id}/deactivate`);
  }

  async validateCode(code: string) {
    return this.request<{ valid: boolean; discount?: Discount }>('post', '/validate', { code });
  }
}

export const discountRepository = new DiscountRepository();
export type { CreateDiscountData, UpdateDiscountData };
