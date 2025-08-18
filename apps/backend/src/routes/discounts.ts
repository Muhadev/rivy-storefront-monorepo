import { Router } from 'express';
import DiscountController from '../controllers/DiscountController';
import validate from '../middlewares/validate';
import { createDiscountValidator, updateDiscountValidator } from '.././validators/discounts';

const router = Router();

router.get('/', DiscountController.list);
router.post('/', validate([createDiscountValidator]), DiscountController.create);
router.put('/:id', validate([updateDiscountValidator]), DiscountController.update);
router.delete('/:id', DiscountController.delete);

// Apply and validate discount code
router.post('/apply', DiscountController.applyDiscount);

export default router;
