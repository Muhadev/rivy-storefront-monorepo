import DiscountRepository from '../repositories/DiscountRepository';
import type { DiscountAttributes } from '../models/Discount';

interface DiscountQuery {
  id?: number;
  code?: string;
  type?: 'percentage' | 'fixed';
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

interface CreateDiscountData {
  code: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  isActive?: boolean;
}

interface UpdateDiscountData {
  description?: string;
  type?: 'percentage' | 'fixed';
  value?: number;
  minOrderAmount?: number;
  maxUses?: number;
  startDate?: Date | string;
  endDate?: Date | string;
  isActive?: boolean;
}

export default class DiscountService {
  static async list(query: DiscountQuery) {
    // Convert boolean strings to actual booleans for database query
    const dbQuery: Partial<DiscountAttributes> = {};
    
    if (query.id !== undefined) dbQuery.id = query.id;
    if (query.code !== undefined) dbQuery.code = query.code;
    if (query.type !== undefined) dbQuery.type = query.type;
    if (query.isActive !== undefined) dbQuery.isActive = query.isActive;
    
    return DiscountRepository.findAll(dbQuery);
  }
  
  static async create(data: CreateDiscountData) {
    // Provide default value for isActive if not specified
    const discountData = {
      ...data,
      isActive: data.isActive ?? true,
      usedCount: 0, // Initialize usage count
      // Convert string dates to Date objects if needed
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined
    };
    return DiscountRepository.create(discountData);
  }
  
  static async update(id: number, data: UpdateDiscountData) {
    // Convert string dates to Date objects if provided
    const updateData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined
    };
    
    const [affectedRows] = await DiscountRepository.update(id, updateData);
    
    if (affectedRows === 0) {
      throw new Error('Discount not found');
    }
    
    // Fetch and return the updated discount
    const updatedDiscounts = await DiscountRepository.findAll({ id });
    return updatedDiscounts[0];
  }
  
  static async delete(id: number) {
    return DiscountRepository.delete(id);
  }

  // Helper method to check if discount is valid and can be used
  static async validateDiscount(code: string, orderAmount: number = 0) {
    const discounts = await DiscountRepository.findAll({ code, isActive: true });
    const discount = discounts[0];
    
    if (!discount) {
      throw new Error('Discount code not found or inactive');
    }

    // Check date validity
    const now = new Date();
    if (discount.startDate && now < discount.startDate) {
      throw new Error('Discount code is not yet valid');
    }
    if (discount.endDate && now > discount.endDate) {
      throw new Error('Discount code has expired');
    }

    // Check minimum order amount
    if (discount.minOrderAmount && orderAmount < discount.minOrderAmount) {
      throw new Error(`Minimum order amount is $${discount.minOrderAmount}`);
    }

    // Check usage limits
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      throw new Error('Discount code has reached its usage limit');
    }

    return discount;
  }

  // Helper method to calculate discount amount
  static calculateDiscountAmount(discount: DiscountAttributes, orderAmount: number): number {
    if (discount.type === 'percentage') {
      return (orderAmount * discount.value) / 100;
    } else {
      return Math.min(discount.value, orderAmount); // Don't exceed order amount
    }
  }
}
