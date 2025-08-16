import DiscountRepository from '../repositories/DiscountRepository';

interface DiscountQuery {
  id?: number;
  code?: string;
  active?: boolean;
  limit?: number;
  offset?: number;
}

interface CreateDiscountData {
  code: string;
  percentage: number;
  active?: boolean;  // Optional with default
}

interface UpdateDiscountData {
  percentage?: number;
  active?: boolean;
}

export default class DiscountService {
  static async list(query: DiscountQuery) {
    return DiscountRepository.findAll(query);
  }
  
  static async create(data: CreateDiscountData) {
    // Provide default value for active if not specified
    const discountData = {
      ...data,
      active: data.active ?? true
    };
    return DiscountRepository.create(discountData);
  }
  
  static async update(id: number, data: UpdateDiscountData) {
    const [affectedRows] = await DiscountRepository.update(id, data);
    
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
}
