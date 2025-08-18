import { Router } from 'express';
import CheckoutController from '../controllers/CheckoutController';
import { authenticate } from '../middlewares/auth';
import validate from '../middlewares/validate';
import { checkoutSchema } from '../validators/checkout';
import rateLimit from '../middlewares/rateLimit';
import logger from '../middlewares/logging';

const router = Router();

router.post('/', authenticate, rateLimit, logger, validate([checkoutSchema]), CheckoutController.checkout);

export default router;