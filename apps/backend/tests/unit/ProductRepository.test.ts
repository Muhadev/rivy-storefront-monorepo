
import ProductRepository from '../../src/repositories/ProductRepository';
import '../../src/models'; // Import models with associations
import Product from '../../src/models/Product';
import { setupTestDatabase, cleanupTestDatabase } from '../testHelpers';

jest.setTimeout(30000); // Increase timeout for slow DB setup

describe('ProductRepository', () => {
  let dbSetupDone = false;
  beforeAll(async () => {
    if (!dbSetupDone) {
      await setupTestDatabase();
      dbSetupDone = true;
    }
  });

  afterAll(async () => {
    if (dbSetupDone) {
      await cleanupTestDatabase();
      dbSetupDone = false;
    }
  });

  it('should create a product', async () => {
  const product = await ProductRepository.create({ name: 'Test Product', description: 'Desc', price: 10, stock: 5, createdBy: 1 });
    expect(product.name).toBe('Test Product');
  });

  it('should find all products', async () => {
    const result = await ProductRepository.getAll({ page: 1, limit: 10 });
    expect(result.products).toBeDefined();
    expect(Array.isArray(result.products)).toBe(true);
    expect(result.pagination).toBeDefined();
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
  });

  it('should update a product', async () => {
  const product = await ProductRepository.create({ name: 'Upd Product', description: 'Desc', price: 20, stock: 10, createdBy: 1 });
  const updated = await ProductRepository.update(product.id, { price: 25 }, 1);
    expect(updated).toBeTruthy();
    expect(updated!.price).toBe(25);
  });

  it('should delete a product', async () => {
  const product = await ProductRepository.create({ name: 'Del Product', description: 'Desc', price: 30, stock: 15, createdBy: 1 });
  await ProductRepository.delete(product.id, 1);
    const found = await Product.findByPk(product.id);
    expect(found).toBeNull();
  });
});
