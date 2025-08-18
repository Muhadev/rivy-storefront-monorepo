import { describe, it, expect } from 'vitest';
import { formatPrice, formatDate, truncateText, getOrderStatusColor } from '@/utils/format';

describe('Format utilities', () => {
  describe('formatPrice', () => {
    it('formats price correctly', () => {
      expect(formatPrice(299.99)).toBe('$299.99');
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(1000)).toBe('$1,000.00');
    });
  });

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const result = formatDate('2025-01-15T10:30:00.000Z');
      expect(result).toMatch(/January 15, 2025/);
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 20);
      expect(result).toBe('This is a very long...');
    });

    it('does not truncate short text', () => {
      const shortText = 'Short text';
      const result = truncateText(shortText, 20);
      expect(result).toBe('Short text');
    });
  });

  describe('getOrderStatusColor', () => {
    it('returns correct colors for order statuses', () => {
      expect(getOrderStatusColor('pending')).toBe('bg-yellow-100 text-yellow-800');
      expect(getOrderStatusColor('processing')).toBe('bg-blue-100 text-blue-800');
      expect(getOrderStatusColor('delivered')).toBe('bg-green-100 text-green-800');
      expect(getOrderStatusColor('cancelled')).toBe('bg-red-100 text-red-800');
      expect(getOrderStatusColor('unknown')).toBe('bg-gray-100 text-gray-800');
    });
  });
});