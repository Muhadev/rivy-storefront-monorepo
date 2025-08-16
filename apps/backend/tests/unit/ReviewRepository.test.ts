import ReviewRepository from '../../src/repositories/ReviewRepository';
import Review from '../../src/models/Review';

describe('ReviewRepository', () => {
  beforeAll(async () => { await Review.sync({ force: true }); });

  it('should create a review', async () => {
    const review = await ReviewRepository.create({ productId: 1, userId: 1, rating: 5, comment: 'Great!' });
    expect(review.rating).toBe(5);
  });

  it('should find all reviews', async () => {
    const reviews = await ReviewRepository.findAll({});
    expect(reviews.length).toBeGreaterThan(0);
  });

  it('should update a review', async () => {
    const review = await ReviewRepository.create({ productId: 2, userId: 2, rating: 4, comment: 'Good' });
    await ReviewRepository.update(review.id, { rating: 3 });
    const updated = await Review.findByPk(review.id);
    expect(updated).toBeTruthy();
    if (updated) {
      expect(updated.rating).toBe(3);
    }
  });

  it('should delete a review', async () => {
    const review = await ReviewRepository.create({ productId: 3, userId: 3, rating: 2, comment: 'Bad' });
    await ReviewRepository.delete(review.id);
    const found = await Review.findByPk(review.id);
    expect(found).toBeNull();
  });
});
