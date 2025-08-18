import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import validate from '../middlewares/validate';
import logger from '../middlewares/logging';
import rateLimit, { authenticatedLimiter } from '../middlewares/rateLimit';
import OrderController from '../controllers/OrderController';
import { createOrderSchema, updateOrderSchema } from '../validators/orders';

const router = Router();

router.post('/', authenticate, authenticatedLimiter, logger, validate([createOrderSchema]), OrderController.create);
router.get('/:id', authenticate, authenticatedLimiter, logger, OrderController.getById);
router.put('/:id', authenticate, authenticatedLimiter, logger, validate([updateOrderSchema]), OrderController.update);
router.delete('/:id', authenticate, authenticatedLimiter, logger, OrderController.delete);
router.post('/:id/cancel', authenticate, authenticatedLimiter, logger, OrderController.cancel);
router.post('/:id/confirm', authenticate, authenticatedLimiter, logger, OrderController.confirm);
router.get('/user/me', authenticate, authenticatedLimiter, logger, OrderController.listByUser);

export default router;