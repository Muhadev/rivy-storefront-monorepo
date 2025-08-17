/**
 * Customer Repository
 * Handles all customer-related API operations
 */

import { BaseRepository } from './base-repository';
import type { User, CustomerFilters, CreateCustomerData, UpdateCustomerData } from '../../types';

class CustomerRepository extends BaseRepository<User, CreateCustomerData, UpdateCustomerData> {
  private endpoint = '/users';

  constructor() {
    super({
      baseEndpoint: '/users',
    });
  }

  async getAll(filters?: CustomerFilters) {
    return this.request<User[]>('get', '', undefined, { params: filters });
  }

  async getById(id: number) {
    return this.request<User>('get', `/${id}`);
  }

  async create(data: CreateCustomerData) {
    return this.request<User>('post', '', data);
  }

  async update(id: number, data: UpdateCustomerData) {
    return this.request<User>('put', `/${id}`, data);
  }

  async delete(id: number): Promise<void> {
    return this.request<void>('delete', `/${id}`);
  }

  async activate(id: number) {
    return this.request<User>('patch', `/${id}/activate`);
  }

  async deactivate(id: number) {
    return this.request<User>('patch', `/${id}/deactivate`);
  }

  async getCustomerStats() {
    return this.request<any>('get', '/stats');
  }
}

export const customerRepository = new CustomerRepository();
export type { CreateCustomerData, UpdateCustomerData };
