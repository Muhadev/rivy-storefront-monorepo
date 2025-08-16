import { calcTotals } from '../../src/pricing';

test('calcTotals computes correctly', () => {
  const { tax, total } = calcTotals(100, 0.05);
  expect(tax).toBe(5);
  expect(total).toBe(105);
});