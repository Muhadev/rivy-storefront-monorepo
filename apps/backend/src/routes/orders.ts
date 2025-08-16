import { Router } from 'express';
import OrderController from '../controllers/OrderController';
import { authenticate } from '../middlewares/auth';
import validate from '../middlewares/validate';
import rateLimit from '../middlewares/rateLimit';
import logger from '../middlewares/logging';
import retryMiddleware from '../middlewares/retry';
import { createOrderSchema, updateOrderSchema } from '../validators/orders';

const router = Router();

router.post('/', authenticate, rateLimit, logger, validate([createOrderSchema]), OrderController.create);
router.get('/:id', authenticate, retryMiddleware(), rateLimit, logger, OrderController.getById);
router.put('/:id', authenticate, rateLimit, logger, validate([updateOrderSchema]), OrderController.update);
router.delete('/:id', authenticate, rateLimit, logger, OrderController.delete);

router.post('/:id/confirm', authenticate, rateLimit, logger, OrderController.confirm);
router.get('/user/me', authenticate, retryMiddleware(), rateLimit, logger, OrderController.listByUser);

export default router;