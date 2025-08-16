
import Review, { ReviewAttributes, ReviewCreation } from '../models/Review';

class ReviewRepository {
  static async findAll(query: Partial<ReviewAttributes>) {
    // Implement filtering/search logic here
    return Review.findAll({ where: query });
  }
  static async findById(id: number) {
    return Review.findByPk(id);
  }
  static async create(data: ReviewCreation) {
    return Review.create(data);
  }
  static async update(id: number, data: Partial<ReviewAttributes>) {
    return Review.update(data, { where: { id } });
  }
  static async delete(id: number) {
    return Review.destroy({ where: { id } });
  }
}

export default ReviewRepository;
