export function calcTotals(subtotal: number, taxRate: number) {
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  return { tax, total };
}
