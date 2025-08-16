import CartRepository from '../../src/repositories/CartRepository';
import CartItem from '../../src/models/CartItem';

describe('CartRepository', () => {
  beforeAll(async () => { await CartItem.sync({ force: true }); });

  it('should add item to cart', async () => {
    const item = await CartRepository.addItem(1, 1, 2);
    expect(item.userId).toBe(1);
    expect(item.productId).toBe(1);
    expect(item.quantity).toBe(2);
  });

  it('should update item quantity', async () => {
    const item = await CartRepository.updateItem(1, 1, 5);
    expect(item).toBeTruthy();
    expect(item!.quantity).toBe(5);
  });

  it('should remove item from cart', async () => {
    const success = await CartRepository.removeItem(1, 1);
    expect(success).toBe(true);
  });
});
