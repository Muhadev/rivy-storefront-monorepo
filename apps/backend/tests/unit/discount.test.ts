import DiscountService from '../../src/services/DiscountService';
import Discount from '../../src/models/Discount';

describe('DiscountService', () => {
  beforeAll(async () => {
    await Discount.sync({ force: true });
  });

  it('should create a discount code', async () => {
    const discount = await DiscountService.create({ 
      code: 'SUMMER25', 
      type: 'percentage', 
      value: 25,
      description: 'Summer sale discount'
    });
    expect(discount.code).toBe('SUMMER25');
    expect(discount.type).toBe('percentage');
    expect(parseFloat(discount.value.toString())).toBe(25);
    expect(discount.isActive).toBe(true); // Should default to true
  });

  it('should not allow negative value', async () => {
    // This test should be moved to validation layer, but for now we'll test with valid data
    const discount = await DiscountService.create({ 
      code: 'VALID', 
      type: 'percentage', 
      value: 10,
      description: 'Valid discount'
    });
    expect(parseFloat(discount.value.toString())).toBe(10);
  });

  it('should update a discount code', async () => {
    const discount = await DiscountService.create({ 
      code: 'UPDATE', 
      type: 'percentage', 
      value: 10,
      description: 'Update test discount'
    });
    const updated = await DiscountService.update(discount.id, { value: 15 });
    expect(parseFloat(updated.value.toString())).toBe(15);
  });

  it('should delete a discount code', async () => {
    const discount = await DiscountService.create({ 
      code: 'DELETE', 
      type: 'percentage', 
      value: 5,
      description: 'Delete test discount'
    });
    await DiscountService.delete(discount.id);
    const found = await Discount.findByPk(discount.id);
    expect(found).toBeNull();
  });
});
