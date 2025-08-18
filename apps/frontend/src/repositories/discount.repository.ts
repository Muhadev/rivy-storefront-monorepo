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
  totalAmount: number;
}

export interface DiscountResult {
  discount: Discount;
  discountAmount: number;
  finalAmount: number;
}

export class DiscountRepository {
  async getDiscounts(): Promise<Discount[]> {
    return await apiClient.get<Discount[]>(ENDPOINTS.DISCOUNTS.LIST);
  }

  async applyDiscount(data: ApplyDiscountData): Promise<DiscountResult> {
    // For now, we'll simulate discount application since backend doesn't have this endpoint
    // In a real implementation, this would be a POST to /discounts/apply
    const discounts = await this.getDiscounts();
    const discount = discounts.find(d => d.code === data.code && d.isActive);
    
    if (!discount) {
      throw new Error('Invalid discount code');
    }

    if (discount.minOrderAmount && data.totalAmount < discount.minOrderAmount) {
      throw new Error(`Minimum order amount is $${discount.minOrderAmount}`);
    }

    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = (data.totalAmount * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }

    // Ensure discount doesn't exceed order total
    discountAmount = Math.min(discountAmount, data.totalAmount);
    const finalAmount = data.totalAmount - discountAmount;
    
    return {
      discount,
      discountAmount,
      finalAmount
    };
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
