import Discount, { DiscountAttributes, DiscountCreation } from '../models/Discount';

class DiscountRepository {
  static async findAll(query: Partial<DiscountAttributes>) {
    // Build where clause for filtering
    const where: any = {};
    
    if (query.id !== undefined) where.id = query.id;
    if (query.code !== undefined) where.code = query.code;
    if (query.type !== undefined) where.type = query.type;
    if (query.isActive !== undefined) where.isActive = query.isActive;
    
    return Discount.findAll({ 
      where,
      order: [['createdAt', 'DESC']] // Most recent first
    });
  }
  
  static async findById(id: number) {
    return Discount.findByPk(id);
  }
  
  static async findByCode(code: string) {
    return Discount.findOne({ where: { code } });
  }
  
  static async create(data: DiscountCreation) {
    return Discount.create(data);
  }
  
  static async update(id: number, data: Partial<DiscountAttributes>) {
    return Discount.update(data, { where: { id } });
  }
  
  static async delete(id: number) {
    return Discount.destroy({ where: { id } });
  }

  // Increment usage count when discount is applied
  static async incrementUsage(id: number) {
    return Discount.increment('usedCount', { where: { id } });
  }
}

export default DiscountRepository;
