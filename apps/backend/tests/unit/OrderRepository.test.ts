import OrderRepository from '../../src/repositories/OrderRepository';
import Order from '../../src/models/Order';

describe('OrderRepository', () => {
  beforeAll(async () => { await Order.sync({ force: true }); });

  it('should create an order', async () => {
    const order = await OrderRepository.create({ userId: 1, total: 100, address: 'Test St' });
    expect(order.userId).toBe(1);
    expect(order.total).toBe(100);
  });

  it('should get order by id', async () => {
    const order = await OrderRepository.create({ userId: 2, total: 200, address: 'Test Ave' });
    const found = await OrderRepository.getById(order.id);
    expect(found).toBeTruthy();
    if (found) {
      expect(found.id).toBe(order.id);
    }
  });

  it('should update an order', async () => {
    const order = await OrderRepository.create({ userId: 3, total: 300, address: 'Test Blvd' });
    const updated = await OrderRepository.update(order.id, { total: 350 });
    expect(updated).toBeTruthy();
    if (updated) {
      expect(updated.total).toBe(350);
    }
  });

  it('should delete an order', async () => {
    const order = await OrderRepository.create({ userId: 4, total: 400, address: 'Test Rd' });
    const success = await OrderRepository.delete(order.id);
    expect(success).toBe(true);
  });
});
