import { create } from 'zustand';
import { Review, CreateReviewData, UpdateReviewData } from '@/repositories/review.repository';
import { reviewRepository } from '@/repositories/review.repository';

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  fetchReviews: (productId?: number) => Promise<void>;
  createReview: (data: CreateReviewData) => Promise<Review>;
  updateReview: (id: number, data: UpdateReviewData) => Promise<Review>;
  deleteReview: (id: number) => Promise<void>;
  getProductReviews: (productId: number) => Review[];
  getAverageRating: (productId: number) => number;
  setLoading: (loading: boolean) => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  isLoading: false,

  fetchReviews: async (productId?: number) => {
    set({ isLoading: true });
    try {
      const reviews = await reviewRepository.getReviews(productId);
      set({ reviews, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createReview: async (data: CreateReviewData) => {
    set({ isLoading: true });
    try {
      const review = await reviewRepository.createReview(data);
      set(state => ({ 
        reviews: [...state.reviews, review], 
        isLoading: false 
      }));
      return review;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateReview: async (id: number, data: UpdateReviewData) => {
    set({ isLoading: true });
    try {
      const updatedReview = await reviewRepository.updateReview(id, data);
      set(state => ({
        reviews: state.reviews.map(review => 
          review.id === id ? updatedReview : review
        ),
        isLoading: false
      }));
      return updatedReview;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteReview: async (id: number) => {
    set({ isLoading: true });
    try {
      await reviewRepository.deleteReview(id);
      set(state => ({
        reviews: state.reviews.filter(review => review.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getProductReviews: (productId: number) => {
    return get().reviews.filter(review => review.productId === productId);
  },

  getAverageRating: (productId: number) => {
    const productReviews = get().getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
