import { Router } from 'express';
import ReviewController from '.././controllers/ReviewController';
import validate from '../middlewares/validate';
import { createReviewValidator, updateReviewValidator } from '.././validators/reviews';

const router = Router();

router.get('/', ReviewController.list);
router.post('/', validate([createReviewValidator]), ReviewController.create);
router.put('/:id', validate([updateReviewValidator]), ReviewController.update);
router.delete('/:id', ReviewController.delete);

export default router;
