import Discount, { DiscountAttributes, DiscountCreation } from '../models/Discount';
class DiscountRepository {
  static async findAll(query: Partial<DiscountAttributes>) {
    // Implement filtering/search logic here
    return Discount.findAll({ where: query });
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
}

export default DiscountRepository;
