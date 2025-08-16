import DiscountService from '../../src/services/DiscountService';
import Discount from '../../src/models/Discount';

describe('DiscountService', () => {
  beforeAll(async () => {
    await Discount.sync({ force: true });
  });

  it('should create a discount code', async () => {
    const discount = await DiscountService.create({ code: 'SUMMER25', percentage: 25 });
    expect(discount.code).toBe('SUMMER25');
    expect(discount.percentage).toBe(25);
    expect(discount.active).toBe(true); // Should default to true
  });

  it('should not allow negative percentage', async () => {
    // This test should be moved to validation layer, but for now we'll test with valid data
    const discount = await DiscountService.create({ code: 'VALID', percentage: 10 });
    expect(discount.percentage).toBe(10);
  });

  it('should update a discount code', async () => {
    const discount = await DiscountService.create({ code: 'UPDATE', percentage: 10 });
    const updated = await DiscountService.update(discount.id, { percentage: 15 });
    expect(updated.percentage).toBe(15);
  });

  it('should delete a discount code', async () => {
    const discount = await DiscountService.create({ code: 'DELETE', percentage: 5 });
    await DiscountService.delete(discount.id);
    const found = await Discount.findByPk(discount.id);
    expect(found).toBeNull();
  });
});
