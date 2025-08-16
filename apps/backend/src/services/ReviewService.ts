import ReviewRepository from '../repositories/ReviewRepository';
import { ReviewAttributes } from '../models/Review';

interface ReviewQuery {
  productId?: number;
  userId?: number;
  rating?: number;
  limit?: number;
  offset?: number;
}

interface CreateReviewData {
  productId: number;
  userId: number;
  rating: number;
  comment: string;  // Required to match model
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

export default class ReviewService {
  static async list(query: ReviewQuery) {
    return ReviewRepository.findAll(query);
  }
  
  static async create(data: CreateReviewData) {
    return ReviewRepository.create(data);
  }
  
  static async update(id: string, data: UpdateReviewData) {
    const [affectedRows] = await ReviewRepository.update(Number(id), data);
    
    if (affectedRows === 0) {
      throw new Error('Review not found');
    }
    
    return ReviewRepository.findById(Number(id));
  }
  
  static async delete(id: string) {
    return ReviewRepository.delete(Number(id));
  }
}
