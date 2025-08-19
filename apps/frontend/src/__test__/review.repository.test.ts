import { describe, it, expect, vi } from 'vitest';
import { reviewRepository } from '@/repositories/review.repository';

vi.mock('../lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('ReviewRepository', () => {
  it('should get reviews', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.get.mockResolvedValueOnce([]);
    const reviews = await reviewRepository.getReviews();
    expect(reviews).toEqual([]);
  });

  it('should create review', async () => {
  const apiClient = require('../lib/api-client').apiClient;
    apiClient.post.mockResolvedValueOnce({ id: 1 });
    const review = await reviewRepository.createReview({ productId: 1, rating: 5, comment: 'Great!' });
    expect(review.id).toBe(1);
  });
});
