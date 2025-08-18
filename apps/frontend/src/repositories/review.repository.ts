import { apiClient } from '@/lib/api-client';
import { ENDPOINTS } from '@/config/api';

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  product?: {
    id: number;
    name: string;
  };
}

export interface CreateReviewData {
  productId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export class ReviewRepository {
  async getReviews(productId?: number): Promise<Review[]> {
    const url = productId ? `${ENDPOINTS.REVIEWS.LIST}?productId=${productId}` : ENDPOINTS.REVIEWS.LIST;
    return await apiClient.get<Review[]>(url);
  }

  async createReview(data: CreateReviewData): Promise<Review> {
    return await apiClient.post<Review>(ENDPOINTS.REVIEWS.CREATE, data);
  }

  async updateReview(id: number, data: UpdateReviewData): Promise<Review> {
    return await apiClient.put<Review>(ENDPOINTS.REVIEWS.UPDATE(id), data);
  }

  async deleteReview(id: number): Promise<void> {
    await apiClient.delete(ENDPOINTS.REVIEWS.DELETE(id));
  }
}

export const reviewRepository = new ReviewRepository();
