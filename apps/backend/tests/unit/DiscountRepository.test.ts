import DiscountRepository from '../../src/repositories/DiscountRepository';
import Discount from '../../src/models/Discount';

describe('DiscountRepository', () => {
  beforeAll(async () => { await Discount.sync({ force: true }); });

  it('should create a discount', async () => {
    const discount = await DiscountRepository.create({ code: 'TEST', percentage: 10, active: true });
    expect(discount.code).toBe('TEST');
  });

  it('should find all discounts', async () => {
    const discounts = await DiscountRepository.findAll({});
    expect(discounts.length).toBeGreaterThan(0);
  });

  it('should update a discount', async () => {
    const discount = await DiscountRepository.create({ code: 'UPD', percentage: 5, active: true });
    await DiscountRepository.update(discount.id, { percentage: 15 });
    const updated = await Discount.findByPk(discount.id);
    expect(updated!.percentage).toBe(15);
  });

  it('should delete a discount', async () => {
    const discount = await DiscountRepository.create({ code: 'DEL', percentage: 5, active: true });
    await DiscountRepository.delete(discount.id);
    const found = await Discount.findByPk(discount.id);
    expect(found).toBeNull();
  });
});
