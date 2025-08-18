import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';

export interface Discount {
  id: number;
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyDiscountData {
  code: string;
  orderAmount: number;
}

export interface DiscountResult {
  discount: Discount;
  amount: number;
}

export class DiscountRepository {
  async getDiscounts(): Promise<Discount[]> {
    return await apiClient.get<Discount[]>(ENDPOINTS.DISCOUNTS.LIST);
  }

  async applyDiscount(data: ApplyDiscountData): Promise<DiscountResult> {
  // Real backend call
  const response = await apiClient.post<DiscountResult>(ENDPOINTS.DISCOUNTS.APPLY, data);
  return response;
  }

  async validateDiscount(code: string): Promise<Discount> {
    // For now, we'll validate by checking if the discount exists
    // In a real implementation, this would be a GET to /discounts/validate/:code
    const discounts = await this.getDiscounts();
    const discount = discounts.find(d => d.code === code && d.isActive);
    
    if (!discount) {
      throw new Error('Invalid discount code');
    }
    
    return discount;
  }
}

export const discountRepository = new DiscountRepository();
