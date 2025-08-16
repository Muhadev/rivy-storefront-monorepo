import { Router } from 'express';
import CartController from '../controllers/CartController';
import { authenticate } from '../middlewares/auth';
import validate from '../middlewares/validate';
import { addItemSchema, updateItemSchema, removeItemSchema } from '../validators/cart';
import rateLimit from '../middlewares/rateLimit';
import logger from '../middlewares/logging';
import retryMiddleware from '../middlewares/retry';

const router = Router();

router.get('/', authenticate, retryMiddleware(), rateLimit, logger, CartController.getCart);
router.post('/items', authenticate, rateLimit, logger, validate([addItemSchema]), CartController.addItem);
router.patch('/items/:productId', authenticate, rateLimit, logger, validate([updateItemSchema]), CartController.updateItem);
router.delete('/items/:productId', authenticate, rateLimit, logger, CartController.removeItem);
router.delete('/clear', authenticate, rateLimit, logger, CartController.clearCart);

export default router;